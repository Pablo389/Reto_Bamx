import { Stack } from "expo-router";

export default function DonarLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" options={{ title: "Donar" }} />
    </Stack>
  );
}
