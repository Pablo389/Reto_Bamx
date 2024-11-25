// ctx.tsx
import {
  useContext,
  createContext,
  type PropsWithChildren,
  useState,
} from "react";
import { useStorageState } from "./useStorageState";
import signIn from "@/config/auth";
import { IdTokenResult } from "firebase/auth";
import { Session } from "@/constants/types";

const AuthContext = createContext<{
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => void;
  session?: string | null;
  email?: string | null;
  isLoading: boolean;
}>({
  signIn: async () => {},
  signOut: () => null,
  session: null,
  email: null,
  isLoading: false,
});

export function useSession() {
  const value = useContext(AuthContext);
  if (process.env.NODE_ENV !== "production") {
    if (!value) {
      throw new Error("useSession must be wrapped in a <SessionProvider />");
    }
  }

  return value;
}

export function SessionProvider({ children }: PropsWithChildren) {
  const [[isLoading, session], setSession] = useStorageState("session");
  const [email, setEmail] = useStorageState("email");

  const signInHandler = async (email: string, password: string) => {
    const result = await signIn(email, password);
    if (result.session && result.userSession) {
      const {
        token,
        expirationTime,
        authTime,
        issuedAtTime,
        signInProvider,
        signInSecondFactor,
      }: IdTokenResult = await result.userSession.token;
      setEmail(result.userSession.email);
      setSession(token);
    } else {
      console.error("Sign-in failed:", result.error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        signIn: signInHandler,
        signOut: () => {
          setSession(null);
        },
        session,
        email: email[1],
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
