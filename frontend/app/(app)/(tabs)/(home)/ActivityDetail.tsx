import React from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  Platform,
  StatusBar,
  Animated,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRoute, useNavigation } from "@react-navigation/native";
import { RouteProp } from "@react-navigation/native";
import { RootStackParamList } from "../../../../constants/types";
import { LinearGradient } from "expo-linear-gradient";
import { useSession } from "@/hooks/ctx";

type ActivityDetailRouteProp = RouteProp<RootStackParamList, "ActivityDetail">;

export default function ActivityDetailScreen() {
  const route = useRoute<ActivityDetailRouteProp>();
  const navigation = useNavigation();
  const { item } = route.params;
  const scrollY = new Animated.Value(0);
  const { id } = useSession();

  const headerOpacity = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [0, 1],
    extrapolate: "clamp",
  });

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* Animated Header Background */}
      <Animated.View
        style={[styles.headerBackground, { opacity: headerOpacity }]}
      />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Animated.Text style={[styles.headerTitle, { opacity: headerOpacity }]}>
          {item.title}
        </Animated.Text>
      </View>

      <Animated.ScrollView
        contentContainerStyle={styles.scrollContent}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: true }
        )}
        scrollEventThrottle={16}
      >
        <View style={styles.heroSection}>
          <Image source={item.image} style={styles.heroImage} />
          <LinearGradient
            colors={["transparent", "rgba(26, 26, 26, 0.8)", "#1A1A1A"]}
            style={styles.heroGradient}
          />
          <View style={styles.heroContent}>
            <View style={styles.tagContainer}>
              <View style={styles.tag}>
                <Ionicons name="time-outline" size={16} color="#FFFFFF" />
                <Text style={styles.tagText}>Urgente</Text>
              </View>
            </View>
            <Text style={styles.heroTitle}>{item.title}</Text>
          </View>
        </View>

        <View style={styles.content}>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Descripción</Text>
            <Text style={styles.description}>
              Transporte de insumos al banco de comida para asegurar
              distribución eficiente y oportuna de alimentos a quienes más lo
              necesitan.
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Detalles</Text>
            <View style={styles.detailsCard}>
              <View style={styles.detailRow}>
                <View style={styles.detailItem}>
                  <Ionicons name="location-outline" size={20} color="#666666" />
                  <View>
                    <Text style={styles.detailLabel}>Ubicación</Text>
                    <Text style={styles.detailValue}>{item.location.name}</Text>
                  </View>
                </View>
                <View style={styles.detailItem}>
                  <Ionicons name="people-outline" size={20} color="#666666" />
                  <View>
                    <Text style={styles.detailLabel}>Beneficiados</Text>
                    <Text style={styles.detailValue}>55 personas</Text>
                  </View>
                </View>
              </View>
            </View>
          </View>

          <View style={styles.statsSection}>
            <View style={styles.statCard}>
              <View style={styles.statHeader}>
                <Text style={styles.statTitle}>Participantes</Text>
                <View style={styles.statBadge}>
                  <Text style={styles.statBadgeText}>Espacios disponibles</Text>
                </View>
              </View>
              <View style={styles.statContent}>
                <Text style={styles.statNumber}>
                  {item.participants}/{item.totalParticipants}
                </Text>
                <View style={styles.progressBar}>
                  <View
                    style={[
                      styles.progressFill,
                      {
                        width: `${
                          (parseInt(item.participants) /
                            parseInt(item.totalParticipants)) *
                          100
                        }%`,
                      },
                    ]}
                  />
                </View>
              </View>
            </View>
          </View>
        </View>
      </Animated.ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.likeButton}>
          <Ionicons name="heart-outline" size={24} color="#D32F2F" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.applyButton} activeOpacity={0.8}>
          <Text style={styles.applyButtonText}>APLICAR AHORA</Text>
          <Ionicons name="arrow-forward" size={20} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1A1A1A",
  },
  headerBackground: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 100,
    backgroundColor: "#1A1A1A",
    zIndex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 2,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#FFFFFF",
    marginLeft: 12,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  heroSection: {
    height: 400,
    position: "relative",
  },
  heroImage: {
    width: "100%",
    height: "100%",
  },
  heroGradient: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 200,
  },
  heroContent: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
  },
  tagContainer: {
    flexDirection: "row",
    marginBottom: 8,
  },
  tag: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#D32F2F",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 4,
  },
  tagText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "600",
  },
  heroTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  content: {
    padding: 20,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#FFFFFF",
    marginBottom: 12,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    color: "#CCCCCC",
  },
  detailsCard: {
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderRadius: 16,
    padding: 16,
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  detailItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  detailLabel: {
    fontSize: 12,
    color: "#999999",
    marginBottom: 4,
  },
  detailValue: {
    fontSize: 14,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  statsSection: {
    gap: 16,
  },
  statCard: {
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderRadius: 16,
    padding: 16,
  },
  statHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  statTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  statBadge: {
    backgroundColor: "#D32F2F",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  timeBadge: {
    backgroundColor: "#2196F3",
  },
  statBadgeText: {
    fontSize: 12,
    color: "#FFFFFF",
  },
  statContent: {
    gap: 8,
  },
  statNumber: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#D32F2F",
  },
  timeNumber: {
    color: "#2196F3",
  },
  progressBar: {
    height: 4,
    backgroundColor: "rgba(211, 47, 47, 0.2)",
    borderRadius: 2,
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#D32F2F",
    borderRadius: 2,
  },
  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    gap: 12,
    padding: 16,
    backgroundColor: "#1A1A1A",
    borderTopWidth: 1,
    borderTopColor: "rgba(255, 255, 255, 0.1)",
  },
  likeButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: "#D32F2F",
    alignItems: "center",
    justifyContent: "center",
  },
  applyButton: {
    flex: 1,
    height: 48,
    backgroundColor: "#D32F2F",
    borderRadius: 24,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  applyButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
});
