import React, { useState } from "react";
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
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "expo-router";

export default function TransportePage() {
  const navigation = useNavigation();
  const [slots, setSlots] = useState([
    {
      id: 1,
      date: "2023-11-25",
      time: "07:00 - 13:00",
      available: 2,
      location: "https://goo.gl/maps/opqrstuvwx",
    },
    {
      id: 2,
      date: "2023-11-25",
      time: "13:00 - 19:00",
      available: 3,
      location: "https://goo.gl/maps/yzabcdefgh",
    },
    {
      id: 3,
      date: "2023-11-26",
      time: "07:00 - 13:00",
      available: 1,
      location: "https://goo.gl/maps/ijklmnopqr",
    },
    {
      id: 4,
      date: "2023-11-26",
      time: "13:00 - 19:00",
      available: 4,
      location: "https://goo.gl/maps/stuvwxyzab",
    },
  ]);

  const [modalVisible, setModalVisible] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<{
    id: number;
    date: string;
    time: string;
    available: number;
    location: string;
  } | null>(null);

  const handleSignUp = (slot: {
    id: number;
    date: string;
    time: string;
    available: number;
    location: string;
  }) => {
    setSelectedSlot(slot);
    setModalVisible(true);
  };

  const confirmSignUp = () => {
    Alert.alert(
      "Registro Exitoso",
      "Te has registrado para este turno de transporte. Se han enviado instrucciones específicas a tu correo. Gracias por tu ayuda!",
      [{ text: "OK" }]
    );

    if (selectedSlot) {
      setSlots(
        slots.map((s) =>
          s.id === selectedSlot.id ? { ...s, available: s.available - 1 } : s
        )
      );
    }
    setModalVisible(false);
  };

  const openLocation = (url: string) => {
    Linking.openURL(url).catch((err) =>
      console.error("Couldn't load page", err)
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />

      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color="white" />
          <Text style={styles.backText}>Categorías</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.titleContainer}>
        <Text style={styles.title}>Transporte</Text>
        <Text style={styles.subtitle}>
          Ayuda con la logística y transporte en Acapulco
        </Text>
      </View>

      <ScrollView style={styles.slotsContainer}>
        {slots.map((slot) => (
          <View key={slot.id} style={styles.slotCard}>
            <View style={styles.slotInfo}>
              <Text style={styles.slotDate}>{slot.date}</Text>
              <Text style={styles.slotTime}>{slot.time}</Text>
              <Text style={styles.slotAvailable}>
                Espacios disponibles: {slot.available}
              </Text>
              <TouchableOpacity onPress={() => openLocation(slot.location)}>
                <Text style={styles.locationLink}>Ver ubicación</Text>
              </TouchableOpacity>
            </View>
            <TouchableOpacity
              style={[
                styles.signUpButton,
                slot.available === 0 && styles.disabledButton,
              ]}
              onPress={() => handleSignUp(slot)}
              disabled={slot.available === 0}
            >
              <Text style={styles.signUpButtonText}>
                {slot.available === 0 ? "Lleno" : "Inscribirse"}
              </Text>
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>

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
  container: {
    flex: 1,
    backgroundColor: "#8B1818",
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
  slotsContainer: {
    padding: 16,
  },
  slotCard: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  slotInfo: {
    flex: 1,
  },
  slotDate: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  slotTime: {
    color: "white",
    fontSize: 16,
    opacity: 0.8,
  },
  slotAvailable: {
    color: "white",
    fontSize: 14,
    opacity: 0.7,
    marginTop: 4,
  },
  locationLink: {
    color: "white",
    fontSize: 20,
    marginTop: 4,
    textDecorationLine: "underline",
  },
  signUpButton: {
    backgroundColor: "#4CAF50",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    height: 40,
  },
  signUpButtonText: {
    color: "white",
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
