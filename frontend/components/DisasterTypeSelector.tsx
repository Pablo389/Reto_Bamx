import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';

const disasterTypes = [
  'Terremoto',
  'Inundación',
  'Huracán',
  'Incendio forestal',
  'Tsunami',
  'Deslizamiento de tierra',
  'Erupción volcánica',
  'Sequía',
  'Tormenta severa',
  'Otro'
];

interface DisasterTypeSelectorProps {
  selectedType: string;
  onSelect: (type: string) => void;
}

export const DisasterTypeSelector: React.FC<DisasterTypeSelectorProps> = ({ selectedType, onSelect }) => {
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.container}>
      {disasterTypes.map((type) => (
        <TouchableOpacity
          key={type}
          style={[
            styles.typeButton,
            selectedType === type && styles.selectedTypeButton
          ]}
          onPress={() => onSelect(type)}
        >
          <Text style={[
            styles.typeText,
            selectedType === type && styles.selectedTypeText
          ]}>
            {type}
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  typeButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#2c2c2e',
    marginRight: 8,
  },
  selectedTypeButton: {
    backgroundColor: '#e74c3c',
  },
  typeText: {
    color: '#fff',
    fontSize: 14,
  },
  selectedTypeText: {
    fontWeight: 'bold',
  },
});

