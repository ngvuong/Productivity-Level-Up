import { useReducer, useEffect, createContext, useContext } from 'react';
import usePomodoros from '../hooks/usePomodoros';
import { useUser } from './userContext';

const settingsContext = createContext();

const settingsReducer = (state, action) => {
  const {
    type,
    time,
    exp,
    totalTime,
    count,
    task,
    pomodoro,
    breakTime,
    autostart,
    alarm,
    ticking,
  } = action;
  console.log('run');
  switch (type) {
    case 'SAVE_TIME':
      return {
        ...state,
        ...(state.time !== time && {
          time,
          change: true,
        }),
      };
    case 'SET_EXP':
      return {
        ...state,
        ...(state.exp !== exp && {
          exp,
          change: true,
        }),
      };
    case 'SET_TOTAL_TIME':
      return {
        ...state,
        ...(state.totalTime !== totalTime && {
          totalTime,
          change: true,
        }),
      };
    case 'SET_COUNT':
      return {
        ...state,
        ...(state.count !== count && {
          count,
          change: true,
        }),
      };
    case 'SET_IN_SESSION':
      const inSession = state.breakTime ? !state.inSession : true;

      return {
        ...state,
        ...(inSession !== state.inSession && {
          inSession,
          change: true,
        }),
      };
    case 'SET_TASK':
      return {
        ...state,
        task,
        change: true,
      };
    case 'SET_POMODORO':
      return {
        ...state,
        pomodoro,
        change: true,
      };
    case 'SET_BREAKTIME':
      return {
        ...state,
        breakTime,
        change: true,
      };
    case 'SET_AUTOSTART':
      return {
        ...state,
        autostart,
        change: true,
      };
    case 'SET_ALARM':
      return {
        ...state,
        alarm,
        change: true,
      };
    case 'SET_TICKING':
      return {
        ...state,
        ticking,
        change: true,
      };
    case 'CLEAR_CHANGE':
      return {
        ...state,
        change: false,
      };
    default:
      throw new Error(`Unhandled action type: ${type}`);
  }
};

export const SettingsProvider = ({ children }) => {
  const { settings: { id, userId, ...settings } = {} } = useUser()[0] || {};

  const [state, dispatch] = useReducer(settingsReducer, settings || {});

  const { pomodoros } = usePomodoros(userId, 'today');

  useEffect(() => {
    if (pomodoros) {
      const { exp, totalTime, count } = pomodoros.reduce(
        (acc, { claimed, exp, bonus, duration }) => {
          if (claimed) acc.exp = +(acc.exp + exp + bonus).toFixed(2);

          acc.totalTime += duration;
          acc.count++;

          return acc;
        },
        { exp: 0, totalTime: 0, count: 0 }
      );

      dispatch({ type: 'SET_EXP', exp });
      dispatch({ type: 'SET_TOTAL_TIME', totalTime });
      dispatch({ type: 'SET_COUNT', count });
    }
  }, [pomodoros]);

  useEffect(() => {
    if (state.change && userId) {
      const { change, ...settings } = state;
      const body = JSON.stringify(settings);
      console.log('run');

      (async () => {
        const result = await fetch(`api/user/${userId}/settings`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body,
        }).then((res) => res.json());
        if (result.error) console.error(result.error);

        dispatch({ type: 'CLEAR_CHANGE' });
      })();
    }
  }, [state, userId]);

  const value = [state, dispatch];

  return (
    <settingsContext.Provider value={value}>
      {children}
    </settingsContext.Provider>
  );
};

export const useSettings = () => {
  const context = useContext(settingsContext);

  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }

  return context;
};
