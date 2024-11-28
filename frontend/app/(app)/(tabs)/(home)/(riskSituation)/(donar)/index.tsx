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
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter, useLocalSearchParams } from "expo-router";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/config/firebaseConfig";

interface Category {
  id: number;
  key: string;
  title: string;
  description: string;
  icon: any;
}

export default function DonarPage() {
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

    const fetchData = async () => {
      try {
        const riskSituationRef = doc(
          db,
          "riskSituations",
          riskSituationId as string
        );
        const docSnap = await getDoc(riskSituationRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          setRiskSituation({ id: docSnap.id, ...data });
        } else {
          console.error("No such riskSituation document!");
        }
      } catch (error) {
        console.error("Error fetching riskSituation:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
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
    donarDinero,
    donarEsenciales,
    donarEmergencia,
    donarEspecie,
    instruccionesDinero,
  } = riskSituation;

  // Build categories array based on data
  const categories: Category[] = [];

  if (donarDinero) {
    categories.push({
      id: 1,
      key: "dinero",
      title: "Dinero",
      description:
        "Donar dinero a organizaciones benéficas y de ayuda humanitaria.",
      icon: "cash-outline",
    });
  }

  if (donarEsenciales) {
    categories.push({
      id: 2,
      key: "esenciales",
      title: "Artículos esenciales",
      description:
        "Donar artículos como alimentos no perecederos, agua embotellada, ropa, mantas.",
      icon: "basket-outline",
    });
  }

  if (donarEmergencia) {
    categories.push({
      id: 3,
      key: "emergencia",
      title: "Artículos de emergencia",
      description:
        "Donar artículos como cobijas, calefacción eléctrica, medicamentos, equipo de emergencia.",
      icon: "bed-outline",
    });
  }

  if (donarEspecie) {
    categories.push({
      id: 4,
      key: "especie",
      title: "Artículos en especie",
      description:
        "Donar artículos como jabón, pañales, calzado, mosquiteros, equipo pesado, generadores.",
      icon: "cube-outline",
    });
  }

  const handleDonation = (category: Category) => {
    if (category.key === "dinero") {
      // Handle dinero donation
      Alert.alert(
        "Donar Dinero",
        instruccionesDinero || "Gracias por tu interés en donar dinero.",
        [{ text: "OK" }]
      );
    } else {
      // Navigate to a specific donation page or show items to donate
      router.push({
        pathname: `(riskSituation)/(donar)/${category.key}`,
        params: { riskSituationId },
      });
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />

      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color="white" />
          <Text style={styles.backText}>Ayuda</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.titleContainer}>
        <Text style={styles.title}>Donar</Text>
        <Text style={styles.subtitle}>
          Selecciona una categoría para donar y ayudar a {nombre}
        </Text>
      </View>

      <ScrollView style={styles.categoriesContainer}>
        {categories.map((category) => (
          <TouchableOpacity
            key={category.id}
            style={styles.categoryCard}
            onPress={() => handleDonation(category)}
          >
            <View style={styles.iconContainer}>
              <Ionicons name={category.icon} size={28} color="white" />
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
    marginBottom: 16,
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
    fontSize: 14,
    opacity: 0.8,
  },
});
