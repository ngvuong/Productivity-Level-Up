import { useState, useEffect } from 'react';

import { RiTimerFlashLine } from 'react-icons/ri';
import styles from '../../styles/Clock.module.scss';

export default function Clock({ time, totalTime }) {
  const [currentTime, setCurrentTime] = useState(time);
  const [secondsTick, setSecondsTick] = useState({ ones: false, tens: false });
  const [minutesTick, setMinutesTick] = useState({ ones: false, tens: false });

  const seconds = (currentTime % 60).toLocaleString('en-US', {
    minimumIntegerDigits: 2,
    useGrouping: false,
  });
  const secondsNext = (time % 60).toLocaleString('en-US', {
    minimumIntegerDigits: 2,
    useGrouping: false,
  });
  const minutes = Math.floor(currentTime / 60).toLocaleString('en-US', {
    minimumIntegerDigits: 2,
    useGrouping: false,
  });
  const minutesNext = Math.floor(time / 60).toLocaleString('en-US', {
    minimumIntegerDigits: 2,
    useGrouping: false,
  });

  useEffect(() => {
    const update = (prev) => console.log(prev);

    setSecondsTick(update);

    const timeout = setTimeout(() => {
      setSecondsTick(update);
      setCurrentTime(time);
    }, 210);

    if (time % 10 === 9) setSecondsTick((prev) => ({ ...prev, tens: true }));

    return () => {
      setSecondsTick((prev) => ({ ...prev, tens: false }));
      clearTimeout(timeout);
    };
  }, [time]);

  useEffect(() => {
    if (time % 60 === 59) {
      setMinutesTick(true);

      return () => setMinutesTick(false);
    }
  }, [time]);

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
          <div>
            <span className={`${minutesTick.tens ? styles.tick : ''}`}>
              {minutesNext[0]}
            </span>
            <span className={`${minutesTick.tens ? styles.tick : ''}`}>
              {minutes[0]}
            </span>
          </div>
          <div>
            <span className={`${minutesTick.ones ? styles.tick : ''}`}>
              {minutesNext[1]}
            </span>
            <span className={`${minutesTick.ones ? styles.tick : ''}`}>
              {minutes[1]}
            </span>
          </div>
        </div>

        {totalTime && ':'}

        <div className={styles.seconds}>
          <div>
            <span className={`${secondsTick.tens ? styles.tick : ''}`}>
              {secondsNext[0]}
            </span>
            <span className={`${secondsTick.tens ? styles.tick : ''}`}>
              {seconds[0]}
            </span>
          </div>
          <div>
            <span className={`${secondsTick.ones ? styles.tick : ''}`}>
              {secondsNext[1]}
            </span>
            <span className={`${secondsTick.ones ? styles.tick : ''}`}>
              {seconds[1]}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
