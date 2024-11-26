import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  FlatList,
} from "react-native";
import { Href, useNavigation } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useSession } from "@/hooks/ctx";
import { router } from "expo-router";

type AdminAction = {
  id: string;
  title: string;
  description: string;
  icon: "clipboard" | "alert-circle" | "add-circle";
  route: string;
};

export default function AdminDashboard() {
  const navigation = useNavigation();
  const { session, signOut } = useSession();

  const handleSignOut = () => {
    signOut();
    router.replace("/sign-in");
  };

  const actions: AdminAction[] = [
    {
      id: "1",
      title: "Gestionar Actividades",
      description: "Crear, editar o eliminar actividades para voluntarios.",
      icon: "clipboard",
      route: "/(activities)", // Change to match your routing structure
    },
    {
      id: "2",
      title: "Gestionar Situaciones de Riesgo",
      description: "Crear y gestionar situaciones de riesgo.",
      icon: "alert-circle",
      route: "/(riskSituations)", // Change to match your routing structure
    },
    {
      id: "3",
      title: "Agregar Nuevos Recursos",
      description: "Agregar nuevos recursos o anuncios.",
      icon: "add-circle",
      route: "/(addResources)", // Change to match your routing structure
    },
  ];

  const renderAction = ({ item }: { item: AdminAction }) => (
    <TouchableOpacity
      key={item.id}
      style={styles.card}
      onPress={() => router.push(item.route as Href)}
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
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Panel de Administración</Text>
        <TouchableOpacity onPress={handleSignOut}>
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
      </View>

      <FlatList
        data={actions}
        keyExtractor={(item) => item.id}
        renderItem={renderAction}
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
    paddingTop: StatusBar.currentHeight,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  listContainer: {
    padding: 16,
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#333333",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    elevation: 4,
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
