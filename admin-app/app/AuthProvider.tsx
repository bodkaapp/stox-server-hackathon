"use client";

import { createContext, useContext, ReactNode } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { User } from "firebase/auth";
import { auth } from "./firebase";

type AuthContextType = {
  user: User | null | undefined;
  loading: boolean;
  error: Error | undefined;
};

const AuthContext = createContext<AuthContextType>({
  user: undefined,
  loading: true,
  error: undefined,
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, loading, error] = useAuthState(auth);

  return (
    <AuthContext.Provider value={{ user, loading, error }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
