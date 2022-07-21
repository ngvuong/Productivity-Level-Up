import { useEffect, useRef, useState } from 'react';

import { RiTimerFlashLine } from 'react-icons/ri';
import styles from '../../styles/Clock.module.scss';

export default function Clock({ time, run, onDone, soundEffects }) {
  const [seconds, setSeconds] = useState(time);
  const alarm = useRef(null);
  const tick = useRef(null);

  useEffect(() => {
    if (soundEffects.notification) {
      alarm.current = new Audio('./alarm.wav');
    } else alarm.current = null;

    if (soundEffects.ticking) {
      tick.current = new Audio('./tock.mp3');
    } else tick.current = null;
  }, [soundEffects]);

  useEffect(() => {
    setSeconds(time);
  }, [time]);

  useEffect(() => {
    if (run && seconds > 0) {
      const interval = setInterval(() => {
        if (tick.current) tick.current.play();

        setSeconds(seconds - 1);
      }, 1000);

      return () => clearInterval(interval);
    } else if (run && seconds === 0) {
      if (alarm.current) alarm.current.play();
      const timeout = setTimeout(() => {
        onDone();
        setSeconds(time);
      }, 1000);

      return () => clearTimeout(timeout);
    }
  }, [time, run, seconds, onDone]);

  return (
    <div className={styles.clock}>
      <div className={seconds === 0 ? styles.done : undefined}>
        <RiTimerFlashLine />
        <div
          className={styles.fill}
          style={{
            width: `${(seconds / time) * 58.5}%`,
            height: `${(seconds / time) * 58.5}%`,
          }}
        ></div>
      </div>
      {`${Math.floor(seconds / 60).toLocaleString('en-US', {
        minimumIntegerDigits: 2,
        useGroup: false,
      })}:${(seconds % 60).toLocaleString('en-US', {
        minimumIntegerDigits: 2,
        useGroup: false,
      })}`}
    </div>
  );
}
