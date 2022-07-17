import { RiTimerFlashLine } from 'react-icons/ri';
import styles from '../styles/Timer.module.scss';

export default function Timer() {
  return (
    <main className={styles.timer}>
      <h1>
        <RiTimerFlashLine />
      </h1>

      <section className={styles.configs}></section>
    </main>
  );
}
