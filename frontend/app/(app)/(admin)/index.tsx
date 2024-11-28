import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  FlatList,
} from "react-native";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { db } from "@/config/firebaseConfig";
import { useSession } from "@/hooks/ctx";

interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  gender: string;
  role: string;
  birthday: string;
  createdAt: string;
  updatedAt: string;
}

export default function AdminDashboard() {
  const [users, setUsers] = useState<User[]>([]);
  const { signOut } = useSession();
  
  useEffect(() => {
    // Query para obtener usuarios que no sean admin
    const q = query(
      collection(db, "users"),
      where("role", "==", "user")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedUsers = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as User));
      setUsers(fetchedUsers);
    });

    return () => unsubscribe();
  }, []);

  const handleSignOut = () => {
    signOut();
    router.replace("/sign-in");
  };

  const renderUserItem = ({ item }: { item: User }) => (
    <View style={styles.userCard}>
      <View style={styles.userIcon}>
        <Ionicons name="person" size={24} color="#FFF" />
      </View>
      <View style={styles.userInfo}>
        <Text style={styles.userName}>{item.name}</Text>
        <Text style={styles.userEmail}>{item.email}</Text>
        <View style={styles.userDetails}>
          <View style={styles.detailItem}>
            <Ionicons name="call-outline" size={16} color="#999" />
            <Text style={styles.detailText}>{item.phone}</Text>
          </View>
          <View style={styles.detailItem}>
            <Ionicons name="location-outline" size={16} color="#999" />
            <Text style={styles.detailText}>{item.address}</Text>
          </View>
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Usuarios Registrados</Text>
        <TouchableOpacity 
          style={styles.signOutButton}
          onPress={handleSignOut}
        >
          <Ionicons name="log-out-outline" size={24} color="#FFF" />
        </TouchableOpacity>
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{users.length}</Text>
          <Text style={styles.statLabel}>Total Usuarios</Text>
        </View>
        {/* Puedes agregar más stats aquí */}
      </View>

      <FlatList
        data={users}
        renderItem={renderUserItem}
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
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#A00000",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  signOutButton: {
    padding: 8,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: 8,
  },
  statsContainer: {
    flexDirection: "row",
    padding: 16,
    gap: 16,
  },
  statCard: {
    flex: 1,
    backgroundColor: "#333",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
  },
  statNumber: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#FFF",
  },
  statLabel: {
    fontSize: 14,
    color: "#999",
    marginTop: 4,
  },
  listContainer: {
    padding: 16,
  },
  userCard: {
    flexDirection: "row",
    backgroundColor: "#333",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  userIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#A00000",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#FFF",
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    color: "#999",
    marginBottom: 8,
  },
  userDetails: {
    gap: 4,
  },
  detailItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  detailText: {
    fontSize: 14,
    color: "#999",
  },
});