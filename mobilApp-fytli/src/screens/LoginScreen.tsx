import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
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
    <LinearGradient colors={GRADIENTS.soft} style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardView}
        >
          <View style={styles.content}>
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
          </View>
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
  content: {
    flex: 1,
    paddingHorizontal: SPACING.lg,
    justifyContent: 'space-between',
    paddingVertical: SPACING.xl,
  },
  header: {
    alignItems: 'center',
    marginTop: SPACING.xl,
  },
  logo: {
    fontSize: 48,
    fontWeight: 'bold',
    color: COLORS.orange,
    letterSpacing: 2,
    marginBottom: SPACING.md,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.warmText,
    textAlign: 'center',
    marginBottom: SPACING.xs,
  },
  subtitle: {
    fontSize: 14,
    color: COLORS.darkGray,
    textAlign: 'center',
  },
  form: {
    flex: 1,
    justifyContent: 'center',
  },
  submitButton: {
    marginTop: SPACING.md,
    marginBottom: SPACING.lg,
  },
  toggleText: {
    fontSize: 14,
    color: COLORS.orange,
    textAlign: 'center',
    fontWeight: '600',
  },
  footer: {
    alignItems: 'center',
    gap: SPACING.lg,
  },
  motivationText: {
    fontSize: 16,
    color: COLORS.warmText,
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

