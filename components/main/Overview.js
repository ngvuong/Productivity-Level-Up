import { useState } from 'react';
import Link from 'next/link';
import Task from './Task';

import styles from '../../styles/Overview.module.scss';

export default function Overview() {
  const [tasks, setTasks] = useState([
    { id: 1, name: 'Task 1', completed: false },
    { id: 2, name: 'Task 2', completed: true },
    { id: 3, name: 'Task 3', completed: false },
  ]);
  const completedTaskCount = tasks.filter((task) => task.completed).length;

  const toggleDone = (id) => {
    setTasks(
      tasks.map((t) => {
        if (t.id === id) {
          return { ...t, completed: !t.completed };
        }
        return t;
      })
    );
  };

  return (
    <section className={styles.overview}>
      <h2>Today</h2>
      <div className={styles.stats}>
        <div>8 Sessions Completed</div>
        <div>{`${completedTaskCount} Task${
          completedTaskCount !== 1 ? 's' : ''
        } Completed`}</div>
        <div>100 Exp Gained</div>
        <div>360 Minutes Logged</div>
      </div>
      <h3>Tasks</h3>
      <div className={styles.tasks}>
        {tasks.map((task) => (
          <Task key={task.id} task={task} toggleDone={toggleDone} />
        ))}
      </div>
      <Link href='/timer'>
        <a className={styles.track}>Start Session</a>
      </Link>
    </section>
  );
}
