import { createContext, useReducer, useEffect, useContext } from 'react';
import { useSession } from 'next-auth/react';
import Overlay from '../components/layout/Overlay';
import Spinner from '../components/layout/Spinner';

const userContext = createContext();

const userReducer = (state, action) => {
  switch (action.type) {
    case 'SET_LEVEL':
      return {
        ...state,
        level: action.level,
        change: 'level',
      };
    case 'SET_EXP':
      const { level, expMin, expReq } = state;

      const change = action.exp >= expMin + expReq ? 'levelUp' : 'exp';

      return {
        ...state,
        exp: action.exp,
        ...(change === 'levelUp' && {
          level: level + 1,
          expMin: expMin + expReq,
          expReq: Math.ceil(expReq * 1.1),
        }),
        change,
      };
    case 'SET_STREAK':
      return {
        ...state,
        streak: action.streak || 0,
        streakDate: action.streakDate || null,
        change: 'streak',
      };
    case 'SET_USER':
      const { user } = action;

      return user;
    case 'CLEAR_CHANGE':
      return {
        ...state,
        change: '',
      };
    default:
      throw new Error(`Unhandled action type: ${action.type}`);
  }
};

export function UserProvider({ children }) {
  const { data: session, status } = useSession();

  const [state, dispatch] = useReducer(userReducer, { loading: true });

  useEffect(() => {
    if (status !== 'loading') {
      const user = session ? { ...session.user, loading: false } : undefined;

      dispatch({ type: 'SET_USER', user });
    }
  }, [session, status]);

  useEffect(() => {
    if (state && state.change) {
      const update = async () => {
        const { level, exp, expMin, expReq, streak, streakDate, change } =
          state;

        const result = await fetch(`api/user/${state.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            ...(change !== 'levelUp'
              ? {
                  [change]: state[change],
                }
              : {
                  level,
                  exp,
                  expMin,
                  expReq,
                }),
            ...(change === 'streak' && {
              streakDate: state.streakDate,
            }),
          }),
        }).then((res) => res.json());

        if (result.error) console.error(result.error);

        if (result.success) dispatch({ type: 'CLEAR_CHANGE' });
      };

      update();
    }
  }, [state]);

  if (state && state.loading) {
    return (
      <Overlay>
        <Spinner />
      </Overlay>
    );
  }

  const value = [state, dispatch];

  return <userContext.Provider value={value}>{children}</userContext.Provider>;
}

export function useUser() {
  const context = useContext(userContext);

  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }

  return context;
}
