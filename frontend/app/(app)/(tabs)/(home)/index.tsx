import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Image,
  SafeAreaView,
  Platform,
  StatusBar,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "expo-router";
import { StackNavigationProp } from "@react-navigation/stack";
import { LinearGradient } from "expo-linear-gradient";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "@/config/firebaseConfig";

const imageMapper = {
  "actividad1.jpg": require("../../../../assets/images/actividad1.jpg"),
  "actividad2.jpeg": require("../../../../assets/images/actividad2.jpeg"),
};

interface Activity {
  id: string;
  title: string;
  location: { name: string; link: string };
  participants: number;
  totalParticipants: number;
  image: keyof typeof imageMapper;
  status?: "urgent" | "active" | "full";
}

export default function HomePage() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const isRiskSituation = true;

  type RootStackParamList = {
    Home: undefined;
    ActivityDetail: { item: Activity };
    "(riskSituation)": undefined;
  };

  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

  // Fetch activities from Firestore
  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, "activities"),
      (snapshot) => {
        const fetchedActivities: Activity[] = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...(doc.data() as Omit<Activity, "id">),
        }));
        setActivities(fetchedActivities);
      },
      (error) => {
        console.error("Error fetching activities:", error);
      }
    );

    return () => unsubscribe(); // Cleanup listener
  }, []);

  const getStatusColor = (status?: string) => {
    switch (status) {
      case "urgent":
        return "#FF3B30";
      case "active":
        return "#34C759";
      case "full":
        return "#8E8E93";
      default:
        return "#007AFF";
    }
  };

  const renderActivityCard = ({ item }: { item: Activity }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate("ActivityDetail", { item })}
      activeOpacity={0.9}
    >
      <Image source={imageMapper[item.image]} style={styles.cardImage} />
      <LinearGradient
        colors={["transparent", "rgba(0,0,0,0.8)"]}
        style={styles.cardGradient}
      />
      <View style={styles.cardContent}>
        <View style={styles.cardHeader}>
          <View
            style={[
              styles.statusBadge,
              { backgroundColor: getStatusColor(item.status) },
            ]}
          >
            <Text style={styles.statusText}>
              {item.status === "urgent" ? "¡Urgente!" : "Activo"}
            </Text>
          </View>
        </View>
        <View style={styles.cardFooter}>
          <View>
            <Text style={styles.cardTitle}>{item.title}</Text>
            <Text style={styles.cardLocation}>
              <Ionicons name="location" size={14} color="#FFFFFF" />
              {" " + item.location.name}
            </Text>
          </View>
          <View style={styles.participantInfo}>
            <View style={styles.participantContainer}>
              <Text style={styles.participantText}>
                {item.participants}/{item.totalParticipants}
              </Text>
              <Ionicons name="people" size={16} color="#FFFFFF" />
            </View>
            <TouchableOpacity style={styles.applyButton}>
              <Text style={styles.applyButtonText}>APLICAR</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <FlatList
        ListHeaderComponent={
          <>
            {isRiskSituation && (
              <TouchableOpacity
                style={styles.alertCard}
                onPress={() => navigation.navigate("(riskSituation)")}
                activeOpacity={0.95}
              >
                <View style={styles.alertContent}>
                  <View style={styles.iconContainer}>
                    <Ionicons name="shield" size={32} color="#FFFFFF" />
                  </View>
                  <Text style={styles.alertCardTitle}>¡Ayuda a Acapulco!</Text>
                  <View style={styles.helpButton}>
                    <Text style={styles.helpButtonText}>QUIERO AYUDAR</Text>
                    <Ionicons name="arrow-forward" size={20} color="#A00000" />
                  </View>
                </View>
              </TouchableOpacity>
            )}
            <View style={styles.header}>
              <Text style={styles.headerTitle}>Actividades</Text>
              <TouchableOpacity style={styles.favoriteButton}>
                <Ionicons name="heart" size={24} color="#FF3366" />
              </TouchableOpacity>
            </View>
          </>
        }
        data={activities}
        renderItem={renderActivityCard}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1A1A1A",
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
  listContainer: {
    padding: 16,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  favoriteButton: {
    padding: 8,
    backgroundColor: "rgba(255, 51, 102, 0.1)",
    borderRadius: 12,
  },
  alertCard: {
    backgroundColor: "#A00000",
    borderRadius: 16,
    marginBottom: 24,
    overflow: "hidden",
  },
  alertContent: {
    padding: 24,
    alignItems: "center",
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  alertCardTitle: {
    color: "#FFFFFF",
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "center",
  },
  helpButton: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 24,
    alignItems: "center",
    gap: 8,
  },
  helpButtonText: {
    color: "#A00000",
    fontWeight: "bold",
    fontSize: 16,
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    marginBottom: 16,
    overflow: "hidden",
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  cardImage: {
    width: "100%",
    height: 200,
    resizeMode: "cover",
  },
  cardGradient: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    height: "100%",
  },
  cardContent: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    padding: 16,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "flex-start",
    marginBottom: 8,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  statusText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "bold",
  },
  cardFooter: {
    gap: 12,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 4,
  },
  cardLocation: {
    fontSize: 14,
    color: "#FFFFFF",
    opacity: 0.9,
  },
  participantInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  participantContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  participantText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "500",
  },
  applyButton: {
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  applyButtonText: {
    color: "#A00000",
    fontWeight: "bold",
    fontSize: 14,
  },
});
