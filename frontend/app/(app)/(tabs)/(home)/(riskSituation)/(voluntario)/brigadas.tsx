import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Alert,
  Linking,
  Modal,
  ActivityIndicator,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter, useLocalSearchParams } from "expo-router";
import { doc, getDoc, updateDoc, increment } from "firebase/firestore";
import { db } from "@/config/firebaseConfig";
import { useSession } from "@/hooks/ctx";

export default function BrigadasPage() {
  const router = useRouter();
  const { riskSituationId } = useLocalSearchParams();
  const { id: userId } = useSession();

  const [brigadeInfo, setBrigadeInfo] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [riskSituation, setRiskSituation] = useState<any>(null);

  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    if (!riskSituationId) {
      console.error("No riskSituationId provided");
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        // Fetch riskSituation document
        const riskSituationRef = doc(
          db,
          "riskSituations",
          riskSituationId as string
        );
        const docSnap = await getDoc(riskSituationRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          setRiskSituation({ id: docSnap.id, ...data });

          // Extract voluntariosBrigadas data
          const voluntariosBrigadas = data.voluntariosBrigadas;
          if (voluntariosBrigadas) {
            setBrigadeInfo(voluntariosBrigadas);
          } else {
            setBrigadeInfo(null);
          }
        } else {
          console.error("No such riskSituation document!");
        }
      } catch (error) {
        console.error("Error fetching riskSituation:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [riskSituationId]);

  const handleSignUp = () => {
    setModalVisible(true);
  };

  const confirmSignUp = async () => {
    if (!brigadeInfo || !riskSituationId || !userId) {
      setModalVisible(false);
      return;
    }

    try {
      const riskSituationRef = doc(
        db,
        "riskSituations",
        riskSituationId as string
      );

      // Check if there is still capacity
      if (brigadeInfo.registrados >= brigadeInfo.maximo) {
        Alert.alert(
          "Registro fallido",
          "Lo sentimos, ya no hay cupo disponible."
        );
        setModalVisible(false);
        return;
      }

      // Increment registrados in Firestore
      await updateDoc(riskSituationRef, {
        "voluntariosBrigadas.registrados": increment(1),
      });

      // Optionally, add user to a list of participants
      // e.g., create a subcollection 'voluntariosBrigadasParticipants' and add userId

      // Update local state
      setBrigadeInfo((prev: any) => ({
        ...prev,
        registrados: prev.registrados + 1,
      }));

      Alert.alert(
        "Registro Exitoso",
        "Te has registrado para esta brigada. Se han enviado instrucciones específicas a tu correo. ¡Gracias por tu ayuda!",
        [{ text: "OK" }]
      );
    } catch (error) {
      console.error("Error updating registrados:", error);
      Alert.alert(
        "Error",
        "Ocurrió un error al registrarte. Por favor, intenta de nuevo."
      );
    } finally {
      setModalVisible(false);
    }
  };

  const openLocation = (url: string) => {
    Linking.openURL(url).catch((err) =>
      console.error("Couldn't load page", err)
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FFFFFF" />
      </View>
    );
  }

  if (!riskSituation || !brigadeInfo) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Error loading data.</Text>
      </View>
    );
  }

  const availableSlots = brigadeInfo.maximo - brigadeInfo.registrados;

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />

      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color="white" />
          <Text style={styles.backText}>Categorías</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.titleContainer}>
        <Text style={styles.title}>Brigadas</Text>
        <Text style={styles.subtitle}>
          Únete a la brigada para ayudar en {riskSituation.nombre}
        </Text>
      </View>

      <View style={styles.slotCard}>
        <View style={styles.slotInfo}>
          <Text style={styles.slotAvailable}>
            Espacios disponibles: {availableSlots}
          </Text>
          <TouchableOpacity onPress={() => openLocation(brigadeInfo.location)}>
            <Text style={styles.locationLink}>Ver ubicación</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity
          style={[
            styles.signUpButton,
            availableSlots === 0 && styles.disabledButton,
          ]}
          onPress={handleSignUp}
          disabled={availableSlots === 0}
        >
          <Text style={styles.signUpButtonText}>
            {availableSlots === 0 ? "Lleno" : "Inscribirse"}
          </Text>
        </TouchableOpacity>
      </View>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>
              ¿Estás seguro de inscribirte a esta actividad? Si aceptas, deberás
              atender a la ubicación indicada para confirmar tu participación.
              Instrucciones específicas se enviarán a tu correo.
            </Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.button, styles.buttonCancel]}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.textStyle}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, styles.buttonConfirm]}
                onPress={confirmSignUp}
              >
                <Text style={styles.textStyle}>Confirmar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    backgroundColor: "#8B1818",
    justifyContent: "center",
    alignItems: "center",
  },
  errorContainer: {
    flex: 1,
    backgroundColor: "#8B1818",
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    color: "#FFFFFF",
    fontSize: 18,
  },
  container: {
    flex: 1,
    backgroundColor: "#8B1818",
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
  header: {
    padding: 16,
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
  },
  backText: {
    color: "white",
    fontSize: 18,
    marginLeft: 8,
  },
  titleContainer: {
    padding: 16,
    marginBottom: 16,
  },
  title: {
    color: "white",
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 8,
  },
  subtitle: {
    color: "white",
    fontSize: 18,
    opacity: 0.9,
  },
  slotCard: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  slotInfo: {
    flex: 1,
  },
  slotAvailable: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
  },
  locationLink: {
    color: "white",
    fontSize: 16,
    textDecorationLine: "underline",
  },
  signUpButton: {
    backgroundColor: "white",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    height: 40,
    justifyContent: "center",
  },
  signUpButtonText: {
    color: "black",
    fontWeight: "bold",
  },
  disabledButton: {
    backgroundColor: "#888",
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
    color: "#000",
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
    minWidth: 100,
  },
  buttonCancel: {
    backgroundColor: "#FF6347",
  },
  buttonConfirm: {
    backgroundColor: "#4CAF50",
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
});
