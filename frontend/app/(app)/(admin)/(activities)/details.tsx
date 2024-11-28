import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  Platform,
  StatusBar,
  Image,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Picker } from "@react-native-picker/picker";
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '@/config/firebaseConfig';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from "@expo/vector-icons";

interface Activity {
  id: string;
  title: string;
  location: { name: string; link: string };
  participants: number;
  totalParticipants: number;
  image: string;
  status: "activo" | "not";
}

const imageMapper = {
  "actividad1.jpg": require("../../../../assets/images/actividad1.jpg"),
  "actividad2.jpeg": require("../../../../assets/images/actividad2.jpeg"),
  "actividad3.jpeg": require("../../../../assets/images/actividad3.jpeg"),
};

export default function ActivityDetailsScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const [isEditing, setIsEditing] = useState(false);
  const [activity, setActivity] = useState<Activity | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchActivity = async () => {
      if (typeof id !== 'string') return;
      
      try {
        const docRef = doc(db, 'activities', id);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          setActivity({ id: docSnap.id, ...docSnap.data() } as Activity);
        } else {
          Alert.alert('Error', 'No se encontró la actividad');
          router.back();
        }
      } catch (error) {
        console.error('Error fetching activity:', error);
        Alert.alert('Error', 'No se pudo cargar la actividad');
      } finally {
        setLoading(false);
      }
    };

    fetchActivity();
  }, [id]);

  const handleSave = async () => {
    if (!activity) return;

    try {
      const docRef = doc(db, 'activities', activity.id);
      await updateDoc(docRef, {
        title: activity.title,
        location: activity.location,
        totalParticipants: activity.totalParticipants,
        image: activity.image,
        status: activity.status,
      });

      Alert.alert('Éxito', 'Actividad actualizada correctamente');
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating activity:', error);
      Alert.alert('Error', 'No se pudo actualizar la actividad');
    }
  };

  if (loading || !activity) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Cargando...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color="#FFF" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>
            {isEditing ? 'Editar' : 'Ver'} Actividad
          </Text>
          <TouchableOpacity
            style={styles.editButton}
            onPress={() => isEditing ? handleSave() : setIsEditing(true)}
          >
            <Text style={styles.editButtonText}>
              {isEditing ? 'Guardar' : 'Editar'}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.content}>
          <Image 
            source={imageMapper[activity.image as keyof typeof imageMapper]} 
            style={styles.activityImage}
          />

          <View style={styles.formGroup}>
            <Text style={styles.label}>Título</Text>
            {isEditing ? (
              <TextInput
                style={styles.input}
                value={activity.title}
                onChangeText={(text) => setActivity({ ...activity, title: text })}
                placeholder="Título de la actividad"
                placeholderTextColor="#666"
              />
            ) : (
              <Text style={styles.value}>{activity.title}</Text>
            )}
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Ubicación</Text>
            {isEditing ? (
              <>
                <TextInput
                  style={styles.input}
                  value={activity.location.name}
                  onChangeText={(text) => 
                    setActivity({ 
                      ...activity, 
                      location: { ...activity.location, name: text } 
                    })
                  }
                  placeholder="Nombre de la ubicación"
                  placeholderTextColor="#666"
                />
                <TextInput
                  style={styles.input}
                  value={activity.location.link}
                  onChangeText={(text) => 
                    setActivity({ 
                      ...activity, 
                      location: { ...activity.location, link: text } 
                    })
                  }
                  placeholder="Link de Google Maps"
                  placeholderTextColor="#666"
                />
              </>
            ) : (
              <>
                <Text style={styles.value}>{activity.location.name}</Text>
                <Text style={styles.link}>{activity.location.link}</Text>
              </>
            )}
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Participantes</Text>
            <Text style={styles.value}>
              {activity.participants} / {activity.totalParticipants}
            </Text>
            {isEditing && (
              <TextInput
                style={styles.input}
                value={activity.totalParticipants.toString()}
                onChangeText={(text) => 
                  setActivity({ 
                    ...activity, 
                    totalParticipants: parseInt(text) || 0 
                  })
                }
                placeholder="Total de participantes"
                placeholderTextColor="#666"
                keyboardType="numeric"
              />
            )}
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Estado</Text>
            {isEditing ? (
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={activity.status}
                  onValueChange={(value: Activity['status']) =>
                    setActivity({ ...activity, status: value })
                  }
                  style={styles.picker}
                >
                  <Picker.Item label="Activo" value="activo" />
                  <Picker.Item label="Inactivo" value="not" />
                </Picker>
              </View>
            ) : (
              <Text style={styles.value}>
                {activity.status === 'activo' ? 'Activo' : 'Inactivo'}
              </Text>
            )}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1A1A1A',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#A00000',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  editButton: {
    padding: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 8,
  },
  editButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  content: {
    padding: 16,
  },
  activityImage: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    marginBottom: 16,
  },
  formGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  value: {
    fontSize: 16,
    color: '#CCCCCC',
  },
  link: {
    fontSize: 16,
    color: '#4CAF50',
    textDecorationLine: 'underline',
  },
  input: {
    backgroundColor: '#333333',
    borderRadius: 8,
    padding: 12,
    color: '#FFFFFF',
    fontSize: 16,
    marginTop: 4,
  },
  pickerContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    marginTop: 4,
  },
  picker: {
    color: '#FFFFFF',
  },
  loadingText: {
    color: '#FFFFFF',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20,
  },
});