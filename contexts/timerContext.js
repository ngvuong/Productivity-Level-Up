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
        skip: false,
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
    case 'SKIP_TIME':
      return {
        ...state,
        skip: true,
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
  const [state, dispatch] = useReducer(
    timerReducer,
    user
      ? {
          time: user.settings.time || user.settings.pomodoro,
          run: false,
          skip: false,
          totalTime: 0,
          count: 0,
          inSession: true,
          pomodoro: user.settings.pomodoro,
          breakTime: user.settings.breakTime,
          autostart: user.settings.autostart,
          alarm: user.settings.alarm,
          ticking: user.settings.ticking,
        }
      : {}
  );

  const {
    time,
    run,
    skip,
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
  const timeRef = useRef(time);

  useEffect(() => {
    if (alarm) {
      alarmRef.current = new Audio('./alarm.mp3');
    } else alarmRef.current = null;

    if (ticking) {
      tickingRef.current = new Audio('./ticking.mp3');
    } else tickingRef.current = null;
  }, [alarm, ticking]);

  useEffect(() => {
    if (run) {
      const interval = setInterval(() => {
        if (timeRef.current > 0) {
          if (tickingRef.current) tickingRef.current.play();

          timeRef.current = timeRef.current - 1;
          dispatch({ type: 'SET_TIME', time: timeRef.current });
        } else clearInterval(interval);
      }, 1000);

      if (timeRef.current === 0) return () => clearInterval(interval);

      return () => clearInterval(interval);
    }
  }, [run]);

  useEffect(() => {
    if (time === 0 || skip) {
      if (alarmRef.current && !skip) alarmRef.current.play();

      dispatch({ type: 'STOP_TIMER' });

      const timeout = setTimeout(() => {
        const timeNext = breakTime && inSession ? breakTime : pomodoro;

        if (inSession && !skip) {
          dispatch({ type: 'SET_TOTAL_TIME', totalTime: totalTime + pomodoro });
          dispatch({ type: 'SET_COUNT', count: count + 1 });
        }
        timeRef.current = timeNext;

        dispatch({ type: 'SET_TIME', time: timeNext });

        dispatch({ type: 'SET_IN_SESSION' });

        if (autostart) dispatch({ type: 'START_TIMER' });
      }, 1000);

      return () => clearTimeout(timeout);
    }
  }, [time, skip, totalTime, count, inSession, pomodoro, breakTime, autostart]);

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
  useEffect(() => {
    const saveTime = async () => {
      if (timeRef.current) {
        const data = await fetch(`api/user/${user.id}/settings`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            time: timeRef.current,
          }),
        }).then((res) => res.json());

        if (data.error) console.error(data.error);
      }
    };
    console.log('hi');
    window.addEventListener('beforeunload', saveTime);
    return () => {
      // if (unmountRef.current) console.log(unmountRef.current);
      // saveTime();
      console.log('bye');
      window.removeEventListener('beforeunload', saveTime);
    };
  }, []);
  // useEffect(() => {
  //   localStorage.setItem('time', time);
  // }, [time]);

  // useEffect(() => {
  //   // const time = timeRef.current;
  //   // if (time % 1 === 0) {
  //   // return () => {
  //   console.log(localStorage.getItem('time'));
  //   fetch(`api/user/${user.id}/settings`, {
  //     method: 'POST',
  //     headers: {
  //       'Content-Type': 'application/json',
  //     },
  //     body: JSON.stringify({
  //       time,
  //     }),
  //   }).then((res) => {
  //     const data = res.json();
  //     // if (data.error) console.error(result.error);
  //     data.then((msg) => console.log(msg));
  //   });
  //   // };
  //   // }
  // }, []);

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
