import { useEffect } from 'react';
import Timer from '../components/ui/Timer';
import Stat from '../components/ui/Stat';
import { useTimer } from '../contexts/timerContext';

import styles from '../styles/Pomodoro.module.scss';

export default function Pomodoro({ user }) {
  const [{ count, totalTime }] = useTimer();

  return (
    <main className={styles.pomodoro}>
      <section className={styles.timer}>
        <Timer
          defaultTime={user.settings.pomodoro}
          defaultBreak={user.settings.breakTime}
        />
      </section>

      <section className={styles.stats}>
        <Stat stat={count} label='session' />
        <Stat stat={Math.floor(totalTime / 60)} label='minute' />
      </section>
    </main>
  );
}
