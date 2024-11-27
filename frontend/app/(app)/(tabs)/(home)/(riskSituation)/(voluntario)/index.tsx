import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  ActivityIndicator,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter, useLocalSearchParams } from "expo-router";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/config/firebaseConfig";

export default function Voluntario() {
  const router = useRouter();
  const { riskSituationId } = useLocalSearchParams();
  const [riskSituation, setRiskSituation] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!riskSituationId) {
      console.error("No riskSituationId provided");
      setLoading(false);
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
      })
      .finally(() => {
        setLoading(false);
      });
  }, [riskSituationId]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FFFFFF" />
      </View>
    );
  }

  if (!riskSituation) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Error loading data.</Text>
      </View>
    );
  }

  const {
    nombre,
    voluntariosBrigadas,
    voluntariosEnfermeria,
    voluntariosTransporte,
  } = riskSituation;

  // Build categories array based on data
  const categories = [];

  if (voluntariosBrigadas && voluntariosBrigadas.maximo > 0) {
    categories.push({
      id: 1,
      title: "Brigadas",
      route: "brigadas",
      description: "Únete a las brigadas de ayuda",
      icon: "people",
    });
  }

  if (voluntariosEnfermeria && voluntariosEnfermeria.maximo > 0) {
    categories.push({
      id: 2,
      title: "Enfermería",
      route: "enfermeria",
      description: "Apoyo médico y cuidados",
      icon: "medical",
    });
  }

  if (voluntariosTransporte && voluntariosTransporte.length > 0) {
    categories.push({
      id: 3,
      title: "Transporte",
      route: "transporte",
      description: "Ayuda a transportar víveres y recursos",
      icon: "car",
    });
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color="white" />
          <Text style={styles.backText}>Ayuda</Text>
        </TouchableOpacity>
      </View>

      {/* Title Section */}
      <View style={styles.titleContainer}>
        <Text style={styles.title}>¡Ayuda a {nombre}!</Text>
        <Text style={styles.subtitle}>
          Selecciona una categoría para ayudar:
        </Text>
      </View>

      {/* Categories */}
      <ScrollView style={styles.categoriesContainer}>
        {categories.map((category) => (
          <TouchableOpacity
            key={category.id}
            style={styles.categoryCard}
            onPress={() =>
              router.push({
                pathname: `/(riskSituation)/(voluntario)/${category.route}`,
                params: { riskSituationId },
              })
            }
          >
            <View style={styles.iconContainer}>
              <Ionicons
                name={category.icon as keyof typeof Ionicons.glyphMap}
                size={28}
                color="white"
              />
            </View>
            <View style={styles.categoryContent}>
              <Text style={styles.categoryTitle}>{category.title}</Text>
              <Text style={styles.categoryDescription}>
                {category.description}
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={24} color="white" />
          </TouchableOpacity>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    backgroundColor: "#8B1818",
    justifyContent: "center",
    alignItems: "center",
  },
  errorContainer: {
    flex: 1,
    backgroundColor: "#8B1818",
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    color: "#FFFFFF",
    fontSize: 18,
  },
  container: {
    flex: 1,
    backgroundColor: "#8B1818",
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
  header: {
    padding: 16,
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
  },
  backText: {
    color: "white",
    fontSize: 18,
    marginLeft: 8,
  },
  titleContainer: {
    padding: 16,
    marginBottom: 16,
  },
  title: {
    color: "white",
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 8,
  },
  subtitle: {
    color: "white",
    fontSize: 18,
    opacity: 0.9,
  },
  categoriesContainer: {
    padding: 16,
  },
  categoryCard: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    flexDirection: "row",
    alignItems: "center",
  },
  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  categoryContent: {
    flex: 1,
  },
  categoryTitle: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 4,
  },
  categoryDescription: {
    color: "white",
    opacity: 0.8,
  },
});
