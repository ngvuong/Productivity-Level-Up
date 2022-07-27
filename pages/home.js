import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Level from '../components/ui/Level';
import Task from '../components/main/Task';

import { FaUser } from 'react-icons/fa';
import styles from '../styles/Home.module.scss';

export default function Home({ user }) {
  const [tasks, setTasks] = useState([
    { name: 'Task 1', completed: false },
    { name: 'Task 2', completed: true },
    { name: 'Task 3', completed: false },
  ]);
  const completedTaskCount = tasks.filter((task) => task.completed).length;

  const markTask = (task) => {
    setTasks(
      tasks.map((t) => {
        if (t.name === task.name) {
          return { ...t, completed: !t.completed };
        }
        return t;
      })
    );
  };

  return (
    <main className={styles.home}>
      <header className={styles.header}>
        <div className={styles.wrapper}>
          <div className={styles.title}>
            <h1>PLUM</h1>
            <h3>Productivity Level Up Mate</h3>
          </div>
          <Link href='/tasks'>
            <a className={styles.user}>
              {user.image ? (
                <Image
                  src={user.image}
                  width='35'
                  height='35'
                  className={styles.avatar}
                  alt='Profile avatar'
                />
              ) : (
                <FaUser />
              )}
              {user.name || user.email}
            </a>
          </Link>
        </div>
        <Level user={user} />
      </header>
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
            <Task key={task.name} task={task} markTask={markTask} />
          ))}
        </div>
        <Link href='/timer'>
          <a className={styles.track}>Start Session</a>
        </Link>
      </section>
    </main>
  );
}

// export async function getServerSideProps(context) {
//   const currentUser = await prisma.user.findMany({
//     where: {
//       name: 'Vuong Nguyen',
//     },
//   });
//   console.log(currentUser);

//   return {
//     props: {
//       currentUser,
//     },
//   };
// }
