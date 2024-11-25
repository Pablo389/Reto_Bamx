import { Stack } from "expo-router";

export default function RiskSituationLayout() {
  return (
    <Stack screenOptions={{ headerShown: true }}>
      <Stack.Screen name="index" options={{ title: "Risk Situation" }} />
      <Stack.Screen name="(donar)" options={{ title: "Donar" }} />
      <Stack.Screen name="(voluntario)" options={{ title: "Voluntario" }} />
    </Stack>
  );
}
