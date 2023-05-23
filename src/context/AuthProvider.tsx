import { createContext, useMemo, useState } from "react";

type ContextType = Auth | null;

export const AuthContext = createContext<ContextType | null>(null);

export const AuthProvider = ({ children }: { children: any }) => {
  const [user, setUser] = useState<User | null>(null);

  const login = async (userData: User) => {
    console.log(JSON.stringify(userData));
    try {
      await fetch("https://frontend-take-home-service.fetch.com/auth/login", {
      method: "POST",
      headers: {
        "content-type": "application/json;charset=UTF-8"
      },
      body: JSON.stringify(userData),
      }).then((res) => {
        if (res.status === 200) {
          setUser(userData);
          return user;
        } else {
          throw Error(`${res.status}: Invalid request`);
        }
      }).catch((error) => {
        console.error(error);
      });
    } catch (error) {
      console.error("Could not login: ", error);
    }
  }

  const logout = async () => {
    try {
      await fetch("https://frontend-take-home-service.fetch.com/auth/logout", {
        method: "POST",
        headers: {
          "content-type": "application/json;charset=UTF-8",
        },
        credentials: "include"
      }).then((res) => {
        if (res.status === 200) {
          setUser(null);
        } else {
          throw Error(`${res.status}: Invalid request`);
        }
      }).catch((error) => {
        console.error(error);
      })
    } catch (error) {
      console.error("Could not logout: ", error);
    }
  }

  const val = useMemo(
    () => ({
      user,
      login,
      logout,
    }),
    [user]
  );

  return <AuthContext.Provider value={val}>{children}</AuthContext.Provider>;
}