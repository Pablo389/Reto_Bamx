import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, SafeAreaView } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useRiskSituations } from '@/hooks/riskSituations';
import { RiskSituation } from '@/constants/Risk/types';

export default function RiskSituationsScreen() {
  const { riskSituations, isLoading, error } = useRiskSituations();
  const router = useRouter();

  const handleRiskSituationPress = (item: RiskSituation) => {
    router.push({
      pathname: "/(admin)/(riskSituations)/details",
      params: { 
        riskSituation: JSON.stringify(item) 
      }
    });
  };

  const renderRiskSituation = ({ item }: { item: RiskSituation }) => (
    <TouchableOpacity
      style={styles.riskSituationItem}
      onPress={() => handleRiskSituationPress(item)}
    >
      <View style={styles.statusIndicator} />
      <View style={styles.riskSituationContent}>
        <View style={styles.riskSituationHeader}>
          <View style={styles.riskTypeTag}>
            <Ionicons 
              name={item.tipoDesastre === 'Incendio' ? 'flame' : 'warning'} 
              size={16} 
              color="#FFF" 
            />
            <Text style={styles.riskSituationType}>{item.tipoDesastre}</Text>
          </View>
          <Ionicons name="chevron-forward" size={24} color="#666" />
        </View>
        
        <Text style={styles.riskSituationName}>{item.nombre}</Text>
        
        <View style={styles.statsContainer}>
          {item.donar && (
            <View style={styles.statItem}>
              <Ionicons name="gift-outline" size={16} color="#A00000" />
              <Text style={styles.statText}>Acepta donaciones</Text>
            </View>
          )}
          {item.voluntarios && (
            <View style={styles.statItem}>
              <Ionicons name="people-outline" size={16} color="#A00000" />
              <Text style={styles.statText}>Necesita voluntarios</Text>
            </View>
          )}
        </View>
        
        <View style={styles.detailsContainer}>
          {item.donarDinero && (
            <View style={styles.detailChip}>
              <Text style={styles.detailChipText}>Donaciones monetarias</Text>
            </View>
          )}
          {item.voluntariosBrigadas?.maximo > 0 && (
            <View style={styles.detailChip}>
              <Text style={styles.detailChipText}>
                Brigadas: {item.voluntariosBrigadas.registrados}/{item.voluntariosBrigadas.maximo}
              </Text>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );

  if (isLoading) {
    return (
      <View style={styles.centerContent}>
        <Ionicons name="sync" size={24} color="#A00000" />
        <Text style={styles.loadingText}>Cargando situaciones de riesgo...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centerContent}>
        <Ionicons name="alert-circle" size={24} color="#A00000" />
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Situaciones de Riesgo</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => router.push('/(admin)/(riskSituations)/create')}
        >
          <Ionicons name="add" size={24} color="#FFF" />
        </TouchableOpacity>
      </View>

      {riskSituations.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="alert-circle-outline" size={48} color="#666" />
          <Text style={styles.emptyText}>No hay situaciones de riesgo activas</Text>
        </View>
      ) : (
        <FlatList
          data={riskSituations}
          renderItem={renderRiskSituation}
          keyExtractor={(item) => item.id!}
          contentContainerStyle={styles.listContent}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1A1A1A',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#A00000',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFF',
  },
  addButton: {
    padding: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 8,
  },
  listContent: {
    padding: 16,
  },
  riskSituationItem: {
    flexDirection: 'row',
    backgroundColor: '#333333',
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 12,
  },
  statusIndicator: {
    width: 4,
    backgroundColor: '#A00000',
  },
  riskSituationContent: {
    flex: 1,
    padding: 16,
  },
  riskSituationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  riskTypeTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#A00000',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  riskSituationName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFF',
    marginBottom: 8,
  },
  riskSituationType: {
    fontSize: 14,
    color: '#FFF',
  },
  statsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    marginBottom: 12,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  statText: {
    fontSize: 14,
    color: '#CCC',
  },
  detailsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  detailChip: {
    backgroundColor: 'rgba(160, 0, 0, 0.2)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  detailChipText: {
    fontSize: 12,
    color: '#FFF',
  },
  separator: {
    height: 8,
  },
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
  },
  loadingText: {
    fontSize: 16,
    color: '#999',
  },
  errorText: {
    fontSize: 16,
    color: '#A00000',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
  },
});