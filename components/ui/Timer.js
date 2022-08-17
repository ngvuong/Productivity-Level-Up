import { useState } from 'react';
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

  const [
    { time, run, inSession, pomodoro, breakTime, autostart, alarm, ticking },
    dispatch,
  ] = useTimer();

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

  const onSkip = () => {
    const timeNext = breakTime && inSession ? breakTime : pomodoro;

    dispatch({ type: 'SET_TIME', time: timeNext });

    dispatch({ type: 'SET_IN_SESSION' });

    if (!autostart) dispatch({ type: 'STOP_TIMER' });
  };

  return (
    <div className={styles.timer}>
      <Clock time={time} totalTime={inSession ? pomodoro : breakTime} />
      <div className={styles.status}>
        {run ? (inSession ? 'IN SESSION' : 'ON BREAK') : 'INACTIVE'}
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
                if (!inSession) {
                  setTimeSelected(option);
                  dispatch({ type: 'SET_POMODORO', pomodoro: option.value });
                }
              }}
              options={timeOptions}
              isSearchable={false}
              isDisabled={inSession}
              styles={timeSelectStyles}
            />
          </label>

          <label className={styles.break}>
            <MdCoffee />
            <Select
              value={breakSelected}
              onChange={(option) => {
                if (inSession) {
                  setBreakSelected(option);
                  dispatch({
                    type: 'SET_BREAKTIME',
                    breakTime: option.value,
                  });
                }
              }}
              options={breakOptions}
              isSearchable={false}
              isDisabled={!inSession}
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
