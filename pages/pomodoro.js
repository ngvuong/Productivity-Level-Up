import Timer from '../components/main/Timer';
import Stat from '../components/ui/Stat';
import { useSettings } from '../contexts/settingsContext';

import styles from '../styles/Pomodoro.module.scss';

export default function Pomodoro({ user }) {
  const [{ count, totalTime }] = useSettings();

  return (
    <main className={styles.pomodoro}>
      <section className={styles.stats}>
        <Stat stat={count} label='session' />
        <Stat stat={Math.floor(totalTime / 60)} label='minute' />
      </section>

      <section className={styles.timer}>
        <Timer userId={user.id} />
      </section>
    </main>
  );
}
