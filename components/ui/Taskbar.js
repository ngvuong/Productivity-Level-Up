import { useEffect, useState } from 'react';
import { useDebouncedCallback } from 'use-debounce';

import { FaRegSquare, FaRegCheckSquare, FaCheckDouble } from 'react-icons/fa';
import styles from '../../styles/Taskbar.module.scss';

export default function Taskbar({ task, toggleDone, toggleDetails }) {
  const [done, setDone] = useState(task.completed);

  // useEffect(() => {
  //   console.log('effect');
  //   if (done !== task.completed) {
  //     const timeout = setTimeout(() => toggleDone(task.id, done), 600);
  //     console.log(timeout);
  //     return () => clearTimeout(timeout);
  //   }
  // }, [task.id, done, toggleDone]);

  const debounced = useDebouncedCallback(() => {
    if (done !== task.completed) {
      toggleDone(task.id, done);
    }
  }, 600);

  return (
    <div className={styles.container} onClick={toggleDetails}>
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
