import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, Switch, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { doc, getDoc, updateDoc, collection, getDocs } from 'firebase/firestore';
import { db } from '@/config/firebaseConfig';
import { RiskSituation, DonationItem, TransportRoute, PredefinedItems } from '@/constants/Risk/types';
import { DisasterTypeSelector } from '@/components/DisasterTypeSelector';
import { RadioButton } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { Accordion } from '@/components/Accordion';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function EditRiskSituationScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const [isEditing, setIsEditing] = useState(false);
  const [riskSituation, setRiskSituation] = useState<RiskSituation | null>(null);
  const [predefinedItems, setPredefinedItems] = useState<PredefinedItems>({
    Esenciales: [],
    Emergencia: [],
    Especie: [],
  });

  useEffect(() => {
    const fetchRiskSituation = async () => {
      if (typeof id !== 'string') return;
      const docRef = doc(db, 'riskSituations', id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setRiskSituation(docSnap.data() as RiskSituation);
      } else {
        Alert.alert('Error', 'No se encontró la situación de riesgo');
        router.back();
      }
    };

    const fetchPredefinedItems = async () => {
      const itemsSnapshot = await getDocs(collection(db, 'predefinedItems'));
      const items = itemsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as DonationItem));
      setPredefinedItems({
        Esenciales: items.filter(item => item.type === 'Esenciales'),
        Emergencia: items.filter(item => item.type === 'Emergencia'),
        Especie: items.filter(item => item.type === 'Especie'),
      });
    };

    fetchRiskSituation();
    fetchPredefinedItems();
  }, [id]);

  const handleSave = async () => {
    if (!riskSituation || typeof id !== 'string') return;
    try {
      await updateDoc(doc(db, 'riskSituations', id), { ...riskSituation });
      Alert.alert('Éxito', 'Situación de riesgo actualizada correctamente');
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating document: ', error);
      Alert.alert('Error', 'No se pudo actualizar la situación de riesgo');
    }
  };

  const toggleDonationItem = (type: 'Esenciales' | 'Emergencia' | 'Especie', item: DonationItem) => {
    if (!riskSituation) return;
    const key = `items${type}` as keyof Pick<RiskSituation, 'itemsEsenciales' | 'itemsEmergencia' | 'itemsEspecie'>;
    const currentItems = riskSituation[key];
    const itemIndex = currentItems.findIndex(i => i.id === item.id);
    
    if (itemIndex > -1) {
      // Si el item ya está en la lista, lo removemos o desactivamos
      if (item.quantifiable) {
        setRiskSituation({
          ...riskSituation,
          [key]: currentItems.filter(i => i.id !== item.id),
        });
      } else {
        setRiskSituation({
          ...riskSituation,
          [key]: currentItems.map(i => i.id === item.id ? { ...i, active: !i.active } : i),
        });
      }
    } else {
      // Si el item no está en la lista, lo añadimos
      setRiskSituation({
        ...riskSituation,
        [key]: [...currentItems, { ...item, current: 0, active: true }],
      });
    }
  };

  const renderDonationItems = (type: 'Esenciales' | 'Emergencia' | 'Especie') => {
    if (!riskSituation) return null;
    const key = `items${type}` as keyof Pick<RiskSituation, 'itemsEsenciales' | 'itemsEmergencia' | 'itemsEspecie'>;
    const selectedItems = riskSituation[key];
    const allItems = predefinedItems[type];

    return (
      <View style={styles.formGroup}>
        <Text style={styles.subLabel}>{`Items de ${type}`}</Text>
        {allItems.map((item) => {
          const isSelected = selectedItems.some(i => i.id === item.id);
          const isActive = isSelected && (item.active !== false);
          return (
            <View key={item.id} style={styles.itemContainer}>
              <View style={styles.itemHeader}>
                {isEditing ? (
                  <RadioButton
                    value={item.id}
                    status={isActive ? 'checked' : 'unchecked'}
                    onPress={() => toggleDonationItem(type, item)}
                    color="#e74c3c"
                  />
                ) : (
                  <Ionicons 
                    name={isActive ? "checkmark-circle" : "close-circle"} 
                    size={24} 
                    color={isActive ? "#4CAF50" : "#F44336"} 
                  />
                )}
                <Text style={styles.itemText}>{item.name}</Text>
              </View>
              {item.quantifiable && (
                <Text style={styles.itemText}>{`${item.limit} ${item.unit}`}</Text>
              )}
              {isSelected && isActive && (
                <View style={styles.currentContainer}>
                  <Text style={styles.currentLabel}>Recibidos:</Text>
                  {isEditing ? (
                    <TextInput
                      style={styles.currentInput}
                      value={selectedItems.find(i => i.id === item.id)?.current?.toString()}
                      onChangeText={(text) => {
                        const updatedItems = selectedItems.map(i => 
                          i.id === item.id ? { ...i, current: parseInt(text) || 0 } : i
                        );
                        setRiskSituation({ ...riskSituation, [key]: updatedItems });
                      }}
                      keyboardType="numeric"
                      placeholder="0"
                      placeholderTextColor="#666"
                    />
                  ) : (
                    <Text style={styles.currentText}>
                      {selectedItems.find(i => i.id === item.id)?.current || 0}
                    </Text>
                  )}
                </View>
              )}
            </View>
          );
        })}
      </View>
    );
  };

  const renderVolunteerSection = () => {
    if (!riskSituation) return null;

    return (
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Voluntarios</Text>
        <View style={styles.formGroup}>
          <Text style={styles.label}>Brigadas</Text>
          {isEditing ? (
            <TextInput
              style={styles.input}
              value={riskSituation.voluntariosBrigadas.maximo.toString()}
              onChangeText={(text) => 
                setRiskSituation({
                  ...riskSituation,
                  voluntariosBrigadas: {
                    ...riskSituation.voluntariosBrigadas,
                    maximo: parseInt(text) || 0,
                  },
                })
              }
              placeholder="Número máximo de participantes"
              placeholderTextColor="#666"
              keyboardType="numeric"
            />
          ) : (
            <Text style={styles.valueText}>
              Máximo: {riskSituation.voluntariosBrigadas.maximo}, 
              Registrados: {riskSituation.voluntariosBrigadas.registrados}
            </Text>
          )}
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Enfermería</Text>
          {isEditing ? (
            <TextInput
              style={styles.input}
              value={riskSituation.voluntariosEnfermeria.maximo.toString()}
              onChangeText={(text) => 
                setRiskSituation({
                  ...riskSituation,
                  voluntariosEnfermeria: {
                    ...riskSituation.voluntariosEnfermeria,
                    maximo: parseInt(text) || 0,
                  },
                })
              }
              placeholder="Número máximo de participantes"
              placeholderTextColor="#666"
              keyboardType="numeric"
            />
          ) : (
            <Text style={styles.valueText}>
              Máximo: {riskSituation.voluntariosEnfermeria.maximo}, 
              Registrados: {riskSituation.voluntariosEnfermeria.registrados}
            </Text>
          )}
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Rutas de Transporte</Text>
          {riskSituation.voluntariosTransporte.map((route, index) => (
            <View key={route.id} style={styles.itemContainer}>
              <Text style={styles.itemText}>{`${route.pointA} - ${route.pointB}`}</Text>
              <Text style={styles.itemText}>{`${route.requiredPeople} personas requeridas`}</Text>
              {isEditing && (
                <TouchableOpacity
                  style={styles.deleteButton}
                  onPress={() => {
                    const updatedRoutes = riskSituation.voluntariosTransporte.filter((_, i) => i !== index);
                    setRiskSituation({ ...riskSituation, voluntariosTransporte: updatedRoutes });
                  }}
                >
                  <Ionicons name="trash-outline" size={24} color="#F44336" />
                </TouchableOpacity>
              )}
            </View>
          ))}
          {isEditing && (
            <TouchableOpacity
              style={styles.addButton}
              onPress={() => {
                const newRoute: TransportRoute = {
                  id: Date.now().toString(),
                  pointA: '',
                  pointB: '',
                  requiredPeople: 0,
                  currentPeople: 0,
                };
                setRiskSituation({
                  ...riskSituation,
                  voluntariosTransporte: [...riskSituation.voluntariosTransporte, newRoute],
                });
              }}
            >
              <Text style={styles.addButtonText}>Agregar Nueva Ruta</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
  };

  if (!riskSituation) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Cargando...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
        <ScrollView >
        <View style={styles.header}>
            <Text style={styles.title}>{isEditing ? 'Editar' : 'Ver'} Situación de Riesgo</Text>
            <TouchableOpacity
            style={styles.editButton}
            onPress={() => isEditing ? handleSave() : setIsEditing(true)}
            >
            <Text style={styles.editButtonText}>{isEditing ? 'Guardar' : 'Editar'}</Text>
            </TouchableOpacity>
        </View>

        <Accordion title="Información Básica">
            <View style={styles.formGroup}>
            <Text style={styles.label}>Nombre</Text>
            {isEditing ? (
                <TextInput
                style={styles.input}
                value={riskSituation.nombre}
                onChangeText={(text) => setRiskSituation({ ...riskSituation, nombre: text })}
                placeholder="Nombre de la situación"
                placeholderTextColor="#666"
                />
            ) : (
                <Text style={styles.valueText}>{riskSituation.nombre}</Text>
            )}
            </View>

            <View style={styles.formGroup}>
            <Text style={styles.label}>Tipo de Desastre</Text>
            {isEditing ? (
                <DisasterTypeSelector
                selectedType={riskSituation.tipoDesastre}
                onSelect={(type) => setRiskSituation({ ...riskSituation, tipoDesastre: type })}
                />
            ) : (
                <Text style={styles.valueText}>{riskSituation.tipoDesastre}</Text>
            )}
            </View>
        </Accordion>

        <Accordion title="Donaciones">
            <View style={styles.formGroup}>
            <Text style={styles.label}>¿Acepta Donaciones?</Text>
            {isEditing ? (
                <Switch
                value={riskSituation.donar}
                onValueChange={(value) => setRiskSituation({ ...riskSituation, donar: value })}
                />
            ) : (
                <Text style={styles.valueText}>{riskSituation.donar ? 'Sí' : 'No'}</Text>
            )}
            </View>

            {riskSituation.donar && (
            <>
                <View style={styles.formGroup}>
                <Text style={styles.label}>¿Acepta Donaciones en Dinero?</Text>
                {isEditing ? (
                    <Switch
                    value={riskSituation.donarDinero}
                    onValueChange={(value) => setRiskSituation({ ...riskSituation, donarDinero: value })}
                    />
                ) : (
                    <Text style={styles.valueText}>{riskSituation.donarDinero ? 'Sí' : 'No'}</Text>
                )}
                </View>

                {riskSituation.donarDinero && (
                <View style={styles.formGroup}>
                    <Text style={styles.label}>Instrucciones para Donar Dinero</Text>
                    {isEditing ? (
                    <TextInput
                        style={styles.input}
                        value={riskSituation.instruccionesDinero}
                        onChangeText={(text) => setRiskSituation({ ...riskSituation, instruccionesDinero: text })}
                        placeholder="Instrucciones para donar dinero"
                        placeholderTextColor="#666"
                        multiline
                    />
                    ) : (
                    <Text style={styles.valueText}>{riskSituation.instruccionesDinero}</Text>
                    )}
                </View>
                )}

                <View style={styles.formGroup}>
                <Text style={styles.label}>¿Acepta Donaciones de Artículos Esenciales?</Text>
                {isEditing ? (
                    <Switch
                    value={riskSituation.donarEsenciales}
                    onValueChange={(value) => setRiskSituation({ ...riskSituation, donarEsenciales: value })}
                    />
                ) : (
                    <Text style={styles.valueText}>{riskSituation.donarEsenciales ? 'Sí' : 'No'}</Text>
                )}
                </View>

                {riskSituation.donarEsenciales && renderDonationItems('Esenciales')}

                <View style={styles.formGroup}>
                <Text style={styles.label}>¿Acepta Donaciones de Artículos de Emergencia?</Text>
                {isEditing ? (
                    <Switch
                    value={riskSituation.donarEmergencia}
                    onValueChange={(value) => setRiskSituation({ ...riskSituation, donarEmergencia: value })}
                    />
                ) : (
                    <Text style={styles.valueText}>{riskSituation.donarEmergencia ? 'Sí' : 'No'}</Text>
                )}
                </View>

                {riskSituation.donarEmergencia && renderDonationItems('Emergencia')}

                <View style={styles.formGroup}>
                <Text style={styles.label}>¿Acepta Donaciones en Especie?</Text>
                {isEditing ? (
                    <Switch
                    value={riskSituation.donarEspecie}
                    onValueChange={(value) => setRiskSituation({ ...riskSituation, donarEspecie: value })}
                    />
                ) : (
                    <Text style={styles.valueText}>{riskSituation.donarEspecie ? 'Sí' : 'No'}</Text>
                )}
                </View>

                {riskSituation.donarEspecie && renderDonationItems('Especie')}
            </>
            )}
        </Accordion>

        <Accordion title="Voluntarios">
            <View style={styles.formGroup}>
            <Text style={styles.label}>¿Acepta Voluntarios?</Text>
            {isEditing ? (
                <Switch value={riskSituation.voluntarios}
                onValueChange={(value) => setRiskSituation({ ...riskSituation, voluntarios: value })}
                />
            ) : (
                <Text style={styles.valueText}>{riskSituation.voluntarios ? 'Sí' : 'No'}</Text>
            )}
            </View>

            {riskSituation.voluntarios && renderVolunteerSection()}
        </Accordion>

        {isEditing && (
            <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
            <Text style={styles.saveButtonText}>Guardar Cambios</Text>
            </TouchableOpacity>
        )}
        </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a1a',
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  editButton: {
    backgroundColor: '#e74c3c',
    padding: 8,
    borderRadius: 8,
  },
  editButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 16,
  },
  formGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    color: '#fff',
    marginBottom: 8,
  },
  subLabel: {
    fontSize: 14,
    color: '#ccc',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#333333',
    borderRadius: 8,
    padding: 12,
    color: '#fff',
    fontSize: 16,
  },
  valueText: {
    fontSize: 16,
    color: '#e74c3c',
  },
  itemContainer: {
    backgroundColor: '#333333',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
  },
  itemHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  itemText: {
    color: '#fff',
    fontSize: 14,
    marginLeft: 8,
  },
  currentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  currentLabel: {
    color: '#fff',
    fontSize: 14,
    marginRight: 8,
  },
  currentInput: {
    backgroundColor: '#3c3c3e',
    borderRadius: 4,
    padding: 4,
    color: '#fff',
    fontSize: 14,
    width: 60,
  },
  currentText: {
    color: '#e74c3c',
    fontSize: 14,
  },
  addButton: {
    backgroundColor: '#2c2c2e',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  deleteButton: {
    position: 'absolute',
    top: 8,
    right: 8,
  },
  saveButton: {
    backgroundColor: '#327535',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 24,
    marginBottom: 40,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  loadingText: {
    fontSize: 18,
    color: '#fff',
    textAlign: 'center',
  },
});
