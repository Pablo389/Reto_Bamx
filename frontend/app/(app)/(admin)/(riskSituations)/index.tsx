import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  SafeAreaView,
  Platform,
  StatusBar,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "expo-router";

interface AdminAction {
  id: string;
  title: string;
  description: string;
  icon: "clipboard" | "alert-circle" | "add-circle";
  route: string;
}

const adminActions: AdminAction[] = [
  {
    id: "1",
    title: "Manage Activities",
    description: "Create, edit, or delete volunteer activities.",
    icon: "clipboard",
    route: "manageActivities", // Adjust route as needed
  },
  {
    id: "2",
    title: "Manage Risk Situations",
    description: "Create and manage risk situations.",
    icon: "alert-circle",
    route: "manageRiskSituations", // Adjust route as needed
  },
  {
    id: "3",
    title: "Add New Resources",
    description: "Add resources, announcements, or news.",
    icon: "add-circle",
    route: "addResources", // Adjust route as needed
  },
];

export default function AdminHomePage() {
  const navigation = useNavigation();

  const renderAdminAction = ({ item }: { item: AdminAction }) => (
    <TouchableOpacity
      style={styles.card}
      //   onPress={() => navigation.navigate(item.route)}
      activeOpacity={0.9}
    >
      <View style={styles.cardIcon}>
        <Ionicons name={item.icon} size={28} color="white" />
      </View>
      <View style={styles.cardContent}>
        <Text style={styles.cardTitle}>{item.title}</Text>
        <Text style={styles.cardDescription}>{item.description}</Text>
      </View>
      <Ionicons name="chevron-forward" size={24} color="white" />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <FlatList
        ListHeaderComponent={
          <>
            <View style={styles.header}>
              <Text style={styles.headerTitle}>Admin Dashboard</Text>
            </View>
            <View style={styles.subtitleContainer}>
              <Text style={styles.subtitle}>
                Manage activities, risk situations, and resources efficiently.
              </Text>
            </View>
          </>
        }
        data={adminActions}
        renderItem={renderAdminAction}
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
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#FFFFFF",
    textAlign: "center",
  },
  subtitleContainer: {
    marginBottom: 24,
    paddingHorizontal: 16,
  },
  subtitle: {
    fontSize: 16,
    color: "#CCCCCC",
    textAlign: "center",
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#333333",
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  cardIcon: {
    backgroundColor: "#D32F2F",
    borderRadius: 12,
    width: 50,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  cardContent: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  cardDescription: {
    fontSize: 14,
    color: "#BBBBBB",
    marginTop: 4,
  },
});
