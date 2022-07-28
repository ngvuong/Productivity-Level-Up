import { FaRegSquare, FaRegCheckSquare, FaCheckDouble } from 'react-icons/fa';
import styles from '../../styles/Taskbar.module.scss';

export default function Taskbar({ task, toggleDone }) {
  const done = task.completed;
  return (
    <div className={styles.container}>
      <label>
        {done ? <FaRegCheckSquare /> : <FaRegSquare />}
        <input
          type='checkbox'
          checked={done}
          onChange={() => toggleDone(task.id)}
        />
      </label>
      <div className={styles.taskBar}>
        <span className={done ? styles.done : ''}>{task.name}</span>
        <div className={`${styles.taskBarFill} ${done ? styles.full : ''}`} />
        {done && <FaCheckDouble />}
      </div>
    </div>
  );
}
