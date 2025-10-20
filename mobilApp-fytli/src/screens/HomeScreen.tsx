import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import FytliSun from '../components/FytliSun';

const HomeScreen: React.FC = () => {
  // Animation dynamique du soleil (pulse entre 0.3 et 0.8)
  const [activityLevel, setActivityLevel] = useState(0.5);

  useEffect(() => {
    const interval = setInterval(() => {
      setActivityLevel(prev => {
        const next = prev + 0.05;
        return next > 0.8 ? 0.3 : next;
      });
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Soleil Fytli en haut de la page */}
        <View style={styles.sunHeader}>
          <FytliSun activityLevel={activityLevel} userCount={3} />
          <Text style={styles.sunTagline}>Plus on bouge ensemble, plus la lumière s'intensifie</Text>
        </View>

        <View style={styles.header}>
          <Text style={styles.title}>Bienvenue sur Fytli</Text>
          <Text style={styles.subtitle}>Votre application de fitness</Text>
        </View>
        
        <View style={styles.content}>
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Commencez votre entraînement</Text>
            <Text style={styles.cardText}>
              Découvrez nos programmes personnalisés pour atteindre vos objectifs
            </Text>
          </View>

          <View style={styles.card}>
            <Text style={styles.cardTitle}>Suivez vos progrès</Text>
            <Text style={styles.cardText}>
              Visualisez votre évolution et restez motivé
            </Text>
          </View>

          <View style={styles.card}>
            <Text style={styles.cardTitle}>Rejoignez la communauté</Text>
            <Text style={styles.cardText}>
              Partagez vos achievements et inspirez les autres
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0a0a',
  },
  scrollContent: {
    flexGrow: 1,
  },
  sunHeader: {
    backgroundColor: '#000',
    paddingVertical: 40,
    paddingHorizontal: 20,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#FFD75F20',
  },
  sunTagline: {
    marginTop: 20,
    fontSize: 14,
    color: '#FFB347',
    textAlign: 'center',
    fontStyle: 'italic',
  },
  header: {
    backgroundColor: '#6366f1',
    padding: 30,
    alignItems: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 18,
    color: '#e0e7ff',
  },
  content: {
    padding: 20,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 8,
  },
  cardText: {
    fontSize: 16,
    color: '#6b7280',
    lineHeight: 24,
  },
});

export default HomeScreen;

