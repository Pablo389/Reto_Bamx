// app/(home)/_layout.tsx
import { Stack } from "expo-router";

export default function HomeLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" options={{ title: "Home" }} />
      <Stack.Screen
        name="ActivityDetail"
        options={{ title: "Activity Detail" }}
      />
      <Stack.Screen
        name="riskSituation" // Changed to "riskSituation" to match the navigation call
        options={{ title: "Risk Situation" }}
      />
    </Stack>
  );
}
