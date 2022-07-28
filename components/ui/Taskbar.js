import { useEffect, useState } from 'react';
import { FaRegSquare, FaRegCheckSquare, FaCheckDouble } from 'react-icons/fa';
import styles from '../../styles/Taskbar.module.scss';

export default function Taskbar({ task, toggleDone, toggleDetails }) {
  const [done, setDone] = useState(task.completed);

  useEffect(() => {
    const timeout = setTimeout(() => toggleDone(task.id, done), 600);

    return () => clearTimeout(timeout);
  }, [task.id, done, toggleDone]);

  return (
    <div className={styles.container} onClick={toggleDetails}>
      <label>
        {done ? <FaRegCheckSquare /> : <FaRegSquare />}
        <input
          type='checkbox'
          checked={done}
          onChange={(e) => setDone(e.target.checked)}
        />
      </label>
      <div
        className={styles.taskBar}
        style={{
          border: `3px solid ${
            task.priority === 'LOW'
              ? '#55ff00'
              : task.priority === 'MEDIUM'
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
