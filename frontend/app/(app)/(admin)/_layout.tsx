import { Tabs } from "expo-router";
import React from "react";
import { TabBarIcon } from "@/components/navigation/TabBarIcon";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import { useSession } from "@/hooks/ctx";

export default function AdminLayout() {
  const colorScheme = useColorScheme();
  const { session, role, isLoading } = useSession();

  if (isLoading) {
    return null; // Optionally, render a loader here if needed
  }

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
        headerShown: false,
      }}
    >
      {/* Home Tab */}
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon
              name={focused ? "home" : "home-outline"}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="(activities)"
        options={{
          title: "Actividades",
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon
              name={focused ? "checkmark-done" : "checkmark-done-outline"}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="(riskSituations)"
        options={{
          title: "Situaciones de Riesgo",
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon
              name={focused ? "alert-circle" : "alert-circle-outline"}
              color={color}
            />
          ),
        }}
      />
    </Tabs>
  );
}
