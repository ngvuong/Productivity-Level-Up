import { useState } from 'react';
import Taskbar from '../ui/Taskbar';
import Overlay from '../layout/Overlay';
import TaskCard from '../ui/TaskCard';
import useModal from '../../hooks/useModal';

import { FaInfoCircle, FaWindowClose } from 'react-icons/fa';
import styles from '../../styles/Task.module.scss';

export default function Task({ task, tasks, setTasks }) {
  const tagIds = task.tags.map((tag) => tag.id);

  const [taskDetails, setTaskDetails] = useState({
    name: task.name,
    project: task?.project?.id || null,
    tags: tagIds,
    priority: task.priority,
    date: task.date,
    notes: task.notes || '',
  });

  const { triggerRef, nodeRef, show, setShow } = useModal(false);

  const getChangedData = () => {
    const { name, project, tags, priority, date, notes } = taskDetails;

    const taskName = name
      .trim()
      .split(' ')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');

    const nameChanged = taskName !== task.name;
    const projectChanged = task.project
      ? project !== task.project.id
      : project !== null;
    const tagsChanged =
      tags.length !== tagIds.length ||
      [...new Set([...tags, ...tagIds])].length !== tags.length;
    const priorityChanged = priority !== task.priority;
    const dateChanged = date !== task.date;
    const notesChanged = notes !== task.notes;

    const data = {
      ...(nameChanged && { name: taskName }),
      ...(projectChanged && { projectId: project }),
      ...(tagsChanged && { tags }),
      ...(priorityChanged && { priority }),
      ...(dateChanged && { date }),
      ...(notesChanged && { notes }),
    };

    return data;
  };

  const onSave = async (update) => {
    const data = update ? update : getChangedData();

    if (!Object.keys(data).length) return;

    const result = await fetch(`/api/tasks/${task.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...data,
        ...(data.date && !data.name && { name: task.name }),
      }),
    }).then((res) => res.json());

    if (result.error) return alert(result.error);

    setTasks();
  };

  const onDelete = async () => {
    const result = await fetch(`/api/tasks/${task.id}`, {
      method: 'DELETE',
    }).then((res) => res.json());

    if (result.error) return alert(result.error);

    setTasks();
  };

  return (
    <div className={styles.task}>
      <button className={styles.btnInfo} ref={triggerRef}>
        <FaInfoCircle />
      </button>

      <Taskbar task={task} onSave={onSave} />

      {show && (
        <Overlay>
          <TaskCard
            task={task}
            tasks={tasks}
            setShowCard={setShow}
            taskDetails={taskDetails}
            setTaskDetails={setTaskDetails}
            onSave={onSave}
            valid={!!Object.keys(getChangedData()).length}
            ref={nodeRef}
          />
        </Overlay>
      )}

      <button className={styles.btnDelete} onClick={onDelete}>
        <FaWindowClose />
      </button>
    </div>
  );
}
