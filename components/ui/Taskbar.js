import { useEffect, useState } from 'react';
import { useDebouncedCallback } from 'use-debounce';

import { FaRegSquare, FaRegCheckSquare, FaCheckDouble } from 'react-icons/fa';
import styles from '../../styles/Taskbar.module.scss';

export default function Taskbar({ task, toggleDone }) {
  const [done, setDone] = useState(task.completed);

  useEffect(() => {
    setDone(task.completed);
  }, [task.completed]);

  const debounced = useDebouncedCallback(() => {
    if (done !== task.completed) {
      toggleDone(task.id, done);
    }
  }, 500);

  return (
    <div className={styles.container}>
      <input
        type='checkbox'
        id={task.id}
        checked={done}
        onChange={(e) => {
          setDone(e.target.checked);
          debounced();
        }}
      />
      <label htmlFor={task.id}>
        {done ? <FaRegCheckSquare /> : <FaRegSquare />}
      </label>
      <div
        className={styles.taskBar}
        style={{
          border: `3px solid ${
            task.priority === 'P3'
              ? '#8f0'
              : task.priority === 'P2'
              ? '#08f'
              : '#f08'
          }`,
        }}
      >
        <span className={done ? styles.done : ''}>{task.name}</span>
        <div className={`${styles.taskBarFill} ${done ? styles.full : ''}`} />
        {done && <FaCheckDouble />}
      </div>
    </div>
  );
}
