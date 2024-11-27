import { Stack } from "expo-router";

export default function VoluntarioLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" options={{ title: "Voluntario" }} />
      <Stack.Screen name="brigadas" options={{ title: "Brigadas" }} />
      <Stack.Screen name="enfermeria" options={{ title: "Enfermeria" }} />
      <Stack.Screen name="transporte" options={{ title: "Transporte" }} />
    </Stack>
  );
}
