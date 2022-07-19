import { useEffect, useState } from 'react';
import Clock from '../components/ui/Clock';

import { RiTimerFlashLine } from 'react-icons/ri';
import styles from '../styles/Timer.module.scss';

export default function Timer() {
  const [duration, setDuration] = useState(0.5);
  const [breakDuration, setBreakDuration] = useState(1);
  const [run, setRun] = useState(false);
  const [done, setDone] = useState(false);
  const [autostart, setAutostart] = useState(false);
  console.log(done);

  useEffect(() => {
    if (done) {
      const timeout = setTimeout(() => setDone(false), 2000);

      return () => clearTimeout(timeout);
    }
  }, [done]);

  const onDone = () => {
    setDone(true);
    if (!autostart) setRun(false);
  };

  return (
    <main className={styles.timer}>
      <h1 className={done ? styles.done : undefined}>
        <RiTimerFlashLine />
      </h1>
      <Clock
        duration={duration}
        breakDuration={breakDuration}
        run={run}
        onDone={onDone}
      />
      <section className={styles.configs}>
        <div>
          <label htmlFor='time'>Duration</label>
          <select
            name='time'
            id='time'
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
          >
            <option value='5'>5 minutes</option>
            <option value='10'>10 minutes</option>
            <option value='15'>15 minutes</option>
            <option value='20'>20 minutes</option>
            <option value='25'>25 minutes</option>
            <option value='30'>30 minutes</option>
            <option value='35'>35 minutes</option>
            <option value='40'>40 minutes</option>
            <option value='45'>45 minutes</option>
            <option value='50'>50 minutes</option>
            <option value='55'>55 minutes</option>
            <option value='60'>60 minutes</option>
          </select>
        </div>

        <div>
          <label htmlFor='break'>Break</label>
          <select
            name='break'
            id='break'
            value={breakDuration}
            onChange={(e) => setBreakDuration(e.target.value)}
          >
            <option value='0'>No break</option>
            <option value='1'>1 minute</option>
            <option value='2'>2 minutes</option>
            <option value='3'>3 minutes</option>
            <option value='4'>4 minutes</option>
            <option value='5'>5 minutes</option>
            <option value='10'>10 minutes</option>
            <option value='15'>15 minutes</option>
          </select>
        </div>
        <div>
          <label htmlFor='autostart'>Auto start</label>
          <input
            type='checkbox'
            id='autostart'
            value={autostart}
            onChange={(e) => setAutostart(e.target.checked)}
          />
        </div>
        <button onClick={() => setRun(!run)}>{run ? 'Pause' : 'Start'}</button>
      </section>
    </main>
  );
}
