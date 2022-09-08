import { useReducer, useEffect, createContext, useContext } from 'react';
import usePomodoros from '../hooks/usePomodoros';
import { useUser } from './userContext';

const settingsContext = createContext();

const settingsReducer = (state, action) => {
  switch (action.type) {
    case 'SAVE_TIME':
      return {
        ...state,
        ...(state.time !== action.time && {
          time: action.time,
          change: 'time',
        }),
      };
    case 'SET_TOTAL_TIME':
      return {
        ...state,
        ...(state.totalTime !== action.totalTime && {
          totalTime: action.totalTime,
          change: 'totalTime',
        }),
      };
    case 'SET_COUNT':
      return {
        ...state,
        ...(state.count !== action.count && {
          count: action.count,
          change: 'count',
        }),
      };
    case 'SET_IN_SESSION':
      const inSession = state.breakTime ? !state.inSession : true;

      return {
        ...state,
        ...(inSession !== state.inSession && {
          inSession,
          change: 'inSession',
        }),
      };
    case 'SET_TASK':
      return {
        ...state,
        task: action.task,
        change: 'task',
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

export const SettingsProvider = ({ children }) => {
  const [user] = useUser();

  const { id, userId, ...settings } = user?.settings;

  const [state, dispatch] = useReducer(settingsReducer, settings || {});

  const { pomodoros } = usePomodoros(userId, 'today', {
    revalidateOnMount: true,
  });

  const { change } = state;

  useEffect(() => {
    if (pomodoros) {
      const totalTime = pomodoros.reduce((sum, curr) => sum + curr.duration, 0);

      const count = pomodoros.length;

      dispatch({ type: 'SET_TOTAL_TIME', totalTime });

      dispatch({ type: 'SET_COUNT', count });
    }
  }, [pomodoros]);

  useEffect(() => {
    if (change) {
      console.log(change);
      const update = async () => {
        const result = await fetch(`api/user/${userId}/settings`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            [change]: state[change],
            ...(change === 'count' && { totalTime: state.totalTime }),
          }),
        }).then((res) => res.json());

        if (result.error) console.error(result.error);

        if (result.success) dispatch({ type: 'CLEAR_CHANGE' });
      };

      update();
    }
  }, [state, change, userId]);

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
