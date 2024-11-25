import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  Modal,
} from "react-native";
import { Calendar, ChevronDown } from "lucide-react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import {
  collection,
  query,
  where,
  getDocs,
  updateDoc,
  doc,
  getDoc,
} from "firebase/firestore";
import { auth, db } from "../../../config/firebaseConfig";
import { router } from "expo-router";
import { useSession } from "@/hooks/ctx";

export default function UserProfileScreen() {
  const { session, signOut } = useSession();
  const { email } = useSession();
  console.log(email);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    birthday: new Date(),
    gender: "",
    address: "",
  });
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [genderModalVisible, setGenderModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [docId, setDocId] = useState(null); // Para almacenar el ID del documento

  useEffect(() => {
    const fetchUserData = async () => {
      if (!email) {
        console.error("El email es undefined");
        Alert.alert("Error", "No se pudo obtener el email del usuario");
        return;
      }

      try {
        const usersRef = collection(db, "users");
        const q = query(usersRef, where("email", "==", email));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
          const userDoc = querySnapshot.docs[0];
          const userData = userDoc.data();
          setDocId(userDoc.id); // Guardar el ID del documento para futuras actualizaciones

          setFormData({
            name: userData.name || "",
            phone: userData.phone || "",
            birthday: userData.birthday
              ? new Date(userData.birthday)
              : new Date(),
            gender: userData.gender || "",
            address: userData.address || "",
          });
        } else {
          Alert.alert("Error", "No se encontraron datos del usuario");
        }
      } catch (error) {
        console.error("Error al obtener datos del usuario:", error);
        Alert.alert("Error", "No se pudieron cargar los datos del usuario");
      }
    };

    if (session) {
      console.log("Usuario autenticado:", email);
      fetchUserData();
    } else {
      Alert.alert("Error", "Usuario no autenticado");
      router.replace("/sign-in");
    }
  }, [session]);

  const handleDateChange = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setFormData((prev) => ({ ...prev, birthday: selectedDate }));
    }
  };

  console.log(formData)

  const formatDate = (date) => {
    return date.toLocaleDateString("es-ES", {
      day: "2-digit",
      month: "2-digit",
      year: "2-digit",
    });
  };

  const handleGenderSelect = (gender) => {
    setFormData((prev) => ({ ...prev, gender }));
    setGenderModalVisible(false);
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    // Revertir cambios y desactivar modo edición
    if (session) {
      // fetchUserData(email);
    }
    setIsEditing(false);
  };

  const handleSave = async () => {
    if (!docId) {
      Alert.alert("Error", "No se pudo identificar el documento del usuario");
      return;
    }

    setLoading(true);
    try {
      await updateDoc(doc(db, "users", docId), {
        name: formData.name,
        phone: formData.phone,
        birthday: formData.birthday.toISOString(),
        gender: formData.gender,
        address: formData.address,
        updatedAt: new Date().toISOString(),
      });

      Alert.alert("Éxito", "Perfil actualizado correctamente");
      setIsEditing(false);
    } catch (error) {
      console.error("Error al actualizar:", error);
      Alert.alert("Error", "No se pudo actualizar el perfil");
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = () => {
    signOut();
    router.replace("/sign-in");
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Perfil</Text>
        <Text style={styles.infoText}>
          Nota: El correo electrónico y la contraseña no se pueden modificar
          aquí.
        </Text>
      </View>

      <View style={styles.form}>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Nombre</Text>
          <TextInput
            style={styles.input}
            placeholder="Nombre"
            value={formData.name}  // Establece el valor del campo "name" en el input
            onChangeText={(text) =>
              setFormData((prev) => ({ ...prev, name: text }))
            }
            editable={isEditing}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Teléfono</Text>
          <View style={styles.phoneContainer}>
            <TextInput
              style={styles.countryCode}
              value="+52"
              editable={false}
            />
            <TextInput
              style={styles.phoneInput}
              placeholder="(331) 538-4179"
              keyboardType="phone-pad"
              value={formData.phone}  // Establece el valor del campo "phone" en el input
              onChangeText={(text) =>
                setFormData((prev) => ({ ...prev, phone: text }))
              }
              editable={isEditing}
            />
          </View>
        </View>

        <View style={styles.row}>
          <View style={[styles.inputGroup, styles.halfWidth]}>
            <Text style={styles.label}>Género</Text>
            <TouchableOpacity
              style={styles.genderInput}
              onPress={() => isEditing && setGenderModalVisible(true)}
              disabled={!isEditing}
            >
              <Text style={styles.genderText}>
                {formData.gender || "Seleccionar"}
              </Text>
              {isEditing && <ChevronDown size={20} color="#666" />}
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Dirección</Text>
          <TextInput
            style={styles.input}
            placeholder="Dirección"
            value={formData.address}  // Establece el valor del campo "address" en el input
            onChangeText={(text) =>
              setFormData((prev) => ({ ...prev, address: text }))
            }
            editable={isEditing}
         />
        </View>
        {isEditing ? (
          <>
            <TouchableOpacity
              style={[styles.saveButton, loading && styles.disabledButton]}
              onPress={handleSave}
              disabled={loading}
            >
              <Text style={styles.saveButtonText}>
                {loading ? "Guardando..." : "Guardar Cambios"}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={handleCancel}
              disabled={loading}
            >
              <Text style={styles.cancelButtonText}>Cancelar</Text>
            </TouchableOpacity>
          </>
        ) : (
          <TouchableOpacity style={styles.editButton} onPress={handleEdit}>
            <Text style={styles.editButtonText}>Editar Perfil</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity style={styles.signOutButton} onPress={handleSignOut}>
          <Text style={styles.signOutButtonText}>Cerrar Sesión</Text>
        </TouchableOpacity>
      </View>

      {/* Modal para seleccionar género */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={genderModalVisible}
        onRequestClose={() => setGenderModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <TouchableOpacity onPress={() => handleGenderSelect("Hombre")}>
              <Text style={styles.modalOption}>Hombre</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleGenderSelect("Mujer")}>
              <Text style={styles.modalOption}>Mujer</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleGenderSelect("Otro")}>
              <Text style={styles.modalOption}>Otro</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setGenderModalVisible(false)}>
              <Text style={styles.modalCancel}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {showDatePicker && (
        <DateTimePicker
          value={formData.birthday}
          mode="date"
          display="default"
          onChange={handleDateChange}
        />
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  // Tus estilos existentes
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  header: {
    padding: 20,
    backgroundColor: "#ffffff",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
  },
  infoText: {
    fontSize: 14,
    color: "#666",
    marginTop: 8,
    textAlign: "center",
  },
  form: {
    padding: 20,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 8,
    color: "#000",
  },
  input: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: "#666",
    borderColor: "#f5f5f5",
    borderWidth: 1,
  },
  phoneContainer: {
    flexDirection: "row",
    gap: 12,
  },
  countryCode: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: "#666",
    width: 80,
    textAlign: "center",
    borderColor: "#f5f5f5",
    borderWidth: 1,
  },
  phoneInput: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: "#666",
    flex: 1,
    borderColor: "#f5f5f5",
    borderWidth: 1,
  },
  row: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 20,
  },
  halfWidth: {
    flex: 1,
    marginBottom: 0,
  },
  dateInput: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderColor: "#f5f5f5",
    borderWidth: 1,
  },
  dateText: {
    fontSize: 16,
    color: "#666",
  },
  genderInput: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderColor: "#f5f5f5",
    borderWidth: 1,
  },
  genderText: {
    fontSize: 16,
    color: "#666",
  },
  editButton: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    marginTop: 20,
    borderColor: "#B33E3E",
    borderWidth: 1,
  },
  editButtonText: {
    color: "#666",
    fontSize: 16,
    fontWeight: "600",
  },
  saveButton: {
    backgroundColor: "#4CAF50",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    marginTop: 20,
  },
  saveButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  cancelButton: {
    backgroundColor: "#B33E3E",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    marginTop: 10,
  },
  cancelButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  disabledButton: {
    opacity: 0.7,
  },
  signOutButton: {
    backgroundColor: "#D32F2F",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    marginTop: 20,
  },
  signOutButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  // Estilos para el modal
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
    width: "80%",
    alignItems: "center",
  },
  modalOption: {
    fontSize: 18,
    paddingVertical: 10,
    textAlign: "center",
  },
  modalCancel: {
    fontSize: 18,
    paddingVertical: 10,
    textAlign: "center",
    color: "#B33E3E",
  },
});
