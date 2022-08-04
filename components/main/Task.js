import { useState, useEffect } from 'react';
import { format, parseISO } from 'date-fns';
import Taskbar from '../ui/Taskbar';
import Overlay from '../layout/Overlay';
import CustomSelect from '../ui/CustomSelect';
import useProjects from '../../hooks/useProjects';
import useTags from '../../hooks/useTags';
import useTasksByDate from '../../hooks/useTasksByDate';

import { FaEdit } from 'react-icons/fa';
import styles from '../../styles/Task.module.scss';

export default function Task({ task, userId, toggleDone }) {
  const [showDetails, setShowDetails] = useState(false);
  const [edit, setEdit] = useState(false);
  const [projectOptions, setProjectOptions] = useState([]);
  const [tagOptions, setTagOptions] = useState([]);
  const tagIds = task.tags.map((tag) => tag.id);
  const [taskDetails, setTaskDetails] = useState({
    name: task.name,
    project: task?.project?.id || null,
    tags: tagIds,
    priority: task.priority,
    date: task.date,
    notes: task.notes || '',
  });
  const { projects, setProjects } = useProjects(userId, {
    revalidateOnMount: true,
  });
  const { tags, setTags } = useTags(userId, { revalidateOnMount: true });
  const { setTasks } = useTasksByDate(userId, format(new Date(), 'yyyy-MM-dd'));
  const priorityOptions = [
    { label: 'Low', value: 'P3' },
    { label: 'Medium', value: 'P2' },
    { label: 'High', value: 'P1' },
  ];

  useEffect(() => {
    if (projects && !projectOptions.length) {
      const options = projects.map((project) => ({
        label: project.name,
        value: project.id,
      }));
      setProjectOptions(options);
    }
    if (tags && !tagOptions.length) {
      const options = tags.map((tag) => ({
        label: tag.name,
        value: tag.id,
      }));

      setTagOptions(options);
    }
  }, [projects, tags]);

  const onNewProject = async (project) => {
    const name = project
      .trim()
      .split(' ')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');

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
    setTaskDetails({ ...taskDetails, [target.name]: target.value });
  };

  const getChangedData = () => {
    const { name, project, tags, priority, date, notes } = taskDetails;

    const nameChanged = name !== task.name;
    const projectChanged = task.project
      ? project !== task.project.id
      : project !== null;
    const tagsChanged =
      !tags.every((tag) => tagIds.includes(tag)) ||
      !tagIds.every((id) => tags.includes(id));
    const priorityChanged = priority !== task.priority;
    const dateChanged = date !== task.date;
    const notesChanged = notes !== task.notes;

    const data = {
      ...(nameChanged && { name }),
      ...(projectChanged && { projectId: project }),
      ...(tagsChanged && { tags }),
      ...(priorityChanged && { priority }),
      ...(dateChanged && { date }),
      ...(notesChanged && { notes }),
    };

    return data;
  };

  const onSave = async () => {
    const data = getChangedData();

    if (!Object.keys(data).length) return;

    const result = await fetch(`/api/tasks/${task.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ data }),
    }).then((res) => res.json());

    if (result.error) return alert(result.error);

    setEdit(false);
    setTasks();
  };

  return (
    <div className={styles.task}>
      <Taskbar
        task={task}
        toggleDone={toggleDone}
        toggleDetails={() => setShowDetails(!showDetails)}
      />
      {showDetails && (
        <Overlay>
          <div className={styles.taskDetails}>
            <div
              className={`${styles.taskDetailsInner} ${
                edit ? styles.edit : ''
              }`}
            >
              <div className={styles.cardFront}>
                <h3>{task.name}</h3>
                <label>
                  Project
                  {task.project && (
                    <span className={styles.project}>
                      {task?.project?.name}
                    </span>
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
                    onClick={() => setShowDetails(false)}
                  >
                    ✕
                  </button>
                )}
              </div>

              <div className={styles.cardBack}>
                <input
                  type='text'
                  value={taskDetails.name}
                  onChange={(e) =>
                    onDetailChange({ name: 'name', value: e.target.value })
                  }
                />
                <label>
                  Project
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
                </label>
                <label>
                  Tags
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
                  Date{' '}
                  <input
                    type='date'
                    value={taskDetails.date}
                    onChange={(e) =>
                      onDetailChange({ name: 'date', value: e.target.value })
                    }
                  />
                </label>
                <label>
                  Notes{' '}
                  <input
                    type='text'
                    value={taskDetails.notes || ''}
                    onChange={(e) =>
                      onDetailChange({ name: 'notes', value: e.target.value })
                    }
                  />
                </label>
                {edit && (
                  <button
                    className={styles.btnEdit}
                    onClick={() => {
                      setEdit(!edit);
                      setTaskDetails({
                        name: task.name,
                        project: task?.project?.id || null,
                        tags: tagIds,
                        priority: task.priority,
                        date: task.date,
                        notes: task.notes || '',
                      });
                    }}
                  >
                    <FaEdit />
                  </button>
                )}
                {edit && (
                  <button
                    className={styles.btnClose}
                    onClick={() => {
                      setEdit(false);
                      setShowDetails(false);
                      setTaskDetails({
                        name: task.name,
                        project: task?.project?.id || null,
                        tags: tagIds,
                        priority: task.priority,
                        date: task.date,
                        notes: task.notes || '',
                      });
                    }}
                  >
                    ✕
                  </button>
                )}
                <button
                  className={styles.btnSave}
                  onClick={onSave}
                  disabled={!Object.keys(getChangedData()).length}
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        </Overlay>
      )}
    </div>
  );
}
