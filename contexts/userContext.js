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
      return {
        ...state,
        exp: action.exp,
        ...(action.exp >= state.expMin + state.expReq && {
          level: state.level + 1,
          expMin: state.expMin + state.expReq,
          expReq: Math.round(state.expReq * 1.1),
        }),
        change: 'exp',
      };
    case 'SET_STREAK':
      return {
        ...state,
        streak: action.streak || 0,
        streakDate: action.streakDate || null,
        change: 'streak',
      };
    case 'SET_USER':
      return action.user
        ? {
            ...action.user,
            loading: false,
          }
        : undefined;
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
      if (session) {
        dispatch({ type: 'SET_USER', user: session.user });
      } else dispatch({ type: 'SET_USER' });
    }
  }, [session, status]);

  useEffect(() => {
    if (state && state.change) {
      const update = async () => {
        const result = await fetch(`api/user/${state.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            [state.change]: state[state.change],
            ...(state.change === 'streak' && {
              streakDate: state.streakDate,
            }),
            ...(state.change === 'exp' &&
              state.exp >= state.expMin && {
                level: state.level,
                expMin: state.expMin,
                expReq: state.expReq,
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
