import { useCallback, useState } from 'react';
import Link from 'next/link';
import { format } from 'date-fns';
import Task from './Task';
import Spinner from '../layout/Spinner';
import useTasksByDate from '../../hooks/useTasksByDate';

import styles from '../../styles/Overview.module.scss';

export default function Overview({ userId }) {
  const { tasks, isLoading, setTasks } = useTasksByDate(
    userId,
    format(new Date(), 'yyyy-MM-dd'),
    { revalidateOnMount: true }
  );

  if (isLoading) {
    return <Spinner />;
  }
  const completedTaskCount = tasks.filter((task) => task.completed).length;

  const toggleDone = async (id, done) => {
    const data = await fetch(`/api/tasks/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ completed: done }),
    }).then((res) => res.json());

    if (data.error) console.error(data.error);

    setTasks();
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
