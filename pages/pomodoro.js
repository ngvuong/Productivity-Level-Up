import Timer from '../components/ui/Timer';

import styles from '../styles/Pomodoro.module.scss';

export default function Pomodoro({ user }) {
  return (
    <main className={styles.pomodoro}>
      <section className={styles.timer}>
        <Timer user={user} />
      </section>

      <section className={styles.stats}></section>
    </main>
  );
}
