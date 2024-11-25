import { Stack } from "expo-router";

export default function VoluntarioLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" options={{ title: "Voluntario" }} />
      <Stack.Screen name="brigadas" options={{ title: "Brigadas" }} />
    </Stack>
  );
}
