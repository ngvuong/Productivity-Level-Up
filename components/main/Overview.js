import Link from 'next/link';
import { format } from 'date-fns';
import Task from './Task';
import Spinner from '../layout/Spinner';
import useTasksByDate from '../../hooks/useTasksByDate';

import styles from '../../styles/Overview.module.scss';

export default function Overview({ userId }) {
  const { tasks, isLoading } = useTasksByDate(
    userId,
    format(new Date(), 'yyyy-MM-dd'),
    { revalidateOnMount: true }
  );

  if (isLoading) {
    return <Spinner />;
  }

  const completedTaskCount = tasks.filter((task) => task.completed).length;

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
        {tasks.length ? (
          tasks.map((task) => (
            <Task key={task.id} task={task} userId={userId} />
          ))
        ) : (
          <p>No tasks yet</p>
        )}
      </div>
      <div className={styles.links}>
        <Link href='/todo'>
          <a className={styles.todo}>Manage Tasks</a>
        </Link>
        <Link href='/pomodoro'>
          <a className={styles.track}>Start Session</a>
        </Link>
      </div>
    </section>
  );
}
