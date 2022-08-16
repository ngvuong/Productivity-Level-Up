import { useEffect, useRef, useState } from 'react';

import { RiTimerFlashLine } from 'react-icons/ri';
import styles from '../../styles/Clock.module.scss';

export default function Clock({ time, totalTime, run, onDone, soundEffects }) {
  // const [totalTime, setTotalTime] = useState(time);
  // const [seconds, setSeconds] = useState(time);
  // const alarm = useRef(null);
  // const tick = useRef(null);

  // useEffect(() => {
  //   if (soundEffects.alarm) {
  //     alarm.current = new Audio('./alarm.wav');
  //   } else alarm.current = null;

  //   if (soundEffects.ticking) {
  //     tick.current = new Audio('./tock.mp3');
  //   } else tick.current = null;
  // }, [soundEffects]);

  // useEffect(() => {
  //   setSeconds(time);
  // }, [time]);

  // useEffect(() => {
  //   if (run && seconds > 0) {
  //     const interval = setInterval(() => {
  //       if (tick.current) tick.current.play();

  //       setSeconds((seconds) => seconds - 1);
  //     }, 1000);

  //     return () => clearInterval(interval);
  //   }
  // }, [run, seconds]);

  // useEffect(() => {
  //   if (run && seconds === 0) {
  //     if (alarm.current) alarm.current.play();

  //     const timeout = setTimeout(() => {
  //       onDone();
  //       setSeconds(time);
  //     }, 1000);

  //     return () => clearTimeout(timeout);
  //   }
  // }, [time, run, seconds, onDone]);

  return (
    <div className={styles.clock}>
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
      <div className={styles.clockTime}>
        {`${Math.floor(time / 60).toLocaleString('en-US', {
          minimumIntegerDigits: 2,
          useGroup: false,
        })}:${(time % 60).toLocaleString('en-US', {
          minimumIntegerDigits: 2,
          useGroup: false,
        })}`}
      </div>
    </div>
  );
}
