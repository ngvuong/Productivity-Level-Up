import {
  useReducer,
  useEffect,
  useRef,
  createContext,
  useContext,
  cloneElement,
  Children,
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
    case 'SET_TIME':
      return {
        ...state,
        time: action.time,
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
  const [state, dispatch] = useReducer(timerReducer, {
    time: user.settings.time ? user.settings.time : user.settings.pomodoro,
    run: false,
    totalTime: 0,
    count: 0,
    inSession: true,
    pomodoro: user.settings.pomodoro,
    breakTime: user.settings.breakTime,
    autostart: user.settings.autostart,
    alarm: user.settings.alarm,
    ticking: user.settings.ticking,
  });

  const alarmRef = useRef(null);
  const tickingRef = useRef(null);
  const unmountRef = useRef(false);

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
    return () => {
      unmountRef.current++;
      console.log(unmountRef.current);
    };
  }, []);

  useEffect(() => {
    console.log(unmountRef.current);
    if (unmountRef.current > 1) {
      return () => {
        console.log(time);
      };
    }
  }, [time]);

  useEffect(() => {
    if (run && time === 0) {
      if (alarmRef.current) alarmRef.current.play();

      const timeout = setTimeout(() => {
        const timeNext = breakTime && inSession ? breakTime : pomodoro;

        if (inSession) {
          dispatch({ type: 'SET_TOTAL_TIME', totalTime: totalTime + pomodoro });
          dispatch({ type: 'SET_COUNT', count: count + 1 });
        }

        dispatch({ type: 'SET_TIME', time: timeNext });

        dispatch({ type: 'SET_IN_SESSION' });

        if (!autostart) dispatch({ type: 'STOP_TIMER' });
      }, 1000);

      return () => clearTimeout(timeout);
    }
  }, [time, run, totalTime, count, inSession, pomodoro, breakTime, autostart]);

  useEffect(() => {
    if (change) {
      (async function update() {
        const result = await fetch(`api/user/${user.id}/settings`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            [change]: state[change],
          }),
        }).then((res) => res.json());

        if (result.error) console.error(result.error);

        if (result.message) dispatch({ type: 'CLEAR_CHANGE' });
      })();
    }
  }, [state, change]);

  const value = [state, dispatch];

  return (
    <timerContext.Provider value={value}>
      {Children.toArray(children).map((child) => cloneElement(child, { user }))}
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
