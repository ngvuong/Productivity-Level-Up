import { useState, useEffect, useRef, useCallback } from 'react';
import Select from 'react-select';
import Clock from './Clock';
import { useTimer } from '../../contexts/timerContext';

import {
  MdPlayArrow,
  MdPause,
  MdSkipNext,
  MdAccessTimeFilled,
  MdCoffee,
  MdAutorenew,
  MdNotifications,
  MdVolumeUp,
} from 'react-icons/md';
import { timeSelectStyles } from '../../lib/selectStyles';
import styles from '../../styles/Timer.module.scss';

export default function Timer({ user }) {
  const [timeSelected, setTimeSelected] = useState({
    label: '30 Minutes',
    value: 4,
  });
  const [breakSelected, setBreakSelected] = useState({
    label: '1 Minute',
    value: 5,
  });
  // const [time, setTime] = useState(timeSelected.value);
  // const [run, setRun] = useState(false);
  // const [soundEffects, setSoundEffects] = useState({
  //   alarm: true,
  //   ticking: true,
  // });

  // const autostart = useRef(null);
  // const count = useRef(null);

  const [
    { time, run, count, pomodoro, breakTime, autostart, alarm, ticking },
    dispatch,
  ] = useTimer();

  // useEffect(() => {
  //   if (run && time === 0) {
  //     // if (alarmRef.current) alarmRef.current.play();

  //     const timeout = setTimeout(() => {
  //       const currentCount = breakTime ? count + 1 : count + 2;

  //       dispatch({ type: 'SET_COUNT', count: currentCount });
  //       if (currentCount % 2 === 0) {
  //         dispatch({ type: 'SET_TIME', time: pomodoro });
  //       } else {
  //         dispatch({ type: 'SET_TIME', time: breakTime });
  //       }
  //       if (!autostart) dispatch({ type: 'STOP_TIMER' });
  //       // onDone();
  //     }, 1000);

  //     return () => clearTimeout(timeout);
  //   }
  // }, [time, run, count, pomodoro, breakTime, autostart, dispatch]);

  // const onDone = () => {
  //   const currentCount = breakTime ? count + 1 : count + 2;

  //   dispatch({ type: 'SET_COUNT', count: currentCount });

  //   if (currentCount % 2 === 0) {
  //     dispatch({ type: 'SET_TIME', time: pomodoro });
  //   } else {
  //     dispatch({ type: 'SET_TIME', time: breakTime });
  //   }

  //   if (!autostart) dispatch({ type: 'STOP_TIMER' });
  // };

  const timeOptions = [5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60].map(
    (m) => ({
      label: `${m} Minutes`,
      value: m * 60,
    })
  );

  const breakOptions = [0, 1, 2, 3, 4, 5, 10, 15, 20, 25, 30].map((m) => ({
    label: m === 0 ? 'No break' : `${m} Minute${m > 1 ? 's' : ''}`,
    value: m * 60,
  }));

  // const onDone = useCallback(() => {
  //   if (!autostart.current.checked) setRun(false);

  //   count.current = breakSelected.value ? ++count.current : 0;

  //   if (count.current % 2 === 0) {
  //     setTime(timeSelected.value);
  //   } else {
  //     setTime(breakSelected.value);
  //   }
  // }, [timeSelected, breakSelected]);

  const onSkip = () => {
    const currentCount = breakTime ? count + 1 : 0;

    if (currentCount % 2 === 0) {
      dispatch({ type: 'SET_TIME', time: pomodoro });
    } else {
      dispatch({ type: 'SET_TIME', time: breakTime });
    }

    dispatch({ type: 'STOP_TIMER' });
    dispatch({ type: 'SET_COUNT', count: currentCount });
  };

  return (
    <div className={styles.timer}>
      <Clock
        time={time}
        totalTime={count % 2 === 0 ? pomodoro : breakTime}
        // seconds={seconds}
        // run={run}
        // onDone={onDone}
        // soundEffects={soundEffects}
      />
      <div className={styles.status}>
        {run ? (count % 2 === 0 ? 'IN SESSION' : 'BREAK TIME') : 'INACTIVE'}
      </div>
      <div className={styles.controlBtns}>
        <button
          className={styles.btnStart}
          onClick={() =>
            run
              ? dispatch({ type: 'STOP_TIMER' })
              : dispatch({ type: 'START_TIMER' })
          }
        >
          {run ? <MdPause /> : <MdPlayArrow />}
        </button>
        <button className={styles.btnSkip} onClick={onSkip}>
          <MdSkipNext />
        </button>
      </div>
      <div className={styles.configs}>
        <div className={styles.configsTime}>
          <label className={styles.time}>
            <MdAccessTimeFilled />
            <Select
              value={timeSelected}
              onChange={(option) => {
                if (!run && count % 2 === 0) {
                  dispatch({ type: 'SET_TIME', time: option.value });
                }

                dispatch({ type: 'SET_POMODORO', pomodoro: option.value });

                setTimeSelected(option);
              }}
              options={timeOptions}
              isSearchable={false}
              styles={timeSelectStyles}
            />
          </label>

          <label className={styles.break}>
            <MdCoffee />
            <Select
              value={breakSelected}
              onChange={(option) => {
                if (!run && count % 2 === 1) {
                  if (option.value === 0) {
                    dispatch({ type: 'SET_TIME', time: pomodoro });
                  }
                }
                dispatch({
                  type: 'SET_BREAKTIME',
                  breakTime: option.value,
                });

                setBreakSelected(option);
              }}
              options={breakOptions}
              isSearchable={false}
              styles={timeSelectStyles}
            />
          </label>
        </div>
        <div className={styles.configsMisc}>
          <div>
            <label htmlFor='autostart'>
              <MdAutorenew />
            </label>
            <input
              type='checkbox'
              id='autostart'
              checked={autostart}
              onChange={(e) =>
                dispatch({ type: 'SET_AUTOSTART', autostart: e.target.checked })
              }
            />
            <label htmlFor='autostart' />
          </div>
          <div>
            <label htmlFor='alarmSound'>
              <MdNotifications />
            </label>
            <input
              type='checkbox'
              id='alarmSound'
              checked={alarm}
              onChange={(e) =>
                dispatch({ type: 'SET_ALARM', alarm: e.target.checked })
              }
            />
            <label htmlFor='alarmSound' />
          </div>
          <div>
            <label htmlFor='tickingSound'>
              <MdVolumeUp />
            </label>
            <input
              type='checkbox'
              id='tickingSound'
              checked={ticking}
              onChange={(e) =>
                dispatch({ type: 'SET_TICKING', ticking: e.target.checked })
              }
            />
            <label htmlFor='tickingSound' />
          </div>
        </div>
      </div>
    </div>
  );
}
