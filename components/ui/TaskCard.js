import { useState, useEffect, useRef, forwardRef } from 'react';
import { format, parseISO } from 'date-fns';
import CustomSelect from '../ui/CustomSelect';
import useProjects from '../../hooks/useProjects';
import useTags from '../../hooks/useTags';
import { useUser } from '../../contexts/userContext';

import { FaEdit } from 'react-icons/fa';
import styles from '../../styles/TaskCard.module.scss';

const TaskCard = forwardRef(
  (
    { task, tasks, setShowCard, taskDetails, setTaskDetails, onSave, valid },
    ref
  ) => {
    const [edit, setEdit] = useState(task ? false : true);
    const [projectOptions, setProjectOptions] = useState([]);
    const [tagOptions, setTagOptions] = useState([]);
    const [errors, setErrors] = useState({
      name: '',
      project: '',
      tags: '',
      date: '',
    });

    const [{ id: userId }] = useUser();

    const { projects, setProjects } = useProjects(userId, {
      revalidateOnMount: true,
    });

    const { tags, setTags } = useTags(userId, { revalidateOnMount: true });

    const today = format(new Date(), 'yyyy-MM-dd');

    const hasErrors = Object.keys(errors).some((key) => errors[key]);

    const defaultDetails = useRef(taskDetails);

    const taskOptions = useRef(
      !task &&
        [...tasks]
          .sort((a, b) => a.name.localeCompare(b.name))
          .reduce((acc, curr) => {
            const isUnique = !acc.some((option) => option.label === curr.name);

            if (isUnique) acc.push({ label: curr.name, value: curr.id });

            return acc;
          }, [])
    );

    const priorityOptions = [
      { label: 'Low', value: 'P3' },
      { label: 'Medium', value: 'P2' },
      { label: 'High', value: 'P1' },
    ];

    useEffect(() => {
      return () => setTaskDetails(defaultDetails.current);
    }, [setTaskDetails]);

    useEffect(() => {
      if (projects?.length && !projectOptions.length) {
        const options = projects.map((project) => ({
          label: project.name,
          value: project.id,
        }));

        setProjectOptions(options);
      }

      if (tags?.length && !tagOptions.length) {
        const options = tags.map((tag) => ({
          label: tag.name,
          value: tag.id,
        }));

        setTagOptions(options);
      }
    }, [projects, projectOptions, tags, tagOptions]);

    useEffect(() => {
      const isUnique = task
        ? !tasks.some(
            (t) =>
              t.name === taskDetails.name &&
              t.date === taskDetails.date &&
              t.id !== task.id
          )
        : !tasks.some(
            (t) => t.name === taskDetails.name && t.date === taskDetails.date
          );

      if (isUnique && errors.name) {
        setErrors({ ...errors, name: '' });
      } else if (!isUnique && !errors.name)
        setErrors({ ...errors, name: 'Task already exists' });

      if (errors.project || errors.tags) {
        const timeout = setTimeout(
          () => setErrors({ ...errors, project: '', tags: '' }),
          3000
        );

        return () => clearTimeout(timeout);
      }
    }, [task, tasks, taskDetails, errors]);

    const onNewProject = async (project) => {
      const name = project
        .trim()
        .split(' ')
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');

      if (name.length > 30)
        return setErrors({ ...errors, project: 'Exceeded 30 characters' });

      const data = await fetch(`/api/user/${userId}/projects`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name }),
      }).then((res) => res.json());

      if (data.error) return alert(data.error);

      const newOption = { label: name, value: data.id };

      setProjectOptions([...projectOptions, newOption]);

      setProjects();

      return newOption;
    };

    const onNewTag = async (tag) => {
      const name = tag
        .trim()
        .split(' ')
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');

      if (name.length > 30)
        return setErrors({ ...errors, tags: 'Exceeded 30 characters' });

      const data = await fetch(`/api/user/${userId}/tags`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name }),
      }).then((res) => res.json());

      if (data.error) return alert(data.error);

      const newOption = { label: name, value: data.id };

      setTagOptions([...tagOptions, newOption]);

      setTags();

      return newOption;
    };

    const onDetailChange = (target) => {
      if (target.name === 'name' && target.value.length > 30) {
        setTaskDetails({ ...taskDetails, name: target.value });

        setErrors({ ...errors, name: 'Exceeded 30 characters' });
      } else if (
        target.name === 'date' &&
        (target.value < today || task?.date < today)
      ) {
        if (target.value < today) {
          setTaskDetails({ ...taskDetails, date: target.value });

          setErrors({ ...errors, date: 'Invalid date' });
        } else setErrors({ ...errors, date: 'Cannot modify date' });
      } else if (target.name === 'task') {
        const task = tasks.find((task) => task.id === target.value);

        if (!task) {
          setErrors({ name: '', project: '', tags: '', date: '' });

          return setTaskDetails(defaultDetails.current);
        }

        setTaskDetails({
          ...task,
          project: task?.project?.id,
          tags: task.tags.map((tag) => tag.id),
          date: today,
        });
      } else {
        setTaskDetails({ ...taskDetails, [target.name]: target.value });

        setErrors({
          ...errors,
          ...(errors[target.name] && { [target.name]: '' }),
        });
      }
    };

    return (
      <div className={styles.taskCard} ref={ref}>
        <div
          className={`${styles.taskCardInner} ${
            task && edit ? styles.edit : ''
          }`}
        >
          {task && (
            <div className={styles.cardFront}>
              <h3>{task.name}</h3>
              <label>
                Project
                {task.project && (
                  <span className={styles.project}>{task?.project?.name}</span>
                )}
              </label>
              <label>
                Tags
                <div className={styles.tags}>
                  {task.tags &&
                    task.tags.map((tag) => (
                      <span key={tag.id}>{tag.name}</span>
                    ))}
                </div>
              </label>
              <label>
                Priority
                <span>
                  {task.priority === 'P3'
                    ? 'Low'
                    : task.priority === 'P2'
                    ? 'Medium'
                    : 'High'}
                  <style jsx>{`
                    span {
                      color: ${task.priority === 'P3'
                        ? '#8f0'
                        : task.priority === 'P2'
                        ? '#08f'
                        : '#f08'};
                    }
                  `}</style>
                </span>
              </label>
              <label>
                Date{' '}
                <span className={styles.date}>
                  {format(parseISO(task.date), 'MMM d, yyyy')}
                </span>
              </label>
              <label>
                Notes <p>{task.notes}</p>
              </label>
              {!edit && (
                <button
                  className={styles.btnEdit}
                  onClick={() => setEdit(!edit)}
                >
                  <FaEdit />
                </button>
              )}
              {!edit && (
                <button
                  className={styles.btnClose}
                  onClick={() => setShowCard(false)}
                >
                  ✕
                </button>
              )}
            </div>
          )}

          <div className={`${task ? styles.cardBack : styles.cardFront}`}>
            {!task && (
              <>
                <h2>Add or Select Task</h2>
                <CustomSelect
                  name='task'
                  options={taskOptions.current}
                  onInputChange={onDetailChange}
                  isClearable
                />
              </>
            )}
            <div className={styles.name}>
              <span className={styles.error}>{errors.name}</span>
              <input
                type='text'
                name='name'
                value={taskDetails.name}
                onChange={(e) => onDetailChange(e.target)}
                maxLength='30'
                placeholder='Task name'
              />
            </div>
            <label>
              Project
              <div className={styles.wrapper}>
                <span className={styles.error}>{errors.project}</span>
                <CustomSelect
                  name='project'
                  options={projectOptions}
                  onCreateNew={onNewProject}
                  onInputChange={onDetailChange}
                  defaultValue={
                    projectOptions.find(
                      (p) => p.value === taskDetails.project
                    ) || null
                  }
                />
              </div>
            </label>
            <label>
              Tags
              <div className={styles.wrapper}>
                <span className={styles.error}>{errors.tags}</span>
                <CustomSelect
                  name='tags'
                  options={tagOptions}
                  onCreateNew={onNewTag}
                  onInputChange={onDetailChange}
                  defaultValue={tagOptions.filter((o) =>
                    taskDetails.tags.some((t) => t === o.value)
                  )}
                  multiple
                />
              </div>
            </label>
            <label>
              Priority
              <CustomSelect
                name='priority'
                options={priorityOptions}
                onInputChange={onDetailChange}
                defaultValue={
                  taskDetails.priority === 'P3'
                    ? priorityOptions[0]
                    : taskDetails.priority === 'P2'
                    ? priorityOptions[1]
                    : priorityOptions[2]
                }
              />
            </label>
            <label>
              Date
              <div className={styles.wrapper}>
                <span className={styles.error}>{errors.date}</span>
                <input
                  type='date'
                  name='date'
                  value={taskDetails.date}
                  onChange={(e) => onDetailChange(e.target)}
                  min={today}
                  disabled={task?.date < today}
                />
              </div>
            </label>
            <label>
              Notes{' '}
              <input
                type='text'
                name='notes'
                value={taskDetails.notes || ''}
                onChange={(e) => onDetailChange(e.target)}
                placeholder='Task notes'
              />
            </label>
            <button
              className={styles.btnSave}
              onClick={async () => {
                if (valid && !hasErrors) {
                  await onSave();
                  if (task) {
                    setEdit(false);
                    defaultDetails.current = taskDetails;
                  } else setShowCard(false);
                }
              }}
              disabled={!valid || hasErrors}
            >
              Save
            </button>
            {task && (
              <button
                className={styles.btnEdit}
                onClick={() => {
                  setEdit(!edit);
                  setTaskDetails(defaultDetails.current);
                }}
              >
                <FaEdit />
              </button>
            )}
            {edit && (
              <button
                className={styles.btnClose}
                onClick={() => setShowCard(false)}
              >
                ✕
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }
);

TaskCard.displayName = 'TaskCard';

export default TaskCard;
