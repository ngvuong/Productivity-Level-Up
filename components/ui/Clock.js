import { RiTimerFlashLine } from 'react-icons/ri';
import styles from '../../styles/Clock.module.scss';

export default function Clock({ time, totalTime }) {
  return (
    <div className={styles.clock}>
      {totalTime && (
        <div className={`${styles.clockImg} ${time === 0 ? styles.done : ''}`}>
          <RiTimerFlashLine />
          <div className={styles.fill}>
            <style jsx>{`
              div {
                width: ${(time / totalTime) * 58.5}%;
                height: ${(time / totalTime) * 58.5}%;
              }
            `}</style>
          </div>
        </div>
      )}
      <div
        className={`${styles.clockTime} ${!totalTime ? styles.mini : ''} ${
          time === 0 ? styles.done : ''
        }`}
      >
        <span className={styles.minutes}>
          {`${Math.floor(time / 60).toLocaleString('en-US', {
            minimumIntegerDigits: 2,
            useGroup: false,
          })}`}
        </span>
        {totalTime && ':'}
        <span className={styles.seconds}>
          {`${(time % 60).toLocaleString('en-US', {
            minimumIntegerDigits: 2,
            useGroup: false,
          })}`}
        </span>
      </div>
    </div>
  );
}
