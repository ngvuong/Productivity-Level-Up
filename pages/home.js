import { useState } from 'react';
import Link from 'next/link';
import Level from '../components/ui/Level';

import { FaUser, FaRegSquare, FaCheckDouble } from 'react-icons/fa';
import styles from '../styles/Home.module.scss';
import Task from '../components/main/Task';

export default function Home() {
  const [val, setVal] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  const onChange = (e) => {
    const positionX = e.touches ? e.touches[0].clientX : e.clientX;
    const left = e.target.getBoundingClientRect().left;
    const fillWidth = positionX - left;
    setVal(fillWidth);
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
              <FaUser /> Vuong Nguyen
            </a>
          </Link>
        </div>
        <Level />
      </header>
      <section className={styles.overview}>
        <h2>Today</h2>
        <div className={styles.stats}>
          <div>8 Sessions Completed</div>
          <div>5 Tasks Completed</div>
          <div>100 Exp Gained</div>
          <div>360 Minutes Logged</div>
        </div>
        <h3>Tasks</h3>
        <div className={styles.tasks}>
          <Task task={{ name: 'Task 1' }} />
        </div>
      </section>
    </main>
  );
}
