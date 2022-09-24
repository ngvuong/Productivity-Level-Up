import {
  useReducer,
  useEffect,
  useRef,
  createContext,
  useContext,
} from 'react';
import { format, parseISO, addDays } from 'date-fns';
import usePomodoros from '../hooks/usePomodoros';
import { useUser } from './userContext';
import { useSettings } from './settingsContext';

const timerContext = createContext();

const timerReducer = (state, { type, time }) => {
  switch (type) {
    case 'SET_TIME':
      return {
        ...state,
        time: time,
      };
    case 'START_TIMER':
      return {
        ...state,
        run: true,
      };
    case 'STOP_TIMER':
      return {
        ...state,
        run: false,
      };
    default:
      throw new Error(`Unhandled action type: ${type}`);
  }
};

export const TimerProvider = ({ children }) => {
  const [user, userDispatch] = useUser();

  const [settings, settingsDispatch] = useSettings();

  const { time: savedTime, alarm, ticking } = settings;

  const [state, dispatch] = useReducer(timerReducer, { time: 5 });

  const { time, run } = state;

  const { setPomodoros } = usePomodoros(user?.id, 'today');

  const timeRef = useRef(time);
  const intervalRef = useRef(null);
  const alarmRef = useRef(null);
  const tickingRef = useRef(null);

  useEffect(() => {
    if (alarm) {
      alarmRef.current = new Audio('./alarm.mp3');
    } else alarmRef.current = null;

    if (ticking) {
      tickingRef.current = new Audio('./ticking.mp3');
    } else tickingRef.current = null;
  }, [alarm, ticking]);

  useEffect(() => {
    if (time !== timeRef.current) timeRef.current = time;
  }, [time]);

  useEffect(() => {
    if (run && time > 0 && !intervalRef.current) {
      intervalRef.current = setInterval(() => {
        if (tickingRef.current) tickingRef.current.play();

        dispatch({ type: 'SET_TIME', time: --timeRef.current });

        if (timeRef.current === 0) {
          clearInterval(intervalRef.current);

          intervalRef.current = null;
        }
      }, 1000);
    }

    if (!run) {
      clearInterval(intervalRef.current);

      intervalRef.current = null;
    }
  }, [time, run]);

  useEffect(() => {
    const { inSession, pomodoro, breakTime } = settings;

    if (time === 0) {
      if (alarmRef.current) alarmRef.current.play();

      const timeout = setTimeout(() => {
        const { totalTime, task, autostart } = settings;
        const shouldSwitch = breakTime && inSession;
        const timeNext = shouldSwitch ? breakTime : pomodoro;
        const date = format(new Date(), 'yyyy-MM-dd');

        dispatch({ type: 'SET_TIME', time: timeNext });

        if (!autostart) dispatch({ type: 'STOP_TIMER' });

        if (inSession) {
          let { id, vLevel, vExp, vExpRate, streak, streakDate } = user;

          const isNewStreak = streakDate !== date;

          if (isNewStreak) {
            const streakNextDay = streakDate
              ? format(addDays(parseISO(streakDate), 1), 'yyyy-MM-dd')
              : null;

            streak = streakNextDay === date ? ++streak : 1;

            userDispatch({ type: 'SET_STREAK', streak, streakDate: date });
          }

          let time = totalTime / 60;
          let exp = 0;
          let bonus = 0;

          for (let i = 0; i < pomodoro / 60; i++) {
            exp += vExpRate * (1 + Math.floor(time / 5) * 0.01);

            time++;

            const hit = Math.floor(Math.random() * 100 + 1) > 95;

            bonus += (hit + streak / 1000) * vLevel;
          }

          exp = +exp.toFixed(2);
          bonus = +bonus.toFixed(2);

          vExp = +(vExp + exp + bonus).toFixed(2);

          userDispatch({ type: 'SET_VIRTUAL_EXP', vExp });

          (async () => {
            const result = await fetch(`api/user/${id}/pomodoros/${date}`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                date,
                duration: pomodoro,
                exp,
                bonus,
                taskId: task,
              }),
            }).then((res) => res.json());

            if (result.error) console.error(result.error);

            if (result.success) setPomodoros();
          })();
        }

        settingsDispatch({ type: 'SET_IN_SESSION' });
      }, 1000);

      return () => clearTimeout(timeout);
    }

    if (time === null) {
      dispatch({
        type: 'SET_TIME',
        time: breakTime && !inSession ? breakTime : pomodoro,
      });
    }
  }, [time, user, userDispatch, settings, settingsDispatch, setPomodoros]);

  useEffect(() => {
    const saveTime = () =>
      settingsDispatch({ type: 'SAVE_TIME', time: timeRef.current });

    window.addEventListener('beforeunload', saveTime);

    return () => window.removeEventListener('beforeunload', saveTime);
  }, [settingsDispatch]);

  const value = [state, dispatch];

  return (
    <timerContext.Provider value={value}>{children}</timerContext.Provider>
  );
};

export const useTimer = () => {
  const context = useContext(timerContext);

  if (context === undefined) {
    throw new Error('useTimer must be used within a TimerProvider');
  }

  return context;
};
