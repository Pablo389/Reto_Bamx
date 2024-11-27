import { Stack } from 'expo-router';

export default function RiskSituationsLayout() {
  return (
    <Stack screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen 
        name="index" 
        options={{ 
          title: 'Situaciones de Riesgo',
          headerStyle: {
            backgroundColor: '#1a1a1a',
          },
          headerTintColor: '#fff',
        }} 
      />
      <Stack.Screen 
        name="create" 
        options={{ 
          title: 'Crear Situación de Riesgo',
          headerStyle: {
            backgroundColor: '#1a1a1a',
          },
          headerTintColor: '#fff',
        }} 
      />
    </Stack>
  );
}
