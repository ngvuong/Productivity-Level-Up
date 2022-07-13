import { FaRegSquare, FaRegCheckSquare, FaCheckDouble } from 'react-icons/fa';
import styles from '../../styles/Task.module.scss';

export default function Task({ task, markTask }) {
  const done = task.completed;

  return (
    <div className={styles.task}>
      <label>
        {done ? <FaRegCheckSquare /> : <FaRegSquare />}
        <input
          type='checkbox'
          checked={done}
          onChange={() => {
            markTask(task);
          }}
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
