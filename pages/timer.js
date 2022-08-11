import { useState, useRef, useCallback } from 'react';
import Select from 'react-select';
import Clock from '../components/ui/Clock';

import { timeSelectStyles } from '../lib/selectStyles';
import styles from '../styles/Timer.module.scss';

export default function Timer({ user }) {
  const [timeSelected, setTimeSelected] = useState({
    label: '30 minutes',
    value: 1800,
  });
  const [breakSelected, setBreakSelected] = useState({
    label: '1 minute',
    value: 60,
  });
  const [time, setTime] = useState(timeSelected.value);
  const [run, setRun] = useState(false);
  const [soundEffects, setSoundEffects] = useState({
    notification: true,
    ticking: true,
  });

  console.log(user);

  const autostart = useRef(null);
  const count = useRef(null);

  const timeOptions = [5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60].map(
    (m) => ({
      label: `${m} minutes`,
      value: m * 60,
    })
  );

  const breakOptions = [0, 1, 2, 3, 4, 5, 10, 15, 20, 25, 30].map((m) => ({
    label: m === 0 ? 'No break' : `${m} minute${m > 1 ? 's' : ''}`,
    value: m * 60,
  }));

  const onDone = useCallback(() => {
    if (!autostart.current.checked) setRun(false);

    count.current = breakSelected.value ? ++count.current : 0;

    if (count.current % 2 === 0) {
      setTime(timeSelected.value);
    } else {
      setTime(breakSelected.value);
    }
  }, [timeSelected, breakSelected]);

  return (
    <main className={styles.timer}>
      <Clock
        time={time}
        run={run}
        onDone={onDone}
        soundEffects={soundEffects}
      />
      <section className={styles.configs}>
        <div className={styles.configsTime}>
          <label className={styles.time}>
            Time
            <Select
              value={timeSelected}
              onChange={(option) => {
                if (!run && count.current % 2 === 0) setTime(option.value);
                setTimeSelected(option);
              }}
              options={timeOptions}
              isSearchable={false}
              styles={timeSelectStyles}
            />
          </label>

          <label className={styles.break}>
            Break
            <Select
              value={breakSelected}
              onChange={(option) => {
                if (!run && count.current % 2 === 1) {
                  if (option.value === 0) {
                    setTime(timeSelected.value);
                    count.current = 0;
                  } else setTime(option.value);
                }

                setBreakSelected(option);
              }}
              options={breakOptions}
              isSearchable={false}
              styles={timeSelectStyles}
            />
          </label>
        </div>
        <div className={styles.configsOther}>
          <div>
            <label htmlFor='autostart'>Autostart</label>
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
        </div>
        <div className={styles.controlBtns}>
          <button className={styles.btnStart} onClick={() => setRun(!run)}>
            {run ? 'Pause' : 'Start'}
          </button>
          <button className={styles.btnSkip} onClick={onDone}>
            Skip
          </button>
        </div>
      </section>
    </main>
  );
}
