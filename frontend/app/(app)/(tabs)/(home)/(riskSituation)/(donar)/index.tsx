import React from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "expo-router";

export default function DonarPage() {
  const navigation = useNavigation();
  const categories: {
    id: number;
    title: string;
    description: string;
    icon: "cash-outline" | "basket-outline" | "bed-outline" | "cube-outline";
  }[] = [
    {
      id: 1,
      title: "Dinero",
      description:
        "Se puede donar dinero a organizaciones benéficas y de ayuda humanitaria para que puedan brindar asistencia.",
      icon: "cash-outline",
    },
    {
      id: 2,
      title: "Artículos esenciales",
      description:
        "Se pueden donar artículos como alimentos no perecederos, agua embotellada, ropa, mantas, medicamentos y suministros médicos.",
      icon: "basket-outline",
    },
    {
      id: 3,
      title: "Artículos de emergencia",
      description:
        "Se pueden donar artículos como colchones, calefacción eléctrica, o financiar un refugio.",
      icon: "bed-outline",
    },
    {
      id: 4,
      title: "Artículos en especie",
      description:
        "Se pueden donar artículos como jabón, pañales para bebés, calzado, mosquiteros, equipo de ingeniería pesada, generadores, fletes y transporte aéreos.",
      icon: "cube-outline",
    },
  ];

  const handleDonation = (category: {
    id: number;
    title: string;
    description: string;
    icon: string;
  }) => {
    Alert.alert(
      "Gracias por tu interés en donar",
      `Has seleccionado la categoría: ${category.title}. Pronto te redirigiremos a la página de donación correspondiente.`,
      [{ text: "OK" }]
    );
    // Here you would typically navigate to a specific donation page or form
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />

      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color="white" />
          <Text style={styles.backText}>Ayuda</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.titleContainer}>
        <Text style={styles.title}>Donar</Text>
        <Text style={styles.subtitle}>
          Selecciona una categoría para donar y ayudar a Acapulco
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
  container: {
    flex: 1,
    backgroundColor: "#8B1818",
    paddingTop: 20,
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
