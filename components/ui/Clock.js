import { useState, useEffect } from 'react';

import { RiTimerFlashLine } from 'react-icons/ri';
import styles from '../../styles/Clock.module.scss';

export default function Clock({ time, totalTime, run }) {
  const [seconds, setSeconds] = useState(time);
  const [secondsTick, setSecondsTick] = useState(false);
  const [minutesTick, setMinutesTick] = useState(false);

  useEffect(() => {
    setSecondsTick(true);

    const timeout = setTimeout(() => {
      setSecondsTick(false);
      setSeconds(time);
    }, 210);

    return () => clearTimeout(timeout);
  }, [time]);

  useEffect(() => {
    if (time % 60 === 59) {
      setMinutesTick(true);
      // const timeout = setTimeout(() => {
      //   setMinutesTick(true);
      // }, 1000);

      // return () => clearTimeout(timeout);
    } else if (minutesTick) {
      const timeout = setTimeout(() => {
        setMinutesTick(false);
      }, 1000);

      return () => clearTimeout(timeout);
    }
  }, [time, minutesTick]);

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
        <div className={styles.minutes}>
          <span className={`${minutesTick ? styles.tick : ''}`}>
            {`${Math.floor(time / 60).toLocaleString('en-US', {
              minimumIntegerDigits: 2,
              useGroup: false,
            })}`}
          </span>
          <span className={`${minutesTick ? styles.tick : ''}`}>
            {`${Math.floor(seconds / 60).toLocaleString('en-US', {
              minimumIntegerDigits: 2,
              useGroup: false,
            })}`}
          </span>
        </div>
        {totalTime && ':'}
        <div className={styles.seconds}>
          <span className={`${secondsTick ? styles.tick : ''}`}>
            {`${(time % 60).toLocaleString('en-US', {
              minimumIntegerDigits: 2,
              useGroup: false,
            })}`}
          </span>
          <span className={`${secondsTick ? styles.tick : ''}`}>
            {`${(seconds % 60).toLocaleString('en-US', {
              minimumIntegerDigits: 2,
              useGroup: false,
            })}`}
          </span>
        </div>
      </div>
    </div>
  );
}
