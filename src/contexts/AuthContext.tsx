import Router from "next/router";
import { destroyCookie, parseCookies, setCookie } from "nookies";
import { createContext, useEffect, useState } from "react";

import { api } from "../services/api";

type User = {
  email: string;
  permissions: string[];
  roles: string[];
};

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

export function signOut() {
  // "desloga" o usuário e o redireciona para a página de login
  destroyCookie(null, "nextauth.token");
  destroyCookie(null, "nextauth.refreshToken");

  Router.push("/");
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User>({} as User);
  const isAuthenticated = !!user;

  // carrega as informações do usuário toda vez que ele acessar a página
  useEffect(() => {
    const { "nextauth.token": token } = parseCookies();

    if (token) {
      // o usuário está logado
      api
        .get("/me")
        .then((response) => {
          const { email, permissions, roles } = response.data;

          setUser({ email, permissions, roles }); // atualiza o estado do usuário
        })
        .catch(() => {
          signOut();
        });
    }
  }, []);

  async function signIn({ email, password }: Credentials) {
    try {
      const response = await api.post("/sessions", {
        email,
        password,
      });

      const { permissions, roles, token, refreshToken } = response.data;

      setCookie(null, "nextauth.token", token, {
        maxAge: 60 * 60 * 24 * 7, // 1 week
        path: "/",
      });

      setCookie(null, "nextauth.refreshToken", refreshToken, {
        maxAge: 60 * 60 * 24 * 7, // 1 week
        path: "/",
      });

      setUser({ email, permissions, roles });

      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      Router.push("/dashboard");
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, signIn, user }}>
      {children}
    </AuthContext.Provider>
  );
}
