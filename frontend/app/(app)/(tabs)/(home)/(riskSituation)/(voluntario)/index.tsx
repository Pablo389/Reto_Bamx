import React from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "expo-router";
import { StackNavigationProp } from "@react-navigation/stack";

type RootStackParamList = {
  brigadas: undefined;
  enfermeria: undefined;
  transporte: undefined;
};

export default function Voluntario() {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

  const categories: {
    id: number;
    title: string;
    route: keyof RootStackParamList;
    description: string;
    icon: "people" | "medical" | "car";
  }[] = [
    {
      id: 1,
      title: "Brigadas",
      route: "brigadas",
      description: "Únete a las brigadas de ayuda",
      icon: "people",
    },
    {
      id: 2,
      title: "Enfermería",
      route: "enfermeria",
      description: "Apoyo médico y cuidados",
      icon: "medical",
    },
    {
      id: 3,
      title: "Transporte",
      route: "transporte",
      description: "Ayuda a transportar víveres y recursos",
      icon: "car",
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color="white" />
          <Text style={styles.backText}>Home</Text>
        </TouchableOpacity>
      </View>

      {/* Title Section */}
      <View style={styles.titleContainer}>
        <Text style={styles.title}>¡Ayuda a Acapulco!</Text>
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
            onPress={() => navigation.navigate(category.route)} // Navigate using route name
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
    backgroundColor: "#8B1818", // Dark red background matching the image
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
