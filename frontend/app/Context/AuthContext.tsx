"use client";

import { ReactNode, createContext, useEffect, useState } from "react";

type stateProps = {
  email: string;
  token: string;
  user:UserProfile
};

export type ContextProps = {
  state: stateProps | null;
  updateUser: (x: stateProps | null) => void;
  loadingUser: boolean;
};

export const AuthContext = createContext<ContextProps | null>(null);

const AuthContextProvider = ({ children }: { children: ReactNode }) => {
  //   const [state, dispatch] = useReducer(AuthReducer, { user: null });
  const [state, setState] = useState<stateProps | null>(null);

  const [loadingUser, setLoadingUser] = useState(true);

  const updateUser = (user: stateProps | null) => {
    setState(user);
  };

  const getUserFromLocalStorage = async () => {
    setLoadingUser(true);
    const user = await localStorage.getItem("user");
    if (user) {
      updateUser(JSON.parse(user));
      setLoadingUser(false);
    }
    setLoadingUser(false);
  };

  useEffect(() => {
    getUserFromLocalStorage();
  }, []);

  console.log("AuthContext:", state);
  return (
    <AuthContext.Provider value={{ state, updateUser, loadingUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContextProvider;
