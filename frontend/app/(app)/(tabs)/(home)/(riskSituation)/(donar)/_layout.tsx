import { Stack } from "expo-router";

export default function DonarLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" options={{ title: "Donar" }} />
      <Stack.Screen name="especie" options={{ title: "Especie" }} />
      <Stack.Screen name="emergencia" options={{ title: "Emergencia" }} />
      <Stack.Screen name="esenciales" options={{ title: "Esenciales" }} />
    </Stack>
  );
}
