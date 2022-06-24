import Router from "next/router";
import { setCookie } from "nookies";
import { createContext, useState } from "react";

import { api } from "../services/api";

type User = {
  email: string;
  permissions: string[];
  roles: string[];
}

type Credentials = {
  email: string;
  password: string;
};

type AuthContextData = {
  signIn(credentials: Credentials): Promise<void>;
  user: User;
  isAuthenticated: boolean;
};

type AuthProviderProps = {
  children: React.ReactNode;
};

export const AuthContext = createContext({} as AuthContextData);

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User>({} as User);
  const isAuthenticated = !!user;

  async function signIn({ email, password }: Credentials) {
    try {
      const response = await api.post("/sessions", {
        email, password
      })

      const { permissions, roles, token, refreshToken } = response.data;

      setCookie(undefined, "nextauth.token", token, {
        maxAge: 60 * 60 * 24 * 7, // 1 week
        path: "/"
      })

      setCookie(undefined, "nextauth.refreshToken", refreshToken, {
        maxAge: 60 * 60 * 24 * 7, // 1 week
        path: "/"
      }) 

      setUser({ email, permissions, roles });

      Router.push("/dashboard");
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, signIn, user }}>
      {children}
    </AuthContext.Provider>
  );
}
