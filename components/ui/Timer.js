import { useState, useRef, useEffect } from 'react';
import Select from 'react-select';
import Clock from './Clock';
import { useTimer } from '../../contexts/timerContext';
import useTasksByDate from '../../hooks/useTasksByDate';

import {
  MdPlayArrow,
  MdPause,
  MdSkipNext,
  MdTaskAlt,
  MdAccessTimeFilled,
  MdCoffee,
  MdAutorenew,
  MdNotifications,
  MdVolumeUp,
} from 'react-icons/md';
import { timeSelectStyles } from '../../lib/selectStyles';
import styles from '../../styles/Timer.module.scss';

export default function Timer({ userId }) {
  const [
    {
      time,
      run,
      inSession,
      count,
      task,
      pomodoro,
      breakTime,
      autostart,
      alarm,
      ticking,
    },
    dispatch,
  ] = useTimer();

  const [taskSelected, setTaskSelected] = useState();
  const [timeSelected, setTimeSelected] = useState({
    label: pomodoro / 60 + ' Minutes',
    value: pomodoro,
  });
  const [breakSelected, setBreakSelected] = useState({
    label: breakTime
      ? breakTime / 60 + ' Minute' + (breakTime !== 60 ? 's' : '')
      : 'No Break',
    value: breakTime,
  });
  const [taskOptions, setTaskOptions] = useState([]);

  const { tasks } = useTasksByDate(userId, 'today', {
    revalidateOnMount: true,
  });

  const timeOptionsRef = useRef(
    [5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60].map((m) => ({
      label: `${m} Minutes`,
      value: m * 60,
    }))
  );

  const breakOptionsRef = useRef(
    [0, 1, 2, 3, 4, 5, 10, 15, 20, 25, 30].map((m) => ({
      label: m === 0 ? 'No Break' : `${m} Minute${m > 1 ? 's' : ''}`,
      value: m * 60,
    }))
  );

  useEffect(() => {
    if (tasks) {
      setTaskOptions(
        tasks.map((task) => ({
          label: task.name,
          value: task.id,
        }))
      );

      if (task) {
        const targetTask = tasks.find((t) => t.id === task);

        if (targetTask)
          setTaskSelected({ label: targetTask.name, value: targetTask.id });
      }
    }
  }, [tasks]);

  const onSkip = () => {
    const shouldSwitch = breakTime && inSession;

    const timeNext = shouldSwitch ? breakTime : pomodoro;

    dispatch({ type: 'SET_TIME', time: timeNext });

    if (shouldSwitch || !inSession) dispatch({ type: 'SET_IN_SESSION' });

    if (!autostart) dispatch({ type: 'STOP_TIMER' });
  };

  return (
    <div className={styles.timer}>
      <div className={styles.status}>
        {inSession ? 'SESSION ' + (count + 1) : 'BREAK'}
      </div>
      <Clock time={time} totalTime={inSession ? pomodoro : breakTime} />
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
        <div className={styles.configsTask}>
          <label className={styles.task}>
            <MdTaskAlt />
            <Select
              value={taskSelected}
              onChange={(option) => {
                setTaskSelected(option);
                dispatch({ type: 'SET_TASK', task: option?.value || '' });
              }}
              options={taskOptions}
              isOptionDisabled={(option) =>
                taskSelected?.value === option.value
              }
              menuPlacement='top'
              isClearable
              placeholder='Select task'
              styles={timeSelectStyles}
            />
          </label>
        </div>
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
              options={timeOptionsRef.current}
              isSearchable={false}
              isDisabled={inSession}
              isOptionDisabled={(option) => timeSelected.value === option.value}
              menuPlacement='top'
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
              options={breakOptionsRef.current}
              isSearchable={false}
              isDisabled={!inSession}
              isOptionDisabled={(option) =>
                breakSelected.value === option.value
              }
              menuPlacement='top'
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
