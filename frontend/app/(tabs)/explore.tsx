import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
} from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";

export default function RouteScreen() {
  const steps = [
    { id: "1", address: "Av. Parque Santillana" },
    { id: "2", address: "Av. 5 de mayo" },
  ];

  return (
    <View style={styles.container}>
      {/* Map Section */}
      <View style={styles.mapContainer}>
        <View style={styles.map}>
          {/* Placeholder for the map */}
          <MaterialCommunityIcons name="car" size={32} color="#FFFFFF" />
          <View style={styles.calculatingRoute}>
            <Text style={styles.calculatingRouteText}>Calculando ruta</Text>
          </View>
        </View>
      </View>

      {/* Route Information */}
      <View style={styles.routeInfo}>
        <Text style={styles.timeDistanceText}>25 min (15 km)</Text>
        <Text style={styles.routeDetailText}>
          Ruta óptima por condiciones de tráfico
        </Text>
      </View>

      {/* Steps List */}
      <View style={styles.stepsContainer}>
        <FlatList
          data={steps}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.stepItem}>
              <Ionicons name="location-outline" size={20} color="#FFFFFF" />
              <Text style={styles.stepText}>{item.address}</Text>
            </View>
          )}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1A1A1A",
  },
  mapContainer: {
    height: "45%",
    backgroundColor: "#2B2B2B",
    justifyContent: "center",
    alignItems: "center",
  },
  map: {
    width: "90%",
    height: "100%",
    backgroundColor: "#333333",
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
  },
  calculatingRoute: {
    position: "absolute",
    top: "10%",
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
  },
  calculatingRouteText: {
    color: "#FFFFFF",
    fontWeight: "bold",
  },
  routeInfo: {
    backgroundColor: "#333333",
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  timeDistanceText: {
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "bold",
  },
  routeDetailText: {
    color: "#AAAAAA",
    fontSize: 14,
    marginTop: 5,
  },
  stepsContainer: {
    backgroundColor: "#1A1A1A",
    paddingHorizontal: 20,
    paddingVertical: 10,
    flex: 1,
  },
  stepItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#333333",
  },
  stepText: {
    color: "#FFFFFF",
    fontSize: 16,
    marginLeft: 10,
  },
  bottomNav: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    backgroundColor: "#333333",
    paddingVertical: 15,
  },
});
