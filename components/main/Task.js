import { useState, useEffect } from 'react';
import Taskbar from '../ui/Taskbar';
import Overlay from '../layout/Overlay';
import CustomSelect from '../ui/CustomSelect';
import useProjects from '../../hooks/useProjects';
import useTags from '../../hooks/useTags';

import { FaEdit } from 'react-icons/fa';
import styles from '../../styles/Task.module.scss';

export default function Task({ task, userId, toggleDone }) {
  const [showDetails, setShowDetails] = useState(false);
  const [edit, setEdit] = useState(false);
  const [projectOptions, setProjectOptions] = useState([]);
  const [tagOptions, setTagOptions] = useState([]);
  const { projects, setProjects } = useProjects(userId);
  const { tags, setTags } = useTags(userId);
  console.log(projects);

  useEffect(() => {
    if (projects) {
      const options = projects.map((project) => ({
        label: project.name,
        value: project.id,
      }));
      setProjectOptions(options);
    }
  }, [projects]);

  useEffect(() => {
    if (tags) {
      const options = tags.map((tag) => ({
        label: tag.name,
        value: tag.id,
      }));

      setTagOptions(options);
    }
  }, [tags]);

  const onNewProject = async (project) => {
    const data = await fetch(`/api/user/${userId}/projects`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name: project }),
    }).then((res) => res.json());

    if (data.error) return console.error(data.error);

    const newOption = { label: project, value: data.id };
    setProjectOptions([...projectOptions, newOption]);

    setProjects();

    return newOption;
  };

  const onNewTag = async (tag) => {
    const data = await fetch(`/api/user/${userId}/tags`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name: tag }),
    }).then((res) => res.json());

    if (data.error) return console.error(data.error);

    const newOption = { label: tag, value: data.id };
    setTagOptions([...tagOptions, newOption]);

    setTags();

    return newOption;
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
            <div className={styles.taskDetailsInner}>
              <div className={styles.cardFront}>
                <h3>{task.name}</h3>
              </div>
              <div className={styles.cardBack}>
                <button
                  className={styles.btnEdit}
                  onClick={() => setEdit(!edit)}
                >
                  <FaEdit />
                </button>
                <h3>{task.name}</h3>
                <label>
                  Project:{' '}
                  {edit ? (
                    <CustomSelect
                      name='project'
                      options={projectOptions}
                      onCreateNew={onNewProject}
                      defaultValue={task.project}
                    />
                  ) : (
                    task.project
                  )}
                </label>
                <label>
                  Tags:
                  {edit ? (
                    <CustomSelect
                      name='tag'
                      options={tagOptions}
                      onCreateNew={onNewTag}
                      defaultValue={task.tags}
                      multiple
                    />
                  ) : (
                    <div>
                      {task.tags && task.tags.map((tag) => tag.name).join(', ')}
                    </div>
                  )}
                </label>
                <label>
                  Priority:{' '}
                  <span>
                    {task.priority === 'P1'
                      ? 'High'
                      : task.priority === 'P2'
                      ? 'Medium'
                      : 'Low'}
                  </span>
                </label>
                <label>
                  Date: <span>{task.date}</span>
                </label>
                <label>
                  Notes: <p>{task.notes}</p>
                </label>
                {edit && <button className={styles.btnSave}>Save</button>}
                <button
                  className={styles.btnClose}
                  onClick={() => {
                    setEdit(false);
                    setShowDetails(false);
                  }}
                >
                  ✕
                </button>
              </div>
            </div>
          </div>
        </Overlay>
      )}
    </div>
  );
}
