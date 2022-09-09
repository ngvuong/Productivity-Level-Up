import Link from 'next/link';
import { format } from 'date-fns';
import Stat from '../ui/Stat';
import Task from './Task';
import useTasks from '../../hooks/useTasks';
import { useSettings } from '../../contexts/settingsContext';

import styles from '../../styles/Overview.module.scss';

export default function Overview({ user }) {
  const { tasks, setTasks } = useTasks(user.id, {
    fallbackData: user.tasks,
    revalidateOnMount: true,
  });
  const [{ totalTime, count }] = useSettings();

  const today = format(new Date(), 'yyyy-MM-dd');

  const tasksToday = tasks.filter((task) => task.date === today);

  const completedTaskCount = tasksToday.filter((task) => task.completed).length;

  return (
    <section className={styles.overview}>
      <h2>Today</h2>
      <div className={styles.stats}>
        <Stat stat={completedTaskCount} label='task' />
        <Stat stat={count} label='session' />
        <Stat stat={Math.floor(totalTime / 60)} label='minute' />
        <Stat stat={100} label='exp' />
        <Stat stat={user.streak} label='non-zero day' />
      </div>

      <h3>Tasks</h3>
      <div className={styles.tasks}>
        {tasksToday.length ? (
          tasksToday.map((task) => (
            <Task key={task.id} task={task} tasks={tasks} setTasks={setTasks} />
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
