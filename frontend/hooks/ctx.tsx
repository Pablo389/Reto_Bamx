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
  role?: string | null;
  isLoading: boolean;
}>({
  signIn: async () => {},
  signOut: () => null,
  session: null,
  email: null,
  role: null,
  isLoading: false,
});

// Hook to Access Session
export function useSession() {
  const value = useContext(AuthContext);
  if (process.env.NODE_ENV !== "production") {
    if (!value) {
      throw new Error("useSession must be wrapped in a <SessionProvider />");
    }
  }

  return value;
}

// Session Provider
export function SessionProvider({ children }: PropsWithChildren) {
  const [[isLoading, session], setSession] = useStorageState("session");
  const [email, setEmail] = useStorageState("email");
  const [role, setRole] = useStorageState("role");

  // Sign-In Function
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

      // Save session details
      setEmail(result.userSession.email);
      setSession(token);

      // Save role (e.g., "admin" or "user") from Firestore
      setRole(result.userSession.role); // Ensure `role` is fetched during sign-in
    } else {
      console.error("Sign-in failed:", result.error);
    }
  };

  // Sign-Out Function
  const signOutHandler = () => {
    setSession(null);
    setEmail(null);
    setRole(null); // Clear role
  };

  return (
    <AuthContext.Provider
      value={{
        signIn: signInHandler,
        signOut: signOutHandler,
        session,
        email: email[1],
        role: role[1], // Expose role
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
