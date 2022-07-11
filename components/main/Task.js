import { useState } from 'react';
import { FaRegSquare, FaRegCheckSquare, FaCheckDouble } from 'react-icons/fa';
import styles from '../../styles/Task.module.scss';

export default function Task({ task }) {
  const [done, setDone] = useState(false);

  return (
    <div className={styles.task}>
      <label>
        {done ? <FaRegCheckSquare /> : <FaRegSquare />}
        <input type='checkbox' onChange={(e) => setDone(e.target.checked)} />
      </label>
      <div className={styles.taskBar}>
        <span className={done ? styles.done : ''}>{task.name}</span>
        <div
          className={styles.taskBarFill}
          style={{ width: done ? '100%' : 0 }}
        />
        {done && <FaCheckDouble className={styles.done} />}
      </div>
    </div>
  );
}
