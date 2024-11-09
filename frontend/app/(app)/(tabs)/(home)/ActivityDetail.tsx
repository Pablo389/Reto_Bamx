import React from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRoute, useNavigation } from "@react-navigation/native";
import { RouteProp } from "@react-navigation/native";
import { RootStackParamList } from "../../../../constants/types";

type ActivityDetailRouteProp = RouteProp<RootStackParamList, "ActivityDetail">;

export default function ActivityDetailScreen() {
  const route = useRoute<ActivityDetailRouteProp>();
  const navigation = useNavigation();
  const { item } = route.params;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Ionicons
          name="arrow-back"
          size={24}
          color="#FFFFFF"
          onPress={() => navigation.goBack()}
        />
        <Text style={styles.headerTitle}>{item.title}</Text>
      </View>

      {/* Make content scrollable */}
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.card}>
          <Image source={item.image} style={styles.cardImage} />
          <Text style={styles.description}>
            Transporte de insumos al banco de comida para asegurar distribución
            eficiente y oportuna de alimentos a quienes más lo necesitan.
          </Text>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Ubicación</Text>
            <Text style={styles.detailValue}>{item.location}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Beneficiados</Text>
            <Text style={styles.detailValue}>55 personas</Text>
          </View>
          <View style={styles.participantRow}>
            <View style={styles.participantCircle}>
              <Text style={styles.participantCount}>
                {item.participants}/{item.totalParticipants}
              </Text>
              <Text style={styles.participantLabel}>Participantes</Text>
            </View>
            <View style={styles.delayCircle}>
              <Text style={styles.delayCount}>6</Text>
              <Text style={styles.delayLabel}>Tiempo de desvío</Text>
            </View>
          </View>
          <View style={styles.buttonRow}>
            <TouchableOpacity style={styles.likeButton}>
              <Ionicons name="heart-outline" size={24} color="#D32F2F" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.applyButton}>
              <Text style={styles.applyButtonText}>APLICAR</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1A1A1A",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#1A1A1A",
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginLeft: 10,
  },
  scrollContent: {
    paddingBottom: 20, // Optional padding to ensure all content is visible
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    margin: 20,
    padding: 15,
  },
  cardImage: {
    width: "100%",
    height: 200,
    borderRadius: 10,
  },
  description: {
    fontSize: 14,
    color: "#666666",
    marginVertical: 15,
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 5,
  },
  detailLabel: {
    fontSize: 14,
    color: "#666666",
  },
  detailValue: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#333333",
  },
  participantRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginVertical: 15,
  },
  participantCircle: {
    alignItems: "center",
  },
  delayCircle: {
    alignItems: "center",
  },
  participantCount: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#D32F2F",
  },
  participantLabel: {
    fontSize: 12,
    color: "#666666",
  },
  delayCount: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#D32F2F",
  },
  delayLabel: {
    fontSize: 12,
    color: "#666666",
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  likeButton: {
    borderWidth: 1,
    borderColor: "#D32F2F",
    borderRadius: 8,
    padding: 10,
  },
  applyButton: {
    backgroundColor: "#D32F2F",
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  applyButtonText: {
    color: "#FFFFFF",
    fontWeight: "bold",
  },
});
