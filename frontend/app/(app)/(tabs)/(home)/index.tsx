// app/(home)/index.tsx
import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "expo-router";
import { StackNavigationProp } from "@react-navigation/stack";

interface Activity {
  id: string;
  title: string;
  location: string;
  participants: string;
  totalParticipants: string;
  image: any;
}

const activities: Activity[] = [
  {
    id: "1",
    title: "Entrega de insumos",
    location: "centro de acopio Tlanepantla",
    participants: "3",
    totalParticipants: "4",
    image: require("../../../../assets/images/actividad1.jpg"),
  },
  {
    id: "2",
    title: "Colecta de víveres",
    location: "centro de acopio Toluca",
    participants: "6",
    totalParticipants: "8",
    image: require("../../../../assets/images/actividad2.jpeg"),
  },
  {
    id: "3",
    title: "Colecta de víveres",
    location: "centro de acopio San Juan de Ocotán",
    participants: "1",
    totalParticipants: "2",
    image: require("../../../../assets/images/actividad3.jpeg"),
  },
  {
    id: "4",
    title: "Entrega de insumos",
    location: "centro de acopio",
    participants: "0",
    totalParticipants: "6",
    image: require("../../../../assets/images/actividad1.jpg"),
  },
];

export default function HomePage() {
  type RootStackParamList = {
    Home: undefined;
    ActivityDetail: { item: Activity };
  };

  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Actividades</Text>
        <Ionicons name="heart" size={24} color="#FF3366" />
      </View>
      <FlatList
        data={activities}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => navigation.navigate("ActivityDetail", { item })}
          >
            <View style={styles.card}>
              <Image source={item.image} style={styles.cardImage} />
              <View style={styles.cardContent}>
                <Text style={styles.cardTitle}>{item.title}</Text>
                <Text style={styles.cardLocation}>
                  Ubicación: {item.location}
                </Text>
                <View style={styles.cardFooter}>
                  <View style={styles.participantContainer}>
                    <Text style={styles.participantText}>
                      {item.participants}/{item.totalParticipants} Participantes
                    </Text>
                  </View>
                  <TouchableOpacity style={styles.applyButton}>
                    <Text style={styles.applyButtonText}>APLICAR</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1A1A1A",
    paddingTop: 50,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingBottom: 10,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    marginHorizontal: 20,
    marginBottom: 15,
    overflow: "hidden",
  },
  cardImage: {
    width: "100%",
    height: 100,
    resizeMode: "cover",
  },
  cardContent: {
    padding: 15,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
  },
  cardLocation: {
    fontSize: 14,
    color: "#666666",
    marginBottom: 10,
  },
  cardFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  participantContainer: {
    backgroundColor: "#E0E0E0",
    borderRadius: 15,
    paddingVertical: 3,
    paddingHorizontal: 10,
  },
  participantText: {
    fontSize: 12,
    color: "#FF3366",
    fontWeight: "bold",
  },
  applyButton: {
    backgroundColor: "#D32F2F",
    borderRadius: 5,
    paddingVertical: 5,
    paddingHorizontal: 15,
  },
  applyButtonText: {
    color: "#FFFFFF",
    fontWeight: "bold",
  },
});
