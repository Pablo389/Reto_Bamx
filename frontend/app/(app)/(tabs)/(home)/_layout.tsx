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
        name="(riskSituation)"
        options={{ title: "Risk Situation" }}
      />
    </Stack>
  );
}
