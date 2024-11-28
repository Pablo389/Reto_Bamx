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
  TextInput,
  Modal,
  ScrollView,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { Ionicons } from "@expo/vector-icons";
import { addDoc, collection, onSnapshot } from "firebase/firestore";
import { db } from "@/config/firebaseConfig";
import { useRouter } from "expo-router";


const imageMapper = {
  "actividad1.jpg": require("../../../../assets/images/actividad1.jpg"),
  "actividad2.jpeg": require("../../../../assets/images/actividad2.jpeg"),
  "actividad3.jpeg": require("../../../../assets/images/actividad3.jpeg"),
};

interface Activity {
  id: string;
  title: string;
  location: { name: string; link: string };
  participants: number;
  totalParticipants: number;
  image: keyof typeof imageMapper;
  status: "activo" | "not";
}

export default function AdminActivitiesPage() {
  const [activities, setActivities] = useState<Activity[]>([]); // No initial hardcoded activities
  const [modalVisible, setModalVisible] = useState(false);
  const [showStatusPicker, setShowStatusPicker] = useState(false);
  const [newActivity, setNewActivity] = useState<Partial<Activity>>({
    participants: 0,
    status: "activo",
  });
  const router = useRouter();

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

  const handleSubmit = async () => {
    const activityToAdd: Omit<Activity, "id"> = {
      ...newActivity,
      participants: 0, // Default to 0
    } as Omit<Activity, "id">;

    console.log("New Activity Data:", activityToAdd);
    try {
      await addDoc(collection(db, "activities"), activityToAdd);
      setModalVisible(false);
      setNewActivity({ participants: 0, status: "activo" }); // Reset form
    } catch (error) {
      console.error("Error adding activity:", error);
    }
  };

  const imageMapper = {
    "actividad1.jpg": require("../../../../assets/images/actividad1.jpg"),
    "actividad2.jpeg": require("../../../../assets/images/actividad2.jpeg"),
    "actividad3.jpeg": require("../../../../assets/images/actividad3.jpeg"),
  };

  const renderActivityItem = ({ item }: { item: Activity }) => (
    <TouchableOpacity 
      style={styles.activityItem}
      onPress={() => router.push({
        pathname: "/(admin)/(activities)/details",
        params: { id: item.id }
      })}
    >
      <Image source={imageMapper[item.image]} style={styles.activityImage} />
      <View style={styles.activityDetails}>
        <Text style={styles.activityTitle}>{item.title}</Text>
        <Text style={styles.activityLocation}>{item.location.name}</Text>
        <Text style={styles.activityLocationLink}>{item.location.link}</Text>
        <Text style={styles.activityParticipants}>
          Participantes: {item.participants}/{item.totalParticipants}
        </Text>
        <Text style={styles.activityStatus}>
          Estado: {item.status === "activo" ? "Activo" : "Inactivo"}
        </Text>
      </View>
      <TouchableOpacity style={styles.deleteButton}>
        <Ionicons name="trash-outline" size={24} color="#FF3B30" />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Administrar Actividades</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => setModalVisible(true)}
        >
          <Ionicons name="add" size={24} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
      <FlatList
        data={activities}
        renderItem={renderActivityItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
      />
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <ScrollView>
              <Text style={styles.modalTitle}>Agregar Nueva Actividad</Text>
              <TextInput
                style={styles.input}
                placeholder="Título"
                placeholderTextColor="#999"
                value={newActivity.title}
                onChangeText={(text) =>
                  setNewActivity({ ...newActivity, title: text })
                }
              />
              <TextInput
                style={styles.input}
                placeholder="Nombre de Ubicación"
                placeholderTextColor="#999"
                value={newActivity.location?.name}
                onChangeText={(text) =>
                  setNewActivity({
                    ...newActivity,
                    location: {
                      name: text,
                      link: newActivity.location?.link || "",
                    },
                  })
                }
              />
              <TextInput
                style={styles.input}
                placeholder="Enlace de Google Maps"
                placeholderTextColor="#999"
                value={newActivity.location?.link}
                onChangeText={(text) =>
                  setNewActivity({
                    ...newActivity,
                    location: {
                      name: newActivity.location?.name || "",
                      link: text,
                    },
                  })
                }
              />
              <TextInput
                style={styles.input}
                placeholder="Total de Participantes"
                placeholderTextColor="#999"
                keyboardType="numeric"
                value={newActivity.totalParticipants?.toString()}
                onChangeText={(text) =>
                  setNewActivity({
                    ...newActivity,
                    totalParticipants: parseInt(text, 10),
                  })
                }
              />
              <TextInput
                style={styles.input}
                placeholder="URL de Imagen"
                placeholderTextColor="#999"
                value={newActivity.image}
                onChangeText={(text) =>
                  setNewActivity({
                    ...newActivity,
                    image: text as keyof typeof imageMapper,
                  })
                }
              />
              <View style={styles.pickerContainer}>
                <Text style={styles.pickerLabel}>Estado</Text>
                <TouchableOpacity
                  style={styles.pickerButton}
                  onPress={() => setShowStatusPicker(true)}
                >
                  <Text style={styles.pickerButtonText}>
                    {newActivity.status === 'activo' ? 'Activo' : 'Inactivo'}
                  </Text>
                  <Ionicons name="chevron-down" size={24} color="#666" />
                </TouchableOpacity>
              </View>
              <Modal
                visible={showStatusPicker}
                transparent={true}
                animationType="slide"
                onRequestClose={() => setShowStatusPicker(false)}
              >
                <View style={styles.pickerModalContainer}>
                  <View style={styles.pickerModalContent}>
                    <Text style={styles.pickerModalTitle}>Seleccionar Estado</Text>
                    <TouchableOpacity
                      style={styles.pickerModalOption}
                      onPress={() => {
                        setNewActivity({ ...newActivity, status: 'activo' });
                        setShowStatusPicker(false);
                      }}
                    >
                      <Text style={styles.pickerModalOptionText}>Activo</Text>
                      {newActivity.status === 'activo' && (
                        <Ionicons name="checkmark" size={24} color="#4CAF50" />
                      )}
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.pickerModalOption}
                      onPress={() => {
                        setNewActivity({ ...newActivity, status: 'not' });
                        setShowStatusPicker(false);
                      }}
                    >
                      <Text style={styles.pickerModalOptionText}>Inactivo</Text>
                      {newActivity.status === 'not' && (
                        <Ionicons name="checkmark" size={24} color="#4CAF50" />
                      )}
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.pickerModalCancelButton}
                      onPress={() => setShowStatusPicker(false)}
                    >
                      <Text style={styles.pickerModalCancelText}>Cancelar</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </Modal>
              <View style={styles.modalButtons}>
                <TouchableOpacity
                  style={[styles.button, styles.buttonCancel]}
                  onPress={() => setModalVisible(false)}
                >
                  <Text style={styles.textStyle}>Cancelar</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.button, styles.buttonConfirm]}
                  onPress={handleSubmit}
                >
                  <Text style={styles.textStyle}>Agregar</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1A1A1A",
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
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
  addButton: {
    padding: 8,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: 8,
  },
  listContainer: {
    padding: 16,
  },
  activityItem: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    marginBottom: 16,
    overflow: "hidden",
  },
  activityImage: {
    width: 100,
    height: "100%",
    resizeMode: "cover",
  },
  activityDetails: {
    flex: 1,
    padding: 12,
  },
  activityTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#000000",
  },
  activityLocation: {
    fontSize: 14,
    color: "#666666",
  },
  activityLocationLink: {
    fontSize: 12,
    color: "#0066CC",
    textDecorationLine: "underline",
  },
  activityParticipants: {
    fontSize: 12,
    color: "#999999",
  },
  activityStatus: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#333333",
  },
  deleteButton: {
    padding: 12,
    justifyContent: "center",
  },
  pickerContainer: {
    marginVertical: 10,
    width: "100%",
  },
  pickerLabel: {
    fontSize: 14,
    color: "#000000",
    marginBottom: 8,
  },
  pickerWrapper: {
    backgroundColor: "#EFEFEF",
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "gray",
    overflow: 'hidden',
  },
  picker: {
    height: 40,
    width: "100%",
    backgroundColor: "#EFEFEF",
    color: "#000000",
  },
  pickerButton: {
    backgroundColor: '#EFEFEF',
    borderRadius: 5,
    borderWidth: 1,
    borderColor: 'gray',
    padding: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  pickerButtonText: {
    fontSize: 16,
    color: '#000000',
  },
  pickerModalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  pickerModalContent: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
  },
  pickerModalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000000',
    textAlign: 'center',
    marginBottom: 20,
  },
  pickerModalOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#EFEFEF',
  },
  pickerModalOptionText: {
    fontSize: 18,
    color: '#000000',
  },
  pickerModalCancelButton: {
    marginTop: 20,
    padding: 15,
    backgroundColor: '#FF6347',
    borderRadius: 10,
    alignItems: 'center',
  },
  pickerModalCancelText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalView: {
    width: "90%", // Un poco más ancho para mejor visualización
    maxHeight: "80%", // Evitar que ocupe toda la pantalla
    backgroundColor: "white",
    borderRadius: 20,
    padding: 20,
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
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 12,
    paddingHorizontal: 12,
    width: "100%",
    backgroundColor: "#EFEFEF",
    color: "#000000",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 15,
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 15,
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
