import { useState } from 'react';
import Taskbar from '../ui/Taskbar';
import Overlay from '../layout/Overlay';

import styles from '../../styles/Task.module.scss';

export default function Task({ task, toggleDone }) {
  const [showDetails, setShowDetails] = useState(false);

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
                <label>Project: {task.project}</label>
                <label>
                  Tags:{' '}
                  <div>
                    {task.tags && task.tags.map((tag) => tag.name).join(', ')}
                  </div>
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
                <button
                  className={styles.btnClose}
                  onClick={() => setShowDetails(false)}
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
