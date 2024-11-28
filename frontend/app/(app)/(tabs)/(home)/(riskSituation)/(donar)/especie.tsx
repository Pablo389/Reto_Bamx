import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Linking,
  ActivityIndicator,
  Platform,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter, useLocalSearchParams } from "expo-router";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/config/firebaseConfig";

interface EspecieItem {
  id: string;
  name: string;
  current: number;
  limit: number;
  quantifiable: boolean;
  type: string;
  unit: string;
}

export default function EspeciePage() {
  const router = useRouter();
  const { riskSituationId } = useLocalSearchParams();
  const [especieItems, setEspecieItems] = useState<EspecieItem[]>([]);
  const [riskSituation, setRiskSituation] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!riskSituationId) {
      setError("No riskSituationId provided");
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
          setRiskSituation(data);
          if (data.itemsEspecie && Array.isArray(data.itemsEspecie)) {
            setEspecieItems(data.itemsEspecie);
          } else {
            setEspecieItems([]);
          }
        } else {
          setError("No such riskSituation document!");
        }
      } catch (error) {
        console.error("Error fetching riskSituation:", error);
        setError("Error fetching data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [riskSituationId]);

  const handleOpenLocation = () => {
    if (
      riskSituation &&
      riskSituation.itemsEspecieLocation &&
      riskSituation.itemsEspecieLocation.location
    ) {
      Linking.openURL(riskSituation.itemsEspecieLocation.location).catch(
        (err) => console.error("Couldn't load page", err)
      );
    } else {
      Alert.alert("No location available");
    }
  };

  const renderItem = ({ item }: { item: EspecieItem }) => (
    <View style={styles.itemCard}>
      <LinearGradient
        colors={["rgba(255, 255, 255, 0.1)", "rgba(255, 255, 255, 0.05)"]}
        style={styles.cardGradient}
      >
        <View style={styles.itemInfo}>
          <Text style={styles.itemName}>{item.name}</Text>
          {item.quantifiable ? (
            <View style={styles.quantityContainer}>
              <Text style={styles.itemQuantity}>
                {item.current} / {item.limit} {item.unit}
              </Text>
            </View>
          ) : (
            <Text style={styles.itemQuantity}>Activo</Text>
          )}
          {item.quantifiable && item.limit > 0 && (
            <View style={styles.progressBarContainer}>
              <View
                style={[
                  styles.progressBar,
                  { width: `${(item.current / item.limit) * 100}%` },
                ]}
              />
            </View>
          )}
        </View>
      </LinearGradient>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FFFFFF" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  const locationName =
    riskSituation.itemsEspecieLocation?.name || "Centro de Acopio";
  const locationUrl = riskSituation.itemsEspecieLocation?.location;

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Artículos en Especie</Text>
      </View>

      <View style={styles.infoContainer}>
        <Text style={styles.infoTitle}>
          Estos son los artículos en especie que se necesitan
        </Text>
        {locationUrl && (
          <TouchableOpacity
            onPress={handleOpenLocation}
            style={styles.locationButton}
          >
            <Text style={styles.infoText}>
              Se podrán donar en la siguiente ubicación:
            </Text>
            <View style={styles.locationLink}>
              <Ionicons name="location" size={16} color="#007AFF" />
              <Text style={styles.locationText}>{locationName}</Text>
              <Ionicons name="arrow-forward" size={16} color="#007AFF" />
            </View>
          </TouchableOpacity>
        )}
      </View>

      <FlatList
        data={especieItems}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={
          <Text style={styles.emptyListText}>
            No hay artículos en especie disponibles.
          </Text>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    backgroundColor: "#1A1A1A",
    justifyContent: "center",
    alignItems: "center",
  },
  errorContainer: {
    flex: 1,
    backgroundColor: "#1A1A1A",
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    color: "#FFFFFF",
    fontSize: 18,
    textAlign: "center",
    marginHorizontal: 16,
  },
  container: {
    flex: 1,
    backgroundColor: "#1A1A1A",
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#A00000",
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255, 255, 255, 0.1)",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginLeft: 12,
  },
  infoContainer: {
    padding: 16,
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    marginBottom: 8,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
    marginBottom: 12,
    textAlign: "center",
  },
  infoText: {
    fontSize: 14,
    color: "#CCCCCC",
    marginBottom: 8,
    textAlign: "center",
  },
  locationButton: {
    alignItems: "center",
  },
  locationLink: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(0, 122, 255, 0.1)",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    gap: 8,
  },
  locationText: {
    color: "#007AFF",
    fontSize: 14,
    fontWeight: "600",
  },
  listContainer: {
    padding: 16,
  },
  itemCard: {
    borderRadius: 12,
    marginBottom: 12,
    overflow: "hidden",
  },
  cardGradient: {
    padding: 16,
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 8,
  },
  quantityContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  itemQuantity: {
    fontSize: 16,
    color: "#CCCCCC",
  },
  progressBarContainer: {
    height: 4,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 2,
    marginTop: 8,
    overflow: "hidden",
  },
  progressBar: {
    height: "100%",
    backgroundColor: "#007AFF",
    borderRadius: 2,
  },
  emptyListText: {
    textAlign: "center",
    color: "#FFFFFF",
    fontSize: 16,
    marginTop: 24,
  },
});
