import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, GRADIENTS, SPACING, BORDER_RADIUS } from '@config/theme';
import Input from '@components/Input';
import GradientButton from '@components/GradientButton';
import { useAuth } from '@/contexts/AuthContext';

interface LoginScreenProps {
  navigation: any;
}

const LoginScreen: React.FC<LoginScreenProps> = ({ navigation }) => {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    setError('');
    setLoading(true);
    
    try {
      await login({ email, password });
      // La navigation se fera automatiquement grâce à AuthContext
    } catch (err: any) {
      console.error('Erreur auth:', err);
      setError(err.response?.data?.error || 'Erreur de connexion. Vérifiez vos identifiants.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <LinearGradient colors={['#D94A28', '#E65C35', '#F26B42']} style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardView}
        >
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            {/* Header */}
            <View style={styles.header}>
              <Text style={styles.logo}>fytli</Text>
              <Text style={styles.welcomeText}>Bon retour parmi nous</Text>
              <Text style={styles.subtitle}>
                Connecte-toi pour accéder à ton compte
              </Text>
            </View>

            {/* Form */}
            <View style={styles.form}>
              {error ? <Text style={styles.errorText}>{error}</Text> : null}
              
              <Input
                label="Email"
                placeholder="ton@email.com"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />

              <Input
                label="Mot de passe"
                placeholder="••••••••"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
              />

              <GradientButton
                title="Se connecter"
                onPress={handleSubmit}
                size="large"
                style={styles.submitButton}
                loading={loading}
                disabled={loading || !email || !password}
              />

              <TouchableOpacity onPress={() => navigation.navigate('Register')}>
                <Text style={styles.toggleText}>
                  Pas encore de compte ? Inscris-toi
                </Text>
              </TouchableOpacity>
            </View>

            {/* Footer */}
            <View style={styles.footer}>
              <Text style={styles.motivationText}>
                Pas de performance.{'\n'}
                Juste du mouvement partagé.
              </Text>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.xl,
  },
  header: {
    alignItems: 'center',
    marginTop: SPACING.xl,
    marginBottom: SPACING.xl * 2,
  },
  logo: {
    fontSize: 48,
    fontWeight: 'bold',
    color: COLORS.white,
    letterSpacing: 2,
    marginBottom: SPACING.md,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.white,
    textAlign: 'center',
    marginBottom: SPACING.xs,
  },
  subtitle: {
    fontSize: 14,
    color: COLORS.white,
    textAlign: 'center',
  },
  form: {
    marginBottom: SPACING.xl * 2,
  },
  submitButton: {
    marginTop: SPACING.md,
    marginBottom: SPACING.lg,
  },
  toggleText: {
    fontSize: 14,
    color: COLORS.white,
    textAlign: 'center',
    fontWeight: '600',
  },
  footer: {
    alignItems: 'center',
    marginTop: SPACING.xl,
    paddingBottom: SPACING.lg,
  },
  motivationText: {
    fontSize: 16,
    color: COLORS.white,
    textAlign: 'center',
    lineHeight: 24,
    fontWeight: '500',
  },
  errorText: {
    color: '#EF4444',
    fontSize: 14,
    textAlign: 'center',
    marginBottom: SPACING.md,
    backgroundColor: '#FEE2E2',
    padding: SPACING.sm,
    borderRadius: BORDER_RADIUS.sm,
  },
});

export default LoginScreen;

