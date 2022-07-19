import { useEffect, useState } from 'react';

import styles from '../../styles/Clock.module.scss';

export default function Clock({ duration, start = false }) {
  const [time, setTime] = useState(duration * 60);

  useEffect(() => {
    setTime(duration * 60);
  }, [duration]);

  useEffect(() => {
    if (start && time > 0) {
      const interval = setInterval(() => {
        setTime((prevTime) => prevTime - 1);
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [start, time]);

  return (
    <div className={styles.clock}>
      {`${Math.floor(time / 60)}:${(time % 60).toLocaleString('en-US', {
        minimumIntegerDigits: 2,
        useGroup: false,
      })}`}
    </div>
  );
}
