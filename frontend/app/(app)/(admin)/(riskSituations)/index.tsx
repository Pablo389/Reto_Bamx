import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, SafeAreaView } from 'react-native';
import { Link, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useRiskSituations } from '@/hooks/riskSituations';
import { RiskSituation } from '@/constants/Risk/types';

export default function RiskSituationsScreen() {
  const { riskSituations, isLoading, error } = useRiskSituations();
  const router = useRouter();

  const renderRiskSituation = ({ item }: { item: RiskSituation }) => (
    <TouchableOpacity 
      style={styles.riskSituationItem}
      onPress={() => router.push(`/(admin)/(riskSituations)/${item.id}`)}
    >
      <View style={styles.riskSituationInfo}>
        <Text style={styles.riskSituationName}>{item.nombre}</Text>
        <Text style={styles.riskSituationType}>{item.tipoDesastre}</Text>
      </View>
      <Ionicons name="chevron-forward" size={24} color="#666" />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View>
        <Text style={styles.title}>Situaciones de Riesgo</Text>
        <TouchableOpacity 
          style={styles.addButton}
          onPress={() => router.push('/(admin)/(riskSituations)/create')}
        >
          <Ionicons name="add" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      {isLoading ? (
        <View style={styles.centerContent}>
          <Text style={styles.loadingText}>Cargando situaciones de riesgo...</Text>
        </View>
      ) : error ? (
        <View style={styles.centerContent}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      ) : (
        <FlatList
          data={riskSituations}
          renderItem={renderRiskSituation}
          keyExtractor={(item) => item.id!}
          contentContainerStyle={styles.listContent}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a1a',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#1a1a1a',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  addButton: {
    backgroundColor: '#e74c3c',
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContent: {
    padding: 16,
  },
  riskSituationItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#333333',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  riskSituationInfo: {
    flex: 1,
  },
  riskSituationName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 4,
  },
  riskSituationType: {
    fontSize: 14,
    color: '#999',
  },
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#999',
  },
  errorText: {
    fontSize: 16,
    color: '#e74c3c',
  },
});

