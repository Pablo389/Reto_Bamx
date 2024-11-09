import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useSession } from "@/hooks/ctx";
import { router } from "expo-router";

export default function SignOutScreen() {
  const { signOut } = useSession();

  const handleSignOut = () => {
    signOut();
    router.replace("/sign-in"); // Redirect to the sign-in page after sign-out
  };

  return (
    <View style={styles.container}>
      <Text style={styles.message}>Are you sure you want to sign out?</Text>

      <TouchableOpacity style={styles.signOutButton} onPress={handleSignOut}>
        <Text style={styles.signOutButtonText}>Sign Out</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
  },
  message: {
    fontSize: 18,
    color: "#333",
    marginBottom: 20,
  },
  signOutButton: {
    backgroundColor: "#D32F2F",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  signOutButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
});
