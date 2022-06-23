import { createContext } from "react";

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
    console.log(email, password);
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, signIn }}>
      {children}
    </AuthContext.Provider>
  );
}
