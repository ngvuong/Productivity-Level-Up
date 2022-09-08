import { useState, useRef, useEffect } from 'react';
import { format } from 'date-fns';
import Select from 'react-select';
import Clock from './Clock';
import useTasks from '../../hooks/useTasks';
import { useSettings } from '../../contexts/settingsContext';
import { useTimer } from '../../contexts/timerContext';

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
    { inSession, count, task, pomodoro, breakTime, autostart, alarm, ticking },
    dispatch,
  ] = useSettings();

  const [{ time, run }, timerDispatch] = useTimer();

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
  const [skip, setSkip] = useState(false);

  const { tasks } = useTasks(userId, {
    revalidateOnMount: true,
  });

  const runningRef = useRef(run);

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
      const today = format(new Date(), 'yyyy-MM-dd');

      const tasksToday = tasks.filter((task) => task.date === today);

      setTaskOptions(
        tasksToday.map((task) => ({
          label: task.name,
          value: task.id,
        }))
      );

      if (task) {
        const targetTask = tasksToday.find((t) => t.id === task);

        if (targetTask)
          setTaskSelected({ label: targetTask.name, value: task });
      }
    }
  }, [tasks, task]);

  useEffect(() => {
    if (skip) {
      timerDispatch({ type: 'STOP_TIMER' });

      const shouldSwitch = breakTime && inSession;

      const timeNext = shouldSwitch ? breakTime : pomodoro;

      const timeout = setTimeout(() => {
        timerDispatch({ type: 'SET_TIME', time: timeNext });

        if (runningRef.current) timerDispatch({ type: 'START_TIMER' });

        if (shouldSwitch || !inSession) dispatch({ type: 'SET_IN_SESSION' });
        setSkip(false);
      }, 100);

      return () => clearTimeout(timeout);
    }
  }, [skip, inSession, breakTime, pomodoro, timerDispatch, dispatch]);

  return (
    <div className={styles.timer}>
      <div className={styles.status}>
        {inSession ? 'SESSION ' + (count + 1) : 'BREAK'}
      </div>
      <Clock time={time} totalTime={inSession ? pomodoro : breakTime} />
      <div className={styles.controlBtns}>
        <button
          className={styles.btnStart}
          onClick={() => {
            if (run) {
              timerDispatch({ type: 'STOP_TIMER' });
              runningRef.current = false;
            } else {
              timerDispatch({ type: 'START_TIMER' });
              runningRef.current = true;
            }
          }}
        >
          {run ? <MdPause /> : <MdPlayArrow />}
        </button>
        <button className={styles.btnSkip} onClick={() => setSkip(true)}>
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
              isOptionDisabled={({ value }) => taskSelected?.value === value}
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
              isOptionDisabled={({ value }) => timeSelected.value === value}
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
              isOptionDisabled={({ value }) => breakSelected.value === value}
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
              onChange={({ target }) =>
                dispatch({ type: 'SET_AUTOSTART', autostart: target.checked })
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
              onChange={({ target }) =>
                dispatch({ type: 'SET_ALARM', alarm: target.checked })
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
              onChange={({ target }) =>
                dispatch({ type: 'SET_TICKING', ticking: target.checked })
              }
            />
            <label htmlFor='tickingSound' />
          </div>
        </div>
      </div>
    </div>
  );
}
