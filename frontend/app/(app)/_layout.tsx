// app/(app)/_layout.tsx
import { Text } from "react-native";
import { Stack } from "expo-router";
import { useSession } from "../../hooks/ctx";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";

export default function AppLayout() {
  const { session, isLoading, role } = useSession(); // Ensure role is being fetched correctly
  const router = useRouter();
  const [hasNavigated, setHasNavigated] = useState(false); // Prevent multiple navigations
  useEffect(() => {
    if (!isLoading && !session) {
      // Redirect to sign-in if not logged in
      router.replace("/sign-in");
    } else if (!isLoading && session) {
      // Redirect based on role
      if (role === "admin") {
        router.replace("/(admin)");
      } else {
        router.replace("/(tabs)");
      }
    }
  }, [isLoading, session, role, router, hasNavigated]);

  if (isLoading) {
    return <Text>Loading...</Text>; // Optional: Add a loader or splash screen
  }

  if (!session) {
    return null;
  }

  return (
    <Stack
      screenOptions={{
        headerShown: false, // Hide the header entirely
      }}
    />
  );
}
