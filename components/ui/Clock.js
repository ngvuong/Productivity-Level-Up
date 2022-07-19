import { useEffect, useRef, useState } from 'react';

import styles from '../../styles/Clock.module.scss';

export default function Clock({ duration, breakDuration, run, onDone }) {
  const [time, setTime] = useState(duration * 60);
  const count = useRef(null);

  useEffect(() => {
    setTime(duration * 60);
  }, [duration]);

  useEffect(() => {
    if (run && time > 0) {
      const interval = setInterval(() => {
        setTime((prevTime) => --prevTime);
      }, 100);

      return () => clearInterval(interval);
    } else if (time === 0) {
      onDone();
      count.current = breakDuration > 0 ? ++count.current : 0;
      console.log(count);
      if (count.current % 2 === 0) {
        setTime(duration * 60);
      } else {
        setTime(breakDuration * 60);
      }
    }
  }, [run, time, breakDuration]);

  return (
    <div className={styles.clock}>
      {`${Math.floor(time / 60).toLocaleString('en-US', {
        minimumIntegerDigits: 2,
        useGroup: false,
      })}:${(time % 60).toLocaleString('en-US', {
        minimumIntegerDigits: 2,
        useGroup: false,
      })}`}
    </div>
  );
}
