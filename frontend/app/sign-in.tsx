import React from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { FontAwesome } from "@expo/vector-icons";
import { useSession } from "@/hooks/ctx";
import { router } from "expo-router";
import { useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function LoginScreen() {
  const { signIn } = useSession();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    console.log("Email:", email, "password:", password);
    signIn(email, password)
      .then(async () => {
        try {
          await AsyncStorage.setItem("@user_logged_in", "true");
          console.log("Estado de inicio de sesión guardado");
        } catch (error) {
          console.error("Error al guardar el estado de inicio de sesión:", error);
        }
        router.replace("/");
      })
      .catch((error) => {
        console.error("Failed to sign in:", error);
      });
  };

  return (
    <View style={styles.container}>
      {/* Logo */}
      <Image
        source={require("../assets/images/logo.png")}
        style={styles.logo}
      />

      {/* Title */}
      <Text style={styles.title}>Sign in</Text>

      {/* Email Input */}
      <View style={styles.inputContainer}>
        <Ionicons
          name="mail-outline"
          size={20}
          color="#808080"
          style={styles.icon}
        />
        <TextInput
          placeholder="Email"
          placeholderTextColor="#808080"
          style={styles.input}
          onChangeText={(text) => setEmail(text)}
        />
      </View>

      {/* Password Input */}
      <View style={styles.inputContainer}>
        <Ionicons
          name="lock-closed-outline"
          size={20}
          color="#808080"
          style={styles.icon}
        />
        <TextInput
          placeholder="Contraseña"
          placeholderTextColor="#808080"
          secureTextEntry
          style={styles.input}
          onChangeText={(text) => setPassword(text)}
        />
      </View>

      {/* Forgot Password */}
      <TouchableOpacity>
        <Text style={styles.forgotPassword}>Olvidé mi contraseña</Text>
      </TouchableOpacity>

      {/* Login Button */}
      <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
        <Text style={styles.loginButtonText}>Login</Text>
      </TouchableOpacity>

      {/* Divider */}
      <View style={styles.divider}>
        <View style={styles.line} />
        <Text style={styles.dividerText}>Continuar con</Text>
        <View style={styles.line} />
      </View>

      {/* Sign in with Apple */}
      <TouchableOpacity style={styles.socialButton}>
        <FontAwesome name="apple" size={24} color="black" />
        <Text style={styles.socialButtonText}>Sign in with Apple</Text>
      </TouchableOpacity>

      {/* Sign in with Google */}
      <TouchableOpacity style={styles.socialButton}>
        <FontAwesome name="google" size={24} color="#4285F4" />
        <Text style={styles.socialButtonText}>Sign in with Google</Text>
      </TouchableOpacity>

      {/* Register */}
      <View style={styles.registerContainer}>
        <Text style={styles.registerText}>Eres nuevo?</Text>
        <TouchableOpacity onPress={() => router.push('/register')}>
          <Text style={styles.registerLink}> Regístrate</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
    backgroundColor: "#FFFFFF",
  },
  logo: {
    width: 120,
    height: 120,
    alignSelf: "center",
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F0F0F0",
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 10,
    marginBottom: 10,
  },
  icon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: "#333333",
  },
  forgotPassword: {
    textAlign: "right",
    color: "#808080",
    fontSize: 14,
    marginBottom: 20,
  },
  loginButton: {
    backgroundColor: "#D32F2F",
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: "center",
    marginBottom: 20,
  },
  loginButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  divider: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 20,
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: "#D0D0D0",
  },
  dividerText: {
    marginHorizontal: 10,
    color: "#808080",
  },
  socialButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F0F0F0",
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  socialButtonText: {
    marginLeft: 10,
    fontSize: 16,
  },
  registerContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 20,
  },
  registerText: {
    color: "#808080",
  },
  registerLink: {
    color: "#D32F2F",
    fontWeight: "bold",
  },
});
