import { useState, useRef, useCallback } from 'react';
import Clock from '../components/ui/Clock';

import styles from '../styles/Timer.module.scss';

export default function Timer() {
  const [duration, setDuration] = useState(0.1);
  const [breakDuration, setBreakDuration] = useState(1);
  const [time, setTime] = useState(duration * 60);
  const [run, setRun] = useState(false);
  const [soundEffects, setSoundEffects] = useState({
    notification: true,
    ticking: true,
  });
  const autostart = useRef(null);
  const count = useRef(null);

  const onDone = useCallback(() => {
    if (!autostart.current.checked) setRun(false);

    count.current = breakDuration ? ++count.current : 0;
    if (count.current % 2 === 0) {
      setTime(duration * 60);
    } else {
      setTime(breakDuration * 60);
    }
  }, [duration, breakDuration]);

  return (
    <main className={styles.timer}>
      <Clock
        time={time}
        run={run}
        onDone={onDone}
        soundEffects={soundEffects}
      />
      <section className={styles.configs}>
        <div>
          <label htmlFor='time'>Duration</label>
          <select
            name='time'
            id='time'
            value={duration}
            onChange={(e) => {
              const minutes = parseInt(e.target.value);
              setDuration(minutes);
              setTime(minutes * 60);
            }}
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
            <option value=''>No break</option>
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
          <input type='checkbox' id='autostart' ref={autostart} />
          <label htmlFor='autostart' />
        </div>
        <div>
          <label htmlFor='notificationSound'>Notification</label>
          <input
            type='checkbox'
            id='notificationSound'
            checked={soundEffects.notification}
            onChange={(e) =>
              setSoundEffects({
                ...soundEffects,
                notification: e.target.checked,
              })
            }
          />
          <label htmlFor='notificationSound' />
        </div>
        <div>
          <label htmlFor='tickingSound'>Ticking</label>
          <input
            type='checkbox'
            id='tickingSound'
            checked={soundEffects.ticking}
            onChange={(e) =>
              setSoundEffects({ ...soundEffects, ticking: e.target.checked })
            }
          />
          <label htmlFor='tickingSound' />
        </div>
      </section>
      <button onClick={() => setRun(!run)}>{run ? 'Pause' : 'Start'}</button>
    </main>
  );
}
