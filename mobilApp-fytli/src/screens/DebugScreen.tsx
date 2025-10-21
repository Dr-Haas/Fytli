import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from '@/contexts/AuthContext';
import { COLORS, SPACING } from '@config/theme';

interface DebugScreenProps {
  navigation: any;
}

const DebugScreen: React.FC<DebugScreenProps> = ({ navigation }) => {
  const { user, token, isAuthenticated, isLoading } = useAuth();
  const [storageToken, setStorageToken] = useState<string | null>(null);
  const [storageUser, setStorageUser] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    checkStorage();
  }, []);

  const checkStorage = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      const user = await AsyncStorage.getItem('user');
      
      setStorageToken(token);
      if (user) {
        setStorageUser(JSON.parse(user));
      }
    } catch (err: any) {
      setError(err.message);
    }
  };

  const clearStorage = async () => {
    await AsyncStorage.clear();
    alert('Storage effacé - Redémarrez l\'app');
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
        <Text style={styles.title}>🔍 Debug Info</Text>

        {/* Context Auth */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📱 AuthContext</Text>
          <Text style={styles.label}>isLoading: {String(isLoading)}</Text>
          <Text style={styles.label}>isAuthenticated: {String(isAuthenticated)}</Text>
          <Text style={styles.label}>Token présent: {String(!!token)}</Text>
          <Text style={styles.label}>User présent: {String(!!user)}</Text>
          {user && (
            <>
              <Text style={styles.label}>User ID: {user.id}</Text>
              <Text style={styles.label}>Email: {user.email}</Text>
              <Text style={styles.label}>Name: {user.firstname} {user.lastname}</Text>
            </>
          )}
        </View>

        {/* AsyncStorage */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>💾 AsyncStorage</Text>
          <Text style={styles.label}>Token présent: {String(!!storageToken)}</Text>
          {storageToken && (
            <Text style={styles.value}>
              {storageToken.substring(0, 30)}...
            </Text>
          )}
          <Text style={styles.label}>User présent: {String(!!storageUser)}</Text>
          {storageUser && (
            <>
              <Text style={styles.label}>User ID: {storageUser.id}</Text>
              <Text style={styles.label}>Email: {storageUser.email}</Text>
              <Text style={styles.label}>Name: {storageUser.firstname} {storageUser.lastname}</Text>
            </>
          )}
        </View>

        {/* Comparaison */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>⚖️ Comparaison</Text>
          <Text style={[
            styles.label,
            (!!storageToken === !!token) ? styles.success : styles.error
          ]}>
            Token sync: {!!storageToken === !!token ? '✅' : '❌'}
          </Text>
          <Text style={[
            styles.label,
            (!!storageUser === !!user) ? styles.success : styles.error
          ]}>
            User sync: {!!storageUser === !!user ? '✅' : '❌'}
          </Text>
        </View>

        {error && (
          <View style={styles.section}>
            <Text style={styles.errorText}>❌ {error}</Text>
          </View>
        )}

        {/* Actions */}
        <TouchableOpacity style={styles.button} onPress={checkStorage}>
          <Text style={styles.buttonText}>🔄 Recharger</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.button, styles.dangerButton]} onPress={clearStorage}>
          <Text style={styles.buttonText}>🗑️ Effacer Storage</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={() => navigation.goBack()}>
          <Text style={styles.buttonText}>← Retour</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.cream,
  },
  scroll: {
    flex: 1,
  },
  content: {
    padding: SPACING.lg,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: SPACING.xl,
    textAlign: 'center',
  },
  section: {
    backgroundColor: COLORS.white,
    padding: SPACING.md,
    borderRadius: 8,
    marginBottom: SPACING.md,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: SPACING.sm,
    color: COLORS.orange,
  },
  label: {
    fontSize: 14,
    marginBottom: SPACING.xs,
    color: COLORS.warmText,
  },
  value: {
    fontSize: 12,
    color: COLORS.darkGray,
    fontFamily: 'monospace',
    marginBottom: SPACING.sm,
  },
  success: {
    color: '#10B981',
    fontWeight: 'bold',
  },
  error: {
    color: '#EF4444',
    fontWeight: 'bold',
  },
  errorText: {
    color: '#EF4444',
    fontSize: 14,
  },
  button: {
    backgroundColor: COLORS.orange,
    padding: SPACING.md,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  dangerButton: {
    backgroundColor: COLORS.red,
  },
  buttonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '600',
  },
});

export default DebugScreen;

