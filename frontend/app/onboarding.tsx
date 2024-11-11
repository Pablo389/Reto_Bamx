import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import React, { useState, useRef } from 'react';
import { View, Text, Image, TouchableOpacity, useWindowDimensions, ScrollView, StyleSheet } from 'react-native';

export default function Onboarding() {
  const { width } = useWindowDimensions();
  const scrollRef = useRef<ScrollView>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const screens = [
    {
      title: "¡Es un placer conocerte!",
      description: "Únete a nosotros para ayudar a las comunidades locales a combatir el hambre. ¡Regístrate y marca la diferencia!",
      image: require('../assets/images/onBoarding-1.png')
    },
    {
      title: "Encuentra oportunidades para ayudar",
      description: "Explora y apúntate fácilmente a actividades de voluntariado que se ajusten a tu horario. Te notificaremos de oportunidades en tu área.",
      image: require('../assets/images/onBoarding-2.png')
    },
    {
      title: "Modifica tu ruta para ayudar",
      description: "Recoge alimentos excedentes de restaurantes u hoteles locales y entrégalos directamente al banco de alimentos con rutas guiadas.",
      image: require('../assets/images/onBoarding-3.png')
    }
  ];

  const handleContinue = async () => {
    if (currentIndex < screens.length - 1) {
      scrollRef.current?.scrollTo({ x: width * (currentIndex + 1), animated: true });
      setCurrentIndex(currentIndex + 1);
    } else {
      // Manejar la finalización del onboarding
      try {
        // Navegar al inicio de sesión
        router.replace('/sign-in');
      } catch (error) {
        console.error('Error al guardar el estado de onboarding:', error);
      }
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView
        ref={scrollRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={(event) => {
          const newIndex = Math.round(event.nativeEvent.contentOffset.x / width);
          setCurrentIndex(newIndex);
        }}
      >
        {screens.map((screen, index) => (
          <View key={index} style={[styles.screenContainer, { width }]}>
            <Image source={screen.image} style={styles.image} />
            <Text style={styles.title}>{screen.title}</Text>
            <Text style={styles.description}>{screen.description}</Text>
          </View>
        ))}
      </ScrollView>

      <View style={styles.paginationContainer}>
        {screens.map((_, index) => (
          <View
            key={index}
            style={[
              styles.paginationDot,
              { backgroundColor: currentIndex === index ? '#B33E3E' : '#E0E0E0' }
            ]}
          />
        ))}
      </View>

      <TouchableOpacity onPress={handleContinue} style={styles.button}>
        <Text style={styles.buttonText}>
          {currentIndex === screens.length - 1 ? 'Comenzar' : 'Continuar'}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  screenContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  image: {
    width: '80%',
    height: '50%',
    resizeMode: 'contain',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 20,
    color: '#1a1a1a',
  },
  description: {
    fontSize: 16,
    textAlign: 'center',
    color: '#666666',
    marginBottom: 20,
  },
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
  button: {
    backgroundColor: '#B33E3E',
    paddingVertical: 16,
    marginHorizontal: 20,
    borderRadius: 12,
    marginBottom: 40,
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
    fontSize: 18,
    fontWeight: '600',
  },
});