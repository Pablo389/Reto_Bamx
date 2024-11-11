// app/(app)/_layout.tsx
import { Text } from "react-native";
import { Stack } from "expo-router";
import { useSession } from "../../hooks/ctx";
import { useRouter } from "expo-router";
import { useEffect } from "react";

export default function AppLayout() {
  const { session, isLoading } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !session) {
      router.replace("/sign-in");
    }
  }, [isLoading, session]);

  if (isLoading) {
    return <Text>Loading...</Text>;
  }

  if (!session) {
    return null;
  }

  return <Stack />;
}
