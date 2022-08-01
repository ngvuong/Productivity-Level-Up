import { useState } from 'react';
import { useDebouncedCallback } from 'use-debounce';

import { FaRegSquare, FaRegCheckSquare, FaCheckDouble } from 'react-icons/fa';
import styles from '../../styles/Taskbar.module.scss';

export default function Taskbar({ task, toggleDone, toggleDetails }) {
  const [done, setDone] = useState(task.completed);

  const debounced = useDebouncedCallback(() => {
    if (done !== task.completed) {
      toggleDone(task.id, done);
    }
  }, 600);

  return (
    <div className={styles.container}>
      <label>
        {done ? <FaRegCheckSquare /> : <FaRegSquare />}
        <input
          type='checkbox'
          checked={done}
          onChange={(e) => {
            setDone(e.target.checked);
            debounced();
          }}
        />
      </label>
      <div
        className={styles.taskBar}
        onClick={toggleDetails}
        style={{
          border: `3px solid ${
            task.priority === 'P3'
              ? '#55ff00'
              : task.priority === 'P2'
              ? '#0055ff'
              : '#ff0055'
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
