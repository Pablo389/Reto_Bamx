import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Alert,
  Image,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "expo-router";
import {
  collection,
  onSnapshot,
  doc,
  getDoc,
  deleteDoc,
  updateDoc,
  increment,
  query,
  where,
  getDocs,
  writeBatch,
} from "firebase/firestore";
import { db } from "@/config/firebaseConfig";
import { useSession } from "@/hooks/ctx";
import { LinearGradient } from "expo-linear-gradient";

const imageMapper = {
  "actividad1.jpg": require("../../../assets/images/actividad1.jpg"),
  "actividad2.jpeg": require("../../../assets/images/actividad2.jpeg"),
  "actividad3.jpeg": require("../../../assets/images/actividad3.jpeg"),
};

interface Activity {
  id: string;
  title: string;
  location: { name: string; link: string } | string;
  date?: string;
  time?: string;
  participants?: number;
  totalParticipants?: number;
  image?: keyof typeof imageMapper;
  status?:
    | "urgent"
    | "activo"
    | "full"
    | "upcoming"
    | "in-progress"
    | "completed";
}

export default function MyActivitiesPage() {
  const navigation = useNavigation();
  const { id: userId } = useSession();
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) return;

    // Listener for user's registered activities
    const registeredActivitiesRef = collection(
      db,
      "users",
      userId,
      "registeredActivities"
    );

    const unsubscribe = onSnapshot(
      registeredActivitiesRef,
      (snapshot) => {
        const activityPromises = snapshot.docs.map(async (docSnap) => {
          const data = docSnap.data();
          const activityId = data.activityId.id; // assuming activityId is a reference
          const activityRef = doc(db, "activities", activityId);
          const activitySnap = await getDoc(activityRef);
          if (activitySnap.exists()) {
            const activityData = activitySnap.data() as Omit<Activity, "id">;
            return {
              id: activityId,
              ...activityData,
            } as Activity;
          } else {
            return null;
          }
        });

        Promise.all(activityPromises).then((activitiesData) => {
          // Filter out nulls
          const validActivities = activitiesData.filter(
            (activity) => activity !== null
          ) as Activity[];
          setActivities(validActivities);
          setLoading(false);
        });
      },
      (error) => {
        console.error("Error fetching registered activities:", error);
        setLoading(false);
      }
    );

    return () => {
      unsubscribe();
    };
  }, [userId]);

  const getStatusColor = (status?: string) => {
    switch (status) {
      case "urgent":
      case "upcoming":
        return "#FF3B30";
      case "activo":
      case "in-progress":
        return "#34C759";
      case "full":
      case "completed":
        return "#8E8E93";
      default:
        return "#007AFF";
    }
  };

  const getStatusText = (status?: string) => {
    switch (status) {
      case "urgent":
        return "¡Urgente!";
      case "activo":
        return "Activo";
      case "full":
        return "Lleno";
      case "upcoming":
        return "Próxima";
      case "in-progress":
        return "En progreso";
      case "completed":
        return "Completada";
      default:
        return "Desconocido";
    }
  };

  const handleCancelParticipation = (activityId: string) => {
    Alert.alert(
      "Cancelar participación",
      "¿Estás seguro de que deseas cancelar tu participación en esta actividad?",
      [
        {
          text: "No",
          style: "cancel",
        },
        {
          text: "Sí",
          onPress: async () => {
            if (!userId) return;

            try {
              // 1. Remove from user's registeredActivities
              const userActivitiesRef = collection(
                db,
                "users",
                userId,
                "registeredActivities"
              );
              const userActivityQuery = query(
                userActivitiesRef,
                where("activityId", "==", doc(db, "activities", activityId))
              );
              const userActivityDocs = await getDocs(userActivityQuery);
              const batch = writeBatch(db);

              userActivityDocs.forEach((docSnap) => {
                batch.delete(docSnap.ref);
              });

              // 2. Remove from activity's users
              const activityUsersRef = collection(
                db,
                "activities",
                activityId,
                "users"
              );
              const activityUserQuery = query(
                activityUsersRef,
                where("userId", "==", userId)
              );
              const activityUserDocs = await getDocs(activityUserQuery);
              activityUserDocs.forEach((docSnap) => {
                batch.delete(docSnap.ref);
              });

              // 3. Decrement participantes in activity
              const activityRef = doc(db, "activities", activityId);
              batch.update(activityRef, {
                participants: increment(-1),
              });

              // Commit the batch
              await batch.commit();

              // Update local state
              setActivities((prevActivities) =>
                prevActivities.filter((activity) => activity.id !== activityId)
              );

              Alert.alert(
                "Participación cancelada",
                "Has sido removido de esta actividad."
              );
            } catch (error) {
              console.error("Error canceling participation:", error);
              Alert.alert(
                "Error",
                "Ocurrió un error al cancelar tu participación."
              );
            }
          },
        },
      ]
    );
  };

  const renderActivityItem = ({ item }: { item: Activity }) => (
    <TouchableOpacity
      style={styles.card}
      //   onPress={() => navigation.navigate("ActivityDetail", { item })}
      activeOpacity={0.9}
    >
      {item.image && (
        <Image source={imageMapper[item.image]} style={styles.cardImage} />
      )}
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
            <Text style={styles.statusText}>{getStatusText(item.status)}</Text>
          </View>
          <TouchableOpacity onPress={() => handleCancelParticipation(item.id)}>
            <Ionicons name="close-circle-outline" size={24} color="#FF3B30" />
          </TouchableOpacity>
        </View>
        <View style={styles.cardFooter}>
          <Text style={styles.cardTitle}>{item.title}</Text>
          {typeof item.location === "string" ? (
            <Text style={styles.cardLocation}>
              <Ionicons name="location" size={14} color="#FFFFFF" />
              {" " + item.location}
            </Text>
          ) : (
            <Text style={styles.cardLocation}>
              <Ionicons name="location" size={14} color="#FFFFFF" />
              {" " + item.location.name}
            </Text>
          )}
          {item.date && (
            <Text style={styles.cardInfo}>
              <Ionicons name="calendar" size={14} color="#FFFFFF" />
              {" " + item.date}
            </Text>
          )}
          {item.time && (
            <Text style={styles.cardInfo}>
              <Ionicons name="time" size={14} color="#FFFFFF" />
              {" " + item.time}
            </Text>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FFFFFF" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Mis Actividades</Text>
      </View>
      <FlatList
        data={activities}
        renderItem={renderActivityItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={
          <Text style={styles.emptyListText}>
            No tienes actividades registradas.
          </Text>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1A1A1A",
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: "#1A1A1A",
    justifyContent: "center",
    alignItems: "center",
  },
  listContainer: {
    padding: 16,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: 30,
    padding: 16,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#FFFFFF",
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
    justifyContent: "space-between",
    alignItems: "center",
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
    gap: 8,
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
  cardInfo: {
    fontSize: 14,
    color: "#FFFFFF",
    opacity: 0.9,
  },
  emptyListText: {
    textAlign: "center",
    color: "#FFFFFF",
    fontSize: 16,
    marginTop: 24,
  },
});
