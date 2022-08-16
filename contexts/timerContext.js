import {
  useReducer,
  useEffect,
  useRef,
  createContext,
  useContext,
  cloneElement,
} from 'react';

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
    case 'GET_TIME':
      return {
        ...state,
        time: action.time,
      };
    case 'SET_TIME':
      return {
        ...state,
        time: action.time,
      };
    case 'SKIP_TIME':
      return {
        ...state,
        count: action.count,
      };
    case 'SET_COUNT':
      return {
        ...state,
        count: action.count,
      };
    case 'SET_POMODORO':
      return {
        ...state,
        pomodoro: action.pomodoro,
      };
    case 'SET_BREAKTIME':
      return {
        ...state,
        breakTime: action.breakTime,
      };
    case 'SET_AUTOSTART':
      return {
        ...state,
        autostart: action.autostart,
      };
    case 'SET_ALARM':
      return {
        ...state,
        alarm: action.alarm,
      };
    case 'SET_TICKING':
      return {
        ...state,
        ticking: action.ticking,
      };
    default:
      throw new Error(`Unhandled action type: ${action.type}`);
  }
};

export const TimerProvider = ({ user, children }) => {
  const [state, dispatch] = useReducer(
    timerReducer,
    {
      time: 4,
      run: false,
      pomodoro: 4,
      breakTime: 5,
      count: 0,
      autostart: false,
      alarm: true,
      ticking: true,
    }
    // initialState
  );

  const alarmRef = useRef(null);
  const tickingRef = useRef(null);
  // console.log(user);

  const { time, run, pomodoro, breakTime, count, autostart, alarm, ticking } =
    state;

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
  }, [run, time]);

  useEffect(() => {
    if (run && time === 0) {
      if (alarmRef.current) alarmRef.current.play();

      const timeout = setTimeout(() => {
        const currentCount = breakTime ? count + 1 : count + 2;

        dispatch({ type: 'SET_COUNT', count: currentCount });
        if (currentCount % 2 === 0) {
          dispatch({ type: 'SET_TIME', time: pomodoro });
        } else {
          dispatch({ type: 'SET_TIME', time: breakTime });
        }
        if (!autostart) dispatch({ type: 'STOP_TIMER' });
        // onDone();
      }, 1000);

      return () => clearTimeout(timeout);
    }
  }, [time, run, count, pomodoro, breakTime, autostart]);

  const value = [state, dispatch];

  return (
    <timerContext.Provider value={value}>
      {cloneElement(children, { user })}
    </timerContext.Provider>
  );
};

export const useTimer = () => {
  const context = useContext(timerContext);

  if (context === undefined) {
    throw new Error('useTimer must be used within a TimerProvider');
  }

  return context;
};
