import { useState } from 'react';
import { format } from 'date-fns';
import Taskbar from '../ui/Taskbar';
import Overlay from '../layout/Overlay';
import TaskCard from '../ui/TaskCard';
import useModalClose from '../../hooks/useModalClose';
import useTasksByDate from '../../hooks/useTasksByDate';
import useTasks from '../../hooks/useTasks';

import { FaInfoCircle, FaWindowClose } from 'react-icons/fa';
import styles from '../../styles/Task.module.scss';

export default function Task({ task, userId }) {
  const tagIds = task.tags.map((tag) => tag.id);
  const [taskDetails, setTaskDetails] = useState({
    name: task.name,
    project: task?.project?.id || null,
    tags: tagIds,
    priority: task.priority,
    date: task.date,
    notes: task.notes || '',
  });
  const { triggerRef, nodeRef, show, setShow } = useModalClose(false);
  const { setTasks: setTodayTasks } = useTasksByDate(
    userId,
    format(new Date(), 'yyyy-MM-dd')
  );
  const { setTasks } = useTasks(userId);

  const toggleDone = async (id, done) => {
    const data = { completed: done };

    const result = await fetch(`/api/tasks/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ data }),
    }).then((res) => res.json());

    if (result.error) console.error(result.error);

    setTodayTasks();
    setTasks();
  };

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
      !tags.every((tag) => tagIds.includes(tag)) ||
      !tagIds.every((id) => tags.includes(id));
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

    setTodayTasks();
    setTasks();
  };

  const onDelete = async () => {
    const result = await fetch(`/api/tasks/${task.id}`, {
      method: 'DELETE',
    }).then((res) => res.json());

    if (result.error) return alert(result.error);

    setTodayTasks();
    setTasks();
  };

  return (
    <div className={styles.task}>
      <button className={styles.btnInfo} ref={triggerRef}>
        <FaInfoCircle />
      </button>
      <Taskbar task={task} toggleDone={toggleDone} />
      {show && (
        <Overlay>
          <TaskCard
            task={task}
            userId={userId}
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
