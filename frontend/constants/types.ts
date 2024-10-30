export type RootStackParamList = {
  "(tabs)": undefined;
  "sign-in": undefined;
  "+not-found": undefined;
  HomePage: undefined;
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
