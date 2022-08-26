import {
  useReducer,
  useEffect,
  useRef,
  createContext,
  useContext,
} from 'react';
import { format } from 'date-fns';
import usePomodoros from '../hooks/usePomodoros';

const timerContext = createContext();

const timerReducer = (state, action) => {
  switch (action.type) {
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
    case 'SET_TIME':
      return {
        ...state,
        time: action.time,
        change: 'time',
      };
    case 'SET_TOTAL_TIME':
      return {
        ...state,
        totalTime: action.totalTime,
      };
    case 'SET_COUNT':
      return {
        ...state,
        count: action.count,
      };
    case 'SET_IN_SESSION':
      return {
        ...state,
        inSession: state.breakTime ? !state.inSession : true,
        change: 'inSession',
      };
    case 'SET_POMODORO':
      return {
        ...state,
        pomodoro: action.pomodoro,
        change: 'pomodoro',
      };
    case 'SET_BREAKTIME':
      return {
        ...state,
        breakTime: action.breakTime,
        change: 'breakTime',
      };
    case 'SET_AUTOSTART':
      return {
        ...state,
        autostart: action.autostart,
        change: 'autostart',
      };
    case 'SET_ALARM':
      return {
        ...state,
        alarm: action.alarm,
        change: 'alarm',
      };
    case 'SET_TICKING':
      return {
        ...state,
        ticking: action.ticking,
        change: 'ticking',
      };
    case 'CLEAR_CHANGE':
      return {
        ...state,
        change: '',
      };
    default:
      throw new Error(`Unhandled action type: ${action.type}`);
  }
};

export const TimerProvider = ({ user, children }) => {
  const { id, userId, ...settings } = user?.settings || {};
  const { pomodoros, setPomodoros } = usePomodoros(userId, {
    fallbackData: user?.pomos,
  });

  const [state, dispatch] = useReducer(timerReducer, settings);

  const {
    time,
    run,
    totalTime,
    count,
    inSession,
    pomodoro,
    breakTime,
    autostart,
    alarm,
    ticking,
    change,
  } = state;

  const alarmRef = useRef(null);
  const tickingRef = useRef(null);

  useEffect(() => {
    if (pomodoros) {
      const today = format(new Date(), 'yyyy-MM-dd');

      const pomodorosToday = pomodoros.filter((pomo) => pomo.date === today);

      const totalTime = pomodorosToday.reduce(
        (sum, curr) => sum + curr.duration,
        0
      );
      const count = pomodorosToday.length;

      dispatch({ type: 'SET_TOTAL_TIME', totalTime });

      dispatch({ type: 'SET_COUNT', count });
    }
  }, [pomodoros]);

  useEffect(() => {
    if (alarm) {
      alarmRef.current = new Audio('./alarm.mp3');
    } else alarmRef.current = null;

    if (ticking) {
      tickingRef.current = new Audio('./ticking.mp3');
    } else tickingRef.current = null;
  }, [alarm, ticking]);

  useEffect(() => {
    if (run && time > 0) {
      const interval = setInterval(() => {
        if (tickingRef.current) tickingRef.current.play();

        dispatch({ type: 'SET_TIME', time: time - 1 });
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [time, run]);

  useEffect(() => {
    if (time === 0) {
      if (alarmRef.current) alarmRef.current.play();

      const timeout = setTimeout(() => {
        const shouldSwitch = breakTime && inSession;

        const timeNext = shouldSwitch ? breakTime : pomodoro;

        if (inSession) {
          const savePomodoro = async () => {
            const result = await fetch(`api/user/${user.id}/pomodoros`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                date: format(new Date() - pomodoro * 1000, 'yyyy-MM-dd'),
                duration: pomodoro,
              }),
            }).then((res) => res.json());

            if (result.error) console.error(result.error);

            if (result.ok) setPomodoros();
          };

          savePomodoro();
        }

        dispatch({ type: 'SET_TIME', time: timeNext });

        if (shouldSwitch || !inSession) dispatch({ type: 'SET_IN_SESSION' });

        if (!autostart) dispatch({ type: 'STOP_TIMER' });
      }, 1000);

      return () => clearTimeout(timeout);
    }

    if (time === null) {
      dispatch({
        type: 'SET_TIME',
        time: breakTime && !inSession ? breakTime : pomodoro,
      });
    }
  }, [time, totalTime, count, inSession, pomodoro, breakTime, autostart, user]);

  useEffect(() => {
    if (change) {
      const update = async (setting = change) => {
        const result = await fetch(`api/user/${user.id}/settings`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            [setting]: state[setting],
          }),
        }).then((res) => res.json());

        if (result.error) console.error(result.error);

        if (result.ok) dispatch({ type: 'CLEAR_CHANGE' });
      };

      if (change !== 'time') {
        update();

        if (change === 'inSession') update('time');
      } else {
        const boundUpdate = update.bind(null, 'time');

        window.addEventListener('beforeunload', boundUpdate);

        return () => window.removeEventListener('beforeunload', boundUpdate);
      }
    }
  }, [state, change, user]);

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
