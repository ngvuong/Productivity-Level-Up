import { createContext, useContext } from 'react';
import { useSession } from 'next-auth/react';

const userContext = createContext();

export function UserProvider({ children }) {
  const { data: session, status } = useSession();

  const value = {
    user: status === 'authenticated' ? session.user : undefined,
    status,
  };
  return <userContext.Provider value={value}>{children}</userContext.Provider>;
}

export function useUser() {
  const context = useContext(userContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}
