import { createContext } from "react";
import { api } from "../services/api";

type Credentials = {
  email: string;
  password: string;
};

type AuthContextData = {
  signIn(credentials: Credentials): Promise<void>;
  isAuthenticated: boolean;
};

type AuthProviderProps = {
  children: React.ReactNode;
};

export const AuthContext = createContext({} as AuthContextData);

export function AuthProvider({ children }: AuthProviderProps) {
  const isAuthenticated = false;

  async function signIn({ email, password }: Credentials) {
    try {
      const response = await api.post("/sessions", {
        email, password
      })

      console.log(response.data);
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, signIn }}>
      {children}
    </AuthContext.Provider>
  );
}
