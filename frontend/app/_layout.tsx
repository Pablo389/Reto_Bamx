import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack as RouterStack } from "expo-router"; // Use only this Stack
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import "react-native-reanimated";
import { SessionProvider, useSession } from "../hooks/ctx";
import { useColorScheme } from "@/hooks/useColorScheme";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <SessionProvider>
      <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
        <AuthNavigator />
      </ThemeProvider>
    </SessionProvider>
  );
}

function AuthNavigator() {
  const { session, isLoading } = useSession();

  console.log("Session:", session);
  console.log("Is Loading:", isLoading);

  return (
    <RouterStack>
      {session ? (
        <RouterStack.Screen name="(tabs)" options={{ headerShown: false }} />
      ) : (
        <RouterStack.Screen name="sign-in" options={{ headerShown: false }} />
      )}
      <RouterStack.Screen name="+not-found" />
    </RouterStack>
  );
}
