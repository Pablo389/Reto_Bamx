import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, Switch, TouchableOpacity, ScrollView, Alert, SafeAreaView } from 'react-native';
import { useRouter } from 'expo-router';
import { collection, addDoc, getDocs } from 'firebase/firestore';
import { db } from '@/config/firebaseConfig';
import { RiskSituation, DonationItem, TransportRoute, PredefinedItems } from '@/constants/Risk/types';
import { DisasterTypeSelector } from '@/components/DisasterTypeSelector';
import { RadioButton } from 'react-native-paper';
import { Accordion } from '@/components/Accordion';
import { Ionicons } from '@expo/vector-icons';

const steps = [
  'Información básica',
  'Donaciones',
  'Voluntarios',
  'Revisión'
];

export default function CreateRiskSituationScreen() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<RiskSituation>({
    nombre: '',
    tipoDesastre: '',
    donar: false,
    donarDinero: false,
    donarEsenciales: false,
    donarEmergencia: false,
    donarEspecie: false,
    voluntarios: false,
    instruccionesDinero: '',
    itemsEsenciales: [],
    itemsEmergencia: [],
    itemsEspecie: [],
    voluntariosBrigadas: { maximo: 0, registrados: 0 },
    voluntariosEnfermeria: { maximo: 0, registrados: 0 },
    voluntariosTransporte: [],
  });

  const [newDonationItem, setNewDonationItem] = useState<DonationItem>({
    id: '',
    name: '',
    quantifiable: false,
    unit: '',
    limit: 0,
    current: 0,
    type: 'Esenciales', // Default type
  });

  const [newTransportRoute, setNewTransportRoute] = useState<TransportRoute>({
    id: '',
    pointA: '',
    pointB: '',
    requiredPeople: 0,
    currentPeople: 0,
  });

  const [predefinedItems, setPredefinedItems] = useState<PredefinedItems>({
    Esenciales: [],
    Emergencia: [],
    Especie: [],
  });

  useEffect(() => {
    const fetchPredefinedItems = async () => {
      const itemsSnapshot = await getDocs(collection(db, 'predefinedItems'));
      const items = itemsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as DonationItem));
      setPredefinedItems({
        Esenciales: items.filter(item => item.type === 'Esenciales'),
        Emergencia: items.filter(item => item.type === 'Emergencia'),
        Especie: items.filter(item => item.type === 'Especie'),
      });
    };
    fetchPredefinedItems();
  }, []);

  const handleSubmit = async () => {
    try {
      await addDoc(collection(db, 'riskSituations'), formData);
      Alert.alert('Éxito', 'Situación de riesgo creada correctamente');
      router.replace('/(admin)/(riskSituations)');
    } catch (error) {
      console.error('Error adding document: ', error);
      Alert.alert('Error', 'No se pudo crear la situación de riesgo');
    }
  };

  const toggleDonationItem = (type: 'Esenciales' | 'Emergencia' | 'Especie', item: DonationItem) => {
    const key = `items${type}` as keyof Pick<RiskSituation, 'itemsEsenciales' | 'itemsEmergencia' | 'itemsEspecie'>;
    const currentItems = formData[key];
    const itemIndex = currentItems.findIndex(i => i.id === item.id);
    
    if (itemIndex > -1) {
      // Si el item ya está en la lista, lo removemos
      setFormData({
        ...formData,
        [key]: currentItems.filter(i => i.id !== item.id),
      });
    } else {
      // Si el item no está en la lista, lo añadimos
      setFormData({
        ...formData,
        [key]: [...currentItems, { ...item, current: 0 }],
      });
    }
  };

  const addNewDonationItem = async (type: 'Esenciales' | 'Emergencia' | 'Especie') => {
    const key = `items${type}` as keyof Pick<RiskSituation, 'itemsEsenciales' | 'itemsEmergencia' | 'itemsEspecie'>;
    const newItem: DonationItem = {
      ...newDonationItem,
      id: Date.now().toString(),
      type,
    };
    
    try {
      const docRef = await addDoc(collection(db, 'predefinedItems'), newItem);
      const itemWithId = { ...newItem, id: docRef.id };
      
      setPredefinedItems(prev => ({
        ...prev,
        [type]: [...prev[type], itemWithId],
      }));
      
      setFormData({
        ...formData,
        [key]: [...formData[key], itemWithId],
      });
      
      setNewDonationItem({ id: '', name: '', quantifiable: false, unit: '', limit: 0, current: 0, type: 'Esenciales' });
    } catch (error) {
      console.error('Error adding new donation item: ', error);
      Alert.alert('Error', 'No se pudo agregar el nuevo item de donación');
    }
  };

  const addTransportRoute = () => {
    setFormData({
      ...formData,
      voluntariosTransporte: [...formData.voluntariosTransporte, { ...newTransportRoute, id: Date.now().toString() }],
    });
    setNewTransportRoute({ id: '', pointA: '', pointB: '', requiredPeople: 0, currentPeople: 0 });
  };

  const renderDonationItems = (type: 'Esenciales' | 'Emergencia' | 'Especie') => {
    const key = `items${type}` as keyof Pick<RiskSituation, 'itemsEsenciales' | 'itemsEmergencia' | 'itemsEspecie'>;
    const selectedItems = formData[key];
    const allItems = predefinedItems[type];

    return (
      <View style={styles.formGroup}>
        <Text style={styles.subLabel}>{`Items de ${type}`}</Text>
        {allItems.map((item) => (
          <View key={item.id} style={styles.itemContainer}>
            <View style={styles.itemHeader}>
              <RadioButton
                value={item.id}
                status={selectedItems.some(i => i.id === item.id) ? 'checked' : 'unchecked'}
                onPress={() => toggleDonationItem(type, item)}
                color="#e74c3c"
              />
              <Text style={styles.itemText}>{item.name}</Text>
            </View>
            {item.quantifiable && (
              <Text style={styles.itemText}>{`${item.limit} ${item.unit}`}</Text>
            )}
            {selectedItems.some(i => i.id === item.id) && (
              <View style={styles.currentContainer}>
                <Text style={styles.currentLabel}>Recibidos:</Text>
                <TextInput
                  style={styles.currentInput}
                  value={selectedItems.find(i => i.id === item.id)?.current?.toString()}
                  onChangeText={(text) => {
                    const updatedItems = selectedItems.map(i => 
                      i.id === item.id ? { ...i, current: parseInt(text) || 0 } : i
                    );
                    setFormData({ ...formData, [key]: updatedItems });
                  }}
                  keyboardType="numeric"
                  placeholder="0"
                  placeholderTextColor="#666"
                />
              </View>
            )}
          </View>
        ))}
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => setNewDonationItem({ ...newDonationItem, id: Date.now().toString(), type })}
        >
          <Text style={styles.addButtonText}>Agregar nuevo item</Text>
        </TouchableOpacity>
        {newDonationItem.id !== '' && (
          <View style={styles.newItemForm}>
            <TextInput
              style={styles.input}
              value={newDonationItem.name}
              onChangeText={(text) => setNewDonationItem({ ...newDonationItem, name: text })}
              placeholder="Nombre del item"
              placeholderTextColor="#666"
            />
            <View style={styles.switchContainer}>
              <Text style={styles.switchLabel}>¿Cuantificable?</Text>
              <Switch
                value={newDonationItem.quantifiable}
                onValueChange={(value) => setNewDonationItem({ ...newDonationItem, quantifiable: value })}
              />
            </View>
            {newDonationItem.quantifiable && (
              <>
                <TextInput
                  style={styles.input}
                  value={newDonationItem.unit}
                  onChangeText={(text) => setNewDonationItem({ ...newDonationItem, unit: text })}
                  placeholder="Unidad de medida"
                  placeholderTextColor="#666"
                />
                <TextInput
                  style={styles.input}
                  value={newDonationItem.limit?.toString()}
                  onChangeText={(text) => setNewDonationItem({ ...newDonationItem, limit: parseInt(text) || 0 })}
                  placeholder="Límite"
                  placeholderTextColor="#666"
                  keyboardType="numeric"
                />
              </>
            )}
            <TouchableOpacity
              style={styles.addButton}
              onPress={() => addNewDonationItem(type)}
            >
              <Text style={styles.addButtonText}>Guardar nuevo item</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    );
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <Accordion title="Información Básica">
            <View style={styles.formGroup}>
              <Text style={styles.label}>Nombre</Text>
              <TextInput
                style={styles.input}
                value={formData.nombre}
                onChangeText={(text) => setFormData({ ...formData, nombre: text })}
                placeholder="Nombre de la situación"
                placeholderTextColor="#666"
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Tipo de Desastre</Text>
              <DisasterTypeSelector
                selectedType={formData.tipoDesastre}
                onSelect={(type) => setFormData({ ...formData, tipoDesastre: type })}
              />
            </View>
          </Accordion>
        );
      case 1:
        return (
          <Accordion title="Donaciones">
            <View style={styles.formGroup}>
              <Text style={styles.label}>¿Acepta Donaciones?</Text>
              <Switch
                value={formData.donar}
                onValueChange={(value) => setFormData({ ...formData, donar: value })}
              />
            </View>

            {formData.donar && (
              <>
                <Accordion title="Donaciones en Dinero">
                  <View style={styles.formGroup}>
                    <Text style={styles.label}>¿Acepta Donaciones en Dinero?</Text>
                    <Switch
                      value={formData.donarDinero}
                      onValueChange={(value) => 
                        setFormData({ 
                          ...formData, 
                          donarDinero: value 
                        })
                      }
                    />
                  </View>

                  {formData.donarDinero && (
                    <View style={styles.formGroup}>
                      <Text style={styles.label}>Instrucciones para Donar Dinero</Text>
                      <TextInput
                        style={styles.input}
                        value={formData.instruccionesDinero}
                        onChangeText={(text) => setFormData({ ...formData, instruccionesDinero: text })}
                        placeholder="Instrucciones para donar dinero"
                        placeholderTextColor="#666"
                        multiline
                      />
                    </View>
                  )}
                </Accordion>

                <Accordion title="Artículos Esenciales">
                  <View style={styles.formGroup}>
                    <Text style={styles.label}>¿Acepta Donaciones de Artículos Esenciales?</Text>
                    <Switch
                      value={formData.donarEsenciales}
                      onValueChange={(value) => 
                        setFormData({ 
                          ...formData, 
                          donarEsenciales: value 
                        })
                      }
                    />
                  </View>

                  {formData.donarEsenciales && renderDonationItems('Esenciales')}
                </Accordion>

                <Accordion title="Artículos de Emergencia">
                  <View style={styles.formGroup}>
                    <Text style={styles.label}>¿Acepta Donaciones de Artículos de Emergencia?</Text>
                    <Switch
                      value={formData.donarEmergencia}
                      onValueChange={(value) => 
                        setFormData({ 
                          ...formData, 
                          donarEmergencia: value 
                        })
                      }
                    />
                  </View>

                  {formData.donarEmergencia && renderDonationItems('Emergencia')}
                </Accordion>

                <Accordion title="Donaciones en Especie">
                  <View style={styles.formGroup}>
                    <Text style={styles.label}>¿Acepta Donaciones en Especie?</Text>
                    <Switch
                      value={formData.donarEspecie}
                      onValueChange={(value) => 
                        setFormData({ 
                          ...formData, 
                          donarEspecie: value 
                        })
                      }
                    />
                  </View>

                  {formData.donarEspecie && renderDonationItems('Especie')}
                </Accordion>
              </>
            )}
          </Accordion>
        );
      case 2:
        return (
          <Accordion title="Voluntarios">
            <View style={styles.formGroup}>
              <Text style={styles.label}>¿Acepta Voluntarios?</Text>
              <Switch
                value={formData.voluntarios}
                onValueChange={(value) => setFormData({ ...formData, voluntarios: value })}
              />
            </View>

            {formData.voluntarios && (
              <>
                <Accordion title="Brigadas">
                  <View style={styles.formGroup}>
                    <Text style={styles.label}>Voluntarios Brigadas</Text>
                    <TextInput
                      style={styles.input}
                      value={formData.voluntariosBrigadas?.maximo.toString()}
                      onChangeText={(text) => 
                        setFormData({
                          ...formData,
                          voluntariosBrigadas: {
                            ...formData.voluntariosBrigadas!,
                            maximo: parseInt(text) || 0,
                          },
                        })
                      }
                      placeholder="Número máximo de participantes"
                      placeholderTextColor="#666"
                      keyboardType="numeric"
                    />
                  </View>
                </Accordion>

                <Accordion title="Enfermería">
                  <View style={styles.formGroup}>
                    <Text style={styles.label}>Voluntarios Enfermería</Text>
                    <TextInput
                      style={styles.input}
                      value={formData.voluntariosEnfermeria?.maximo.toString()}
                      onChangeText={(text) => 
                        setFormData({
                          ...formData,
                          voluntariosEnfermeria: {
                            ...formData.voluntariosEnfermeria!,
                            maximo: parseInt(text) || 0,
                          },
                        })
                      }
                      placeholder="Número máximo de participantes"
                      placeholderTextColor="#666"
                      keyboardType="numeric"
                    />
                  </View>
                </Accordion>

                <Accordion title="Rutas de Transporte">
                  <View style={styles.formGroup}>
                    <Text style={styles.label}>Rutas de Transporte</Text>
                    {formData.voluntariosTransporte?.map((route, index) => (
                      <View key={route.id} style={styles.itemContainer}>
                        <Text style={styles.itemText}>{`${route.pointA} - ${route.pointB}`}</Text>
                        <Text style={styles.itemText}>{`${route.requiredPeople} personas requeridas`}</Text>
                        <TouchableOpacity
                          style={styles.deleteButton}
                          onPress={() => {
                            const updatedRoutes = formData.voluntariosTransporte?.filter((_, i) => i !== index);
                            setFormData({ ...formData, voluntariosTransporte: updatedRoutes });
                          }}
                        >
                          <Ionicons name="trash-outline" size={24} color="#F44336" />
                        </TouchableOpacity>
                      </View>
                    ))}
                    <TextInput
                      style={styles.input}
                      value={newTransportRoute.pointA}
                      onChangeText={(text) => setNewTransportRoute({ ...newTransportRoute, pointA: text })}
                      placeholder="Punto A"
                      placeholderTextColor="#666"
                    />
                    <TextInput
                      style={styles.input}
                      value={newTransportRoute.pointB}
                      onChangeText={(text) => setNewTransportRoute({ ...newTransportRoute, pointB: text })}
                      placeholder="Punto B"
                      placeholderTextColor="#666"
                    />
                    <TextInput
                      style={styles.input}
                      value={newTransportRoute.requiredPeople.toString()}
                      onChangeText={(text) => setNewTransportRoute({ ...newTransportRoute, requiredPeople: parseInt(text) || 0 })}
                      placeholder="Personas requeridas"
                      placeholderTextColor="#666"
                      keyboardType="numeric"
                    />
                    <TouchableOpacity
                      style={styles.addButton}
                      onPress={addTransportRoute}
                    >
                      <Text style={styles.addButtonText}>Agregar Ruta de Transporte</Text>
                    </TouchableOpacity>
                  </View>
                </Accordion>
              </>
            )}
          </Accordion>
        );
      case 3:
        return (
          <Accordion title="Resumen">
            <View style={styles.reviewContainer}>
              <Text style={styles.reviewTitle}>Resumen de la Situación de Riesgo</Text>
              <Text style={styles.reviewItem}>Nombre: {formData.nombre}</Text>
              <Text style={styles.reviewItem}>Tipo de Desastre: {formData.tipoDesastre}</Text>
              <Text style={styles.reviewItem}>Acepta Donaciones: {formData.donar ? 'Sí' : 'No'}</Text>
              {formData.donar && (
                <>
                  <Text style={styles.reviewItem}>Acepta Donaciones en Dinero: {formData.donarDinero ? 'Sí' : 'No'}</Text>
                  {formData.donarDinero && (
                    <Text style={styles.reviewItem}>Instrucciones para Donar Dinero: {formData.instruccionesDinero}</Text>
                  )}
                  <Text style={styles.reviewItem}>Acepta Donaciones de Artículos Esenciales: {formData.donarEsenciales ? 'Sí' : 'No'}</Text>
                  {formData.donarEsenciales && (
                    <Text style={styles.reviewItem}>Items Esenciales: {formData.itemsEsenciales.length}</Text>
                  )}
                  <Text style={styles.reviewItem}>Acepta Donaciones de Artículos de Emergencia: {formData.donarEmergencia ? 'Sí' : 'No'}</Text>
                  {formData.donarEmergencia && (
                    <Text style={styles.reviewItem}>Items de Emergencia: {formData.itemsEmergencia.length}</Text>
                  )}
                  <Text style={styles.reviewItem}>Acepta Donaciones en Especie: {formData.donarEspecie ? 'Sí' : 'No'}</Text>
                  {formData.donarEspecie && (
                    <Text style={styles.reviewItem}>Items en Especie: {formData.itemsEspecie.length}</Text>
                  )}
                </>
              )}
              <Text style={styles.reviewItem}>Acepta Voluntarios: {formData.voluntarios ? 'Sí' : 'No'}</Text>
              {formData.voluntarios && (
                <>
                  <Text style={styles.reviewItem}>Máximo Voluntarios Brigadas: {formData.voluntariosBrigadas?.maximo}</Text>
                  <Text style={styles.reviewItem}>Máximo Voluntarios Enfermería: {formData.voluntariosEnfermeria?.maximo}</Text>
                  <Text style={styles.reviewItem}>Rutas de Transporte: {formData.voluntariosTransporte?.length}</Text>
                </>
              )}
            </View>
          </Accordion>
        );
      default:
        return null;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Crear Situación de Riesgo</Text>
      </View>
      
      <View style={styles.stepperContainer}>
        <View style={styles.stepsLine} />
        {steps.map((step, index) => (
          <TouchableOpacity
            key={step}
            style={[
              styles.stepButton,
              currentStep === index && styles.activeStepButton,
              currentStep > index && styles.completedStepButton
            ]}
            onPress={() => setCurrentStep(index)}
          >
            {currentStep > index ? (
              <Ionicons name="checkmark" size={20} color="#FFF" />
            ) : (
              <Text style={[
                styles.stepText,
                currentStep === index && styles.activeStepText
              ]}>
                {index + 1}
              </Text>
            )}
            <Text style={[
              styles.stepLabel,
              currentStep === index && styles.activeStepLabel
            ]}>
              {step}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
  
      <ScrollView style={styles.content}>
        {renderStepContent()}
        
        <View style={styles.navigationButtons}>
          {currentStep > 0 && (
            <TouchableOpacity
              style={styles.navButton}
              onPress={() => setCurrentStep(currentStep - 1)}
            >
              <Ionicons name="arrow-back" size={20} color="#FFF" />
              <Text style={styles.navButtonText}>Anterior</Text>
            </TouchableOpacity>
          )}
          {currentStep < steps.length - 1 ? (
            <TouchableOpacity
              style={[styles.navButton, styles.nextButton]}
              onPress={() => setCurrentStep(currentStep + 1)}
            >
              <Text style={styles.navButtonText}>Siguiente</Text>
              <Ionicons name="arrow-forward" size={20} color="#FFF" />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={[styles.navButton, styles.submitButton]}
              onPress={handleSubmit}
            >
              <Text style={styles.submitButtonText}>Crear Situación</Text>
              <Ionicons name="checkmark-circle" size={20} color="#FFF" />
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#1A1A1A',
    },
    header: {
      backgroundColor: '#A00000',
      padding: 16,
      elevation: 4,
    },
    headerTitle: {
      fontSize: 20,
      fontWeight: 'bold',
      color: '#FFF',
    },
    stepperContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: 16,
      marginBottom: 20,
      position: 'relative',
    },
    stepsLine: {
      position: 'absolute',
      left: 40,
      right: 40,
      top: '50%',
      height: 2,
      backgroundColor: '#666',
    },
    stepButton: {
      width: 36,
      height: 36,
      borderRadius: 18,
      backgroundColor: '#666',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1,
    },
    activeStepButton: {
      backgroundColor: '#A00000',
    },
    completedStepButton: {
      backgroundColor: '#4CAF50',
    },
    stepText: {
      color: '#FFF',
      fontSize: 14,
      fontWeight: 'bold',
    },
    activeStepText: {
      color: '#FFF',
    },
    stepLabel: {
      position: 'absolute',
      top: 40,
      fontSize: 12,
      color: '#999',
      width: 80,
      textAlign: 'center',
      marginLeft: -20,
    },
    activeStepLabel: {
      color: '#FFF',
    },
    content: {
      flex: 1,
      padding: 16,
    },
    formGroup: {
      marginBottom: 16,
    },
    label: {
      fontSize: 16,
      color: '#FFF',
      marginBottom: 8,
      fontWeight: '500',
    },
    subLabel: {
      fontSize: 14,
      color: '#ccc',
      marginBottom: 8,
    },
    input: {
      backgroundColor: '#333',
      borderRadius: 8,
      padding: 12,
      color: '#FFF',
      fontSize: 16,
      borderWidth: 1,
      borderColor: '#444',
    },
    switchContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 12,
    },
    switchLabel: {
      fontSize: 16,
      color: '#FFF',
      marginRight: 12,
    },
    navigationButtons: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginTop: 24,
      marginBottom: 40,
    },
    navButton: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: '#333',
      padding: 12,
      borderRadius: 8,
      minWidth: 120,
      justifyContent: 'center',
      gap: 8,
    },
    nextButton: {
      backgroundColor: '#A00000',
    },
    submitButton: {
      backgroundColor: '#4CAF50',
    },
    navButtonText: {
      color: '#FFF',
      fontSize: 16,
      fontWeight: 'bold',
    },
    submitButtonText: {
      color: '#FFF',
      fontSize: 16,
      fontWeight: 'bold',
    },
    itemContainer: {
      backgroundColor: '#333',
      borderRadius: 8,
      padding: 16,
      marginBottom: 12,
      borderWidth: 1,
      borderColor: '#444',
    },
    itemHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 8,
    },
    itemText: {
      color: '#FFF',
      fontSize: 16,
    },
    currentContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: 8,
    },
    currentLabel: {
      color: '#FFF',
      fontSize: 14,
      marginRight: 8,
    },
    currentInput: {
      backgroundColor: '#444',
      borderRadius: 4,
      padding: 8,
      color: '#FFF',
      fontSize: 14,
      width: 60,
      textAlign: 'center',
    },
    addButton: {
      backgroundColor: '#A00000',
      padding: 12,
      borderRadius: 8,
      alignItems: 'center',
      marginTop: 12,
    },
    addButtonText: {
      color: '#FFF',
      fontSize: 14,
      fontWeight: 'bold',
    },
    deleteButton: {
      position: 'absolute',
      top: 8,
      right: 8,
      padding: 8,
    },
    reviewContainer: {
      backgroundColor: '#333',
      borderRadius: 8,
      padding: 16,
    },
    reviewTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      color: '#FFF',
      marginBottom: 16,
    },
    reviewItem: {
      fontSize: 14,
      color: '#FFF',
      marginBottom: 8,
    },
    newItemForm: {
      backgroundColor: '#333',
      borderRadius: 8,
      padding: 16,
      marginTop: 12,
      borderWidth: 1,
      borderColor: '#444',
    },
  });