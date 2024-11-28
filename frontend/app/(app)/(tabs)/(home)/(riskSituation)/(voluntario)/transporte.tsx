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

interface TransporteTask {
  id: string;
  pointA: string;
  pointB: string;
  requiredPeople: number;
  currentPeople: number;
}

export default function TransportePage() {
  const router = useRouter();
  const { riskSituationId } = useLocalSearchParams();
  const { id: userId } = useSession();
  const [tasks, setTasks] = useState<TransporteTask[]>([]);
  const [riskSituation, setRiskSituation] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const [modalVisible, setModalVisible] = useState(false);
  const [selectedTask, setSelectedTask] = useState<TransporteTask | null>(null);

  useEffect(() => {
    if (!riskSituationId) {
      console.error("No riskSituationId provided");
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
          if (
            data.voluntariosTransporte &&
            Array.isArray(data.voluntariosTransporte)
          ) {
            setTasks(data.voluntariosTransporte);
          } else {
            setTasks([]);
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

  const handleSignUp = (task: TransporteTask) => {
    setSelectedTask(task);
    setModalVisible(true);
  };

  const confirmSignUp = async () => {
    if (!selectedTask || !riskSituationId || !userId) {
      setModalVisible(false);
      return;
    }

    try {
      const riskSituationRef = doc(
        db,
        "riskSituations",
        riskSituationId as string
      );

      // Find the index of the selected task
      const taskIndex = tasks.findIndex((t) => t.id === selectedTask.id);

      if (taskIndex === -1) {
        throw new Error("Task not found");
      }

      const taskPath = `voluntariosTransporte.${taskIndex}.currentPeople`;
      await updateDoc(riskSituationRef, {
        [taskPath]: increment(1),
      });

      // Update local state
      setTasks((prevTasks) =>
        prevTasks.map((t) =>
          t.id === selectedTask.id
            ? { ...t, currentPeople: t.currentPeople + 1 }
            : t
        )
      );

      Alert.alert(
        "Registro Exitoso",
        "Te has registrado para esta actividad de transporte. Se han enviado instrucciones específicas a tu correo. ¡Gracias por tu ayuda!",
        [{ text: "OK" }]
      );
    } catch (error) {
      console.error("Error updating task:", error);
      Alert.alert(
        "Error",
        "Ocurrió un error al registrarte. Por favor, intenta de nuevo."
      );
    } finally {
      setModalVisible(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FFFFFF" />
      </View>
    );
  }

  if (!riskSituation) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Error loading data.</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color="white" />
          <Text style={styles.backText}>Categorías</Text>
        </TouchableOpacity>
      </View>

      {/* Title Section */}
      <View style={styles.titleContainer}>
        <Text style={styles.title}>Transporte</Text>
        <Text style={styles.subtitle}>
          Ayuda con la logística y transporte en {riskSituation.nombre}
        </Text>
      </View>

      {/* Transportation Tasks */}
      <ScrollView style={styles.tasksContainer}>
        {tasks.map((task) => {
          const available = task.requiredPeople - task.currentPeople;

          return (
            <View key={task.id} style={styles.taskCard}>
              <View style={styles.taskInfo}>
                <Text style={styles.taskPoints}>
                  De: {task.pointA} {"\n"}A: {task.pointB}
                </Text>

                <Text style={styles.taskAvailable}>
                  Espacios disponibles: {available}
                </Text>
              </View>
              <TouchableOpacity
                style={[
                  styles.signUpButton,
                  available === 0 && styles.disabledButton,
                ]}
                onPress={() => handleSignUp(task)}
                disabled={available === 0}
              >
                <Text style={styles.signUpButtonText}>
                  {available === 0 ? "Lleno" : "Inscribirse"}
                </Text>
              </TouchableOpacity>
            </View>
          );
        })}
      </ScrollView>

      {/* Sign-Up Confirmation Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>
              ¿Estás seguro de inscribirte a esta actividad de transporte? Si
              aceptas, deberás atender a la ubicación indicada para confirmar tu
              participación. Instrucciones específicas se enviarán a tu correo.
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
  tasksContainer: {
    padding: 16,
  },
  taskCard: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  taskInfo: {
    flex: 1,
  },
  taskPoints: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
  },
  taskAvailable: {
    color: "white",
    fontSize: 14,
    opacity: 0.7,
    marginTop: 4,
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
