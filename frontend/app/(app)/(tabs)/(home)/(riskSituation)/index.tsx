import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  SafeAreaView,
  Platform,
  StatusBar,
  ActivityIndicator,
} from "react-native";
import { useRouter, useLocalSearchParams, Href } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/config/firebaseConfig";

export default function RiskSituation() {
  const router = useRouter();
  const { riskSituationId } = useLocalSearchParams();

  const [riskSituation, setRiskSituation] = useState<any>(null);

  useEffect(() => {
    if (!riskSituationId) {
      console.error("No riskSituationId provided");
      return;
    }

    // Fetch riskSituation document
    const riskSituationRef = doc(
      db,
      "riskSituations",
      riskSituationId as string
    );
    getDoc(riskSituationRef)
      .then((docSnap) => {
        if (docSnap.exists()) {
          setRiskSituation({ id: docSnap.id, ...(docSnap.data() as any) });
        } else {
          console.error("No such riskSituation document!");
        }
      })
      .catch((error) => {
        console.error("Error fetching riskSituation:", error);
      });
  }, [riskSituationId]);

  if (!riskSituation) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FFFFFF" />
      </View>
    );
  }

  const { nombre, donar, voluntarios } = riskSituation;

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <View style={styles.content}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Home</Text>
        </View>

        <View style={styles.heroSection}>
          <Text style={styles.title}>¡Ayuda a {nombre}!</Text>
          <Text style={styles.subtitle}>
            Selecciona una categoría para ayudar:
          </Text>
        </View>

        <View style={styles.buttonContainer}>
          {donar && (
            <TouchableOpacity
              style={styles.button}
              onPress={() =>
                router.push({
                  pathname: "/(riskSituation)/(donar)/",
                  params: { riskSituationId: riskSituation.id },
                })
              }
              activeOpacity={0.9}
            >
              <Image
                source={require("../../../../../assets/images/donar.jpeg")}
                style={styles.buttonImage}
              />
              <View style={styles.overlay}>
                <View style={styles.buttonContent}>
                  <Ionicons name="heart-outline" size={24} color="#FFFFFF" />
                  <Text style={styles.buttonText}>Donar</Text>
                  <Text style={styles.buttonSubtext}>
                    Ayuda con víveres y recursos
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          )}

          {voluntarios && (
            <TouchableOpacity
              style={styles.button}
              onPress={() =>
                router.push({
                  pathname: "/(riskSituation)/(voluntario)/",
                  params: { riskSituationId: riskSituation.id },
                })
              }
              activeOpacity={0.9}
            >
              <Image
                source={require("../../../../../assets/images/voluntario.jpeg")}
                style={styles.buttonImage}
              />
              <View style={styles.overlay}>
                <View style={styles.buttonContent}>
                  <Ionicons name="people-outline" size={24} color="#FFFFFF" />
                  <Text style={styles.buttonText}>Voluntario</Text>
                  <Text style={styles.buttonSubtext}>
                    Únete como voluntario
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    backgroundColor: "#891616",
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    flex: 1,
    backgroundColor: "#891616",
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
  },
  backButton: {
    padding: 8,
    marginRight: 8,
    borderRadius: 8,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  heroSection: {
    marginVertical: 24,
    alignItems: "center",
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 12,
    textAlign: "center",
    letterSpacing: 0.5,
  },
  subtitle: {
    fontSize: 16,
    color: "rgba(255, 255, 255, 0.8)",
    textAlign: "center",
    lineHeight: 24,
  },
  buttonContainer: {
    flex: 1,
    gap: 16,
  },
  button: {
    borderRadius: 16,
    overflow: "hidden",
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  buttonImage: {
    width: "100%",
    height: 180,
    resizeMode: "cover",
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.4)",
    justifyContent: "flex-end",
  },
  buttonContent: {
    padding: 20,
    alignItems: "flex-start",
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 24,
    fontWeight: "bold",
    marginVertical: 4,
  },
  buttonSubtext: {
    color: "rgba(255, 255, 255, 0.9)",
    fontSize: 14,
  },
});
