import { useEffect, useRef, useState } from 'react';

import styles from '../../styles/Clock.module.scss';

export default function Clock({
  duration,
  breakDuration,
  run,
  onDone,
  playSound,
}) {
  const [time, setTime] = useState(duration * 60);
  const alarm = useRef(null);
  const tick = useRef(null);
  const count = useRef(null);

  useEffect(() => {
    if (playSound) {
      alarm.current = new Audio('./alarm.wav');
      tick.current = new Audio('./tock.mp3');
    } else {
      alarm.current = null;
      tick.current = null;
    }
  }, [playSound]);

  useEffect(() => {
    setTime(duration * 60);
  }, [duration]);

  useEffect(() => {
    if (run && time > 0) {
      const interval = setInterval(() => {
        if (tick.current) tick.current.play();

        setTime(time - 1);
      }, 1000);

      return () => clearInterval(interval);
    } else if (time === 0) {
      if (alarm.current) alarm.current.play();
      onDone();
      count.current = breakDuration > 0 ? ++count.current : 0;
      if (count.current % 2 === 0) {
        setTime(duration * 60);
      } else {
        setTime(breakDuration * 60);
      }
    }
  }, [run, time, breakDuration, duration, onDone]);

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
