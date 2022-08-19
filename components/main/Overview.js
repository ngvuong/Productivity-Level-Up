import Link from 'next/link';
import { format } from 'date-fns';
import Stat from '../ui/Stat';
import Task from './Task';
import Spinner from '../layout/Spinner';
import useTasksByDate from '../../hooks/useTasksByDate';
import { useTimer } from '../../contexts/timerContext';

import styles from '../../styles/Overview.module.scss';

export default function Overview({ userId }) {
  const { tasks, isLoading } = useTasksByDate(
    userId,
    format(new Date(), 'yyyy-MM-dd'),
    { revalidateOnMount: true }
  );

  const [{ totalTime, count }] = useTimer();

  if (isLoading) {
    return <Spinner />;
  }

  const completedTaskCount = tasks.filter((task) => task.completed).length;

  return (
    <section className={styles.overview}>
      <h2>Today</h2>
      <div className={styles.stats}>
        <Stat stat={count} label='session' />
        <Stat stat={completedTaskCount} label='task' />
        <Stat stat={100} label='exp' />
        <Stat stat={Math.floor(totalTime / 60)} label='minute' />
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
