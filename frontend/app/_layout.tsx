import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { useEffect, useState } from "react";
import { SessionProvider } from "@/hooks/ctx";
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
  const [userRole, setUserRole] = useState<string | null>(null);
  const pathname = usePathname();
  const router = useRouter();

  console.log("Pathname:", pathname);

  useEffect(() => {
    const checkUserLoggedIn = async () => {
      try {
        const loggedIn = await AsyncStorage.getItem("@user_logged_in");
        setHasUserLoggedIn(loggedIn === "true");
        // setUserRole(role);
      } catch (error) {
        console.error("Error verifying user session or role:", error);
      } finally {
        setIsLoading(false);
      }
    };

    checkUserLoggedIn();
  }, []); // Run only once on mount

  useEffect(() => {
    if (loaded && !isLoading) {
      SplashScreen.hideAsync();

      if (
        !hasUserLoggedIn &&
        pathname !== "/onboarding" &&
        pathname !== "/sign-in"
      ) {
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
