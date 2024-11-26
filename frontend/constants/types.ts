import { IdTokenResult } from "@firebase/auth-types";

export type RootStackParamList = {
  "(tabs)": undefined;
  "sign-in": undefined;
  "+not-found": undefined;
  "(home)": undefined;
  ActivityDetail: { item: Activity }; // Example for additional screens
};

export interface Activity {
  id: string;
  title: string;
  location: string;
  participants: string;
  totalParticipants: string;
  image: any;
}

export type Session = {
  name: string | null;
  email: string | null;
  id: string;
  token: Promise<IdTokenResult>;
  role: string;
};
