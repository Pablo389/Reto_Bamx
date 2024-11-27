import React, { useState } from "react";
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
import { ArrowLeft, Calendar, ChevronDown } from "lucide-react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { setDoc, doc } from "firebase/firestore";
import { auth, db } from "../config/firebaseConfig";
import { router } from "expo-router";
import { useSession } from "@/hooks/ctx";
import AsyncStorage from "@react-native-async-storage/async-storage";
import CustomDatePicker from "@/components/CustomDatePicker";

export default function RegisterForm() {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    password: "",
    birthday: new Date(),
    gender: "",
    address: "",
  });
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showGenderModal, setShowGenderModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const { signIn } = useSession();
  const [showCustomDatePicker, setShowCustomDatePicker] = useState(false);

  const handleDateChange = (event: any, selectedDate?: Date | undefined): void => {
    setShowDatePicker(false);
    if (selectedDate) {
      setFormData((prev) => ({ ...prev, birthday: selectedDate }));
    }
  };

  const handleCustomDateConfirm = (date: Date) => {
    setShowCustomDatePicker(false);
    setFormData((prev) => ({ ...prev, birthday: date }));
  };

  interface FormData {
    name: string;
    phone: string;
    email: string;
    password: string;
    birthday: Date;
    gender: string;
    address: string;
  }

  const formatDate = (date: Date): string => {
    return date.toLocaleDateString("es-ES", {
      day: "2-digit",
      month: "2-digit",
      year: "2-digit",
    });
  };

  const validateForm = () => {
    if (
      !formData.name ||
      !formData.email ||
      !formData.password ||
      !formData.phone
    ) {
      Alert.alert("Error", "Por favor, rellena todos los campos obligatorios.");
      return false;
    }
    if (formData.password.length < 6) {
      Alert.alert("Error", "La contraseña debe tener al menos 6 caracteres.");
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );
      const user = userCredential.user;

      await setDoc(doc(db, "users", user.uid), {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        birthday: formData.birthday,
        gender: formData.gender,
        address: formData.address,
        createdAt: new Date(),
        role: "user",
      });

      Alert.alert("Éxito", "Usuario registrado correctamente");
      console.log("Email:", formData.email, "password:", formData.password);
      signIn(formData.email, formData.password)
        .then(async () => {
          try {
            await AsyncStorage.setItem("@user_logged_in", "true");
          } catch (error) {
            console.error(
              "Error al guardar el estado de inicio de sesión:",
              error
            );
          }
          router.replace("/");
        })
        .catch((error) => {
          console.error("Failed to sign up:", error);
        });
    } catch (error) {
      console.error("Error al registrar:", error);
      Alert.alert("Error", (error as any).message);
    } finally {
      setLoading(false);
    }
  };

  const handleGenderSelect = (selectedGender: string) => {
    setFormData((prev) => ({ ...prev, gender: selectedGender }));
    setShowGenderModal(false);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <ArrowLeft size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.title}>Sign Up</Text>
      </View>

      <View style={styles.form}>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Nombre</Text>
          <TextInput
            style={styles.input}
            placeholder="Ingresa tu nombre"
            value={formData.name}
            onChangeText={(text) =>
              setFormData((prev) => ({ ...prev, name: text }))
            }
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
              value={formData.phone}
              onChangeText={(text) =>
                setFormData((prev) => ({ ...prev, phone: text }))
              }
            />
          </View>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            placeholder="nombre@ejemplo.com"
            keyboardType="email-address"
            autoCapitalize="none"
            value={formData.email}
            onChangeText={(text) =>
              setFormData((prev) => ({ ...prev, email: text }))
            }
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Contraseña</Text>
          <TextInput
            style={styles.input}
            placeholder="************"
            secureTextEntry
            value={formData.password}
            onChangeText={(text) =>
              setFormData((prev) => ({ ...prev, password: text }))
            }
          />
        </View>

        <View style={styles.row}>
          <View style={[styles.inputGroup, styles.halfWidth]}>
            <Text style={styles.label}>Cumpleaños</Text>
            <TouchableOpacity
              style={styles.dateInput}
              onPress={() => setShowCustomDatePicker(true)}
            >
              <Text style={styles.dateText}>
                {formatDate(formData.birthday)}
              </Text>
              <Calendar size={20} color="#666" />
            </TouchableOpacity>
          </View>

          <View style={[styles.inputGroup, styles.halfWidth]}>
            <Text style={styles.label}>Género</Text>
            <TouchableOpacity
              style={styles.genderInput}
              onPress={() => setShowGenderModal(true)}
            >
              <Text style={styles.genderText}>
                {formData.gender || "Seleccionar"}
              </Text>
              <ChevronDown size={20} color="#666" />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Dirección</Text>
          <TextInput
            style={styles.input}
            placeholder="4202 Glencrest St"
            value={formData.address}
            onChangeText={(text) =>
              setFormData((prev) => ({ ...prev, address: text }))
            }
          />
        </View>

        <TouchableOpacity
          style={[styles.submitButton, loading && styles.disabledButton]}
          onPress={handleSubmit}
          disabled={loading}
        >
          <Text style={styles.submitButtonText}>
            {loading ? "Registrando..." : "Registrarse"}
          </Text>
        </TouchableOpacity>
        <View style={styles.loginPrompt}>
          <Text style={styles.loginPromptText}>
            ¿Ya estás registrado?{" "}
            <Text style={styles.loginLink} onPress={() => router.back()}>
              Inicia sesión
            </Text>
          </Text>
        </View>
      </View>

      <CustomDatePicker
        isVisible={showCustomDatePicker}
        date={formData.birthday}
        onConfirm={handleCustomDateConfirm}
        onCancel={() => setShowCustomDatePicker(false)}
      />

      <Modal
        visible={showGenderModal}
        transparent={true}
        animationType="slide"
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <TouchableOpacity
              style={styles.modalOption}
              onPress={() => handleGenderSelect("Hombre")}
            >
              <Text>Hombre</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.modalOption}
              onPress={() => handleGenderSelect("Mujer")}
            >
              <Text>Mujer</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.modalOption}
              onPress={() => setShowGenderModal(false)}
            >
              <Text style={styles.cancelText}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#ffffff",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginLeft: 16,
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
  submitButton: {
    backgroundColor: "#B33E3E",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    marginTop: 20,
  },
  submitButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  disabledButton: {
    opacity: 0.7,
  },
  loginPrompt: {
    marginTop: 20,
    alignItems: "center",
  },
  loginPromptText: {
    fontSize: 14,
    color: "#666",
  },
  loginLink: {
    color: "#B33E3E",
    fontWeight: "600",
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
  },
  modalOption: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  cancelText: {
    color: 'red',
    textAlign: 'center',
  },
});
