import axios from "axios";
import { createContext, useMemo, useState } from "react";

type ContextType = Auth | null;

export const AuthContext = createContext<ContextType | null>(null);

export const AuthProvider = ({ children }: { children: any }) => {
  const [user, setUser] = useState<User | null>(null);

  const login = async (userData: User) => {
    try {
      await axios.post("https://frontend-take-home-service.fetch.com/auth/login", {
        name: userData.name,
        email: userData.email,
      }, {
        headers: {
          "Content-Type": "application/json;charset=UTF-8"
        }, withCredentials: true
      }).then((response) => {
        if (response.status === 200) {
          setUser(userData);
          return user;
        } else {
          throw new Error(`${response.status}: Login failed`);
        }
      }).catch((error) => {
        console.error("Could not login: ", error);
      })
    } catch (error) {
      console.error("Could not login: ", error);
    }
  }

  const logout = async () => {
    try {
      await axios.post("https://frontend-take-home-service.fetch.com/auth/logout", {}, {
        headers: {
          "Content-Type": "application/json"
        }, withCredentials: true
      }).then((res) => {
        if (res.status === 200) {
          setUser(null);
        } else {
          throw new Error(`${res.status}: Logout failed`);
        }
      }).catch((error) => {
        console.error("Could not logout: ", error);
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