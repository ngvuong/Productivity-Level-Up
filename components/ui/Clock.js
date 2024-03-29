import { useState, useEffect } from 'react';

import { RiTimerFlashLine } from 'react-icons/ri';
import styles from '../../styles/Clock.module.scss';

export default function Clock({ time, totalTime }) {
  const [currentTime, setCurrentTime] = useState(time);
  const [secondsTick, setSecondsTick] = useState({ ones: false, tens: false });
  const [minutesTick, setMinutesTick] = useState({ ones: false, tens: false });

  const options = { minimumIntegerDigits: 2, useGrouping: false };
  const seconds = (currentTime % 60).toLocaleString('en-US', options);
  const secondsNext = (time % 60).toLocaleString('en-US', options);
  const minutes = Math.floor(currentTime / 60).toLocaleString('en-US', options);
  const minutesNext = Math.floor(time / 60).toLocaleString('en-US', options);

  useEffect(() => {
    if (time === totalTime) {
      setSecondsTick({ ones: true, tens: true });
      setMinutesTick({ ones: true, tens: true });

      const timeout = setTimeout(() => {
        setSecondsTick({ ones: false, tens: false });
        setMinutesTick({ ones: false, tens: false });
      }, 200);

      return () => clearTimeout(timeout);
    }
  }, [time, totalTime]);

  useEffect(() => {
    setCurrentTime((prev) => {
      if (prev !== time) setSecondsTick((prev) => ({ ...prev, ones: true }));

      return prev;
    });

    const timeout = setTimeout(() => {
      setSecondsTick((prev) => ({ ...prev, ones: false }));
      setCurrentTime(time);
    }, 200);

    if (time % 10 === 9) setSecondsTick((prev) => ({ ...prev, tens: true }));

    if (time % 60 === 59) setMinutesTick((prev) => ({ ...prev, ones: true }));

    if (time % 600 === 599) setMinutesTick((prev) => ({ ...prev, tens: true }));

    return () => {
      setSecondsTick((prev) => ({ ...prev, tens: false }));
      setMinutesTick({ ones: false, tens: false });
      clearTimeout(timeout);
    };
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
