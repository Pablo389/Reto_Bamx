// app/_layout.tsx
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { useEffect, useState } from "react";
import { SessionProvider } from "../hooks/ctx";
import { useColorScheme } from "@/hooks/useColorScheme";
import { Slot, usePathname, useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  const [isLoading, setIsLoading] = useState(true);
  const [hasUserLoggedIn, setHasUserLoggedIn] = useState(false);

  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const checkUserLoggedIn = async () => {
      try {
        const value = await AsyncStorage.getItem("@user_logged_in");
        setHasUserLoggedIn(value === "true");
      } catch (error) {
        console.error(
          "Error al verificar si el usuario ha iniciado sesión:",
          error
        );
      } finally {
        setIsLoading(false);
      }
    };

    checkUserLoggedIn();
  }, [pathname]); // Mantén 'pathname' como dependencia

  useEffect(() => {
    if (loaded && !isLoading) {
      SplashScreen.hideAsync();

      if (
        !hasUserLoggedIn &&
        pathname !== "/onboarding" &&
        pathname !== "/sign-in"
      ) {
        // Permite acceso a '/onboarding' y '/sign-in'
        router.replace("/onboarding");
      }
    }
  }, [loaded, isLoading, hasUserLoggedIn, pathname]);

  if (!loaded || isLoading) {
    return null;
  }

  return (
    <SessionProvider>
      <Slot />
    </SessionProvider>
  );
}
