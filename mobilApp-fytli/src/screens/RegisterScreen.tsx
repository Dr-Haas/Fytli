import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, GRADIENTS, SPACING, BORDER_RADIUS } from '@config/theme';
import Input from '@components/Input';
import GradientButton from '@components/GradientButton';
import { useAuth } from '@/contexts/AuthContext';

interface RegisterScreenProps {
  navigation: any;
}

const RegisterScreen: React.FC<RegisterScreenProps> = ({ navigation }) => {
  const { register } = useAuth();
  const [firstname, setFirstname] = useState('');
  const [lastname, setLastname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    // Validation
    if (!firstname.trim()) {
      setError('Le prénom est requis');
      return;
    }
    if (!lastname.trim()) {
      setError('Le nom est requis');
      return;
    }
    if (!email.trim()) {
      setError('L\'email est requis');
      return;
    }
    if (password.length < 6) {
      setError('Le mot de passe doit contenir au moins 6 caractères');
      return;
    }

    setError('');
    setLoading(true);
    
    try {
      await register({
        email: email.trim(),
        password,
        firstname: firstname.trim(),
        lastname: lastname.trim(),
      });
      // La navigation se fera automatiquement grâce à AuthContext
    } catch (err: any) {
      console.error('Erreur inscription:', err);
      setError(err.response?.data?.error || 'Erreur lors de l\'inscription. Vérifiez vos informations.');
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
            showsVerticalScrollIndicator={false}
          >
            {/* Header */}
            <View style={styles.header}>
              <TouchableOpacity 
                style={styles.backButton} 
                onPress={() => navigation.goBack()}
              >
                <Text style={styles.backButtonText}>←</Text>
              </TouchableOpacity>
              
              <Text style={styles.logo}>fytli</Text>
              <Text style={styles.welcomeText}>Rejoins le mouvement</Text>
              <Text style={styles.subtitle}>
                Crée ton compte pour commencer ton parcours sportif
              </Text>
            </View>

            {/* Form */}
            <View style={styles.form}>
              {error ? <Text style={styles.errorText}>{error}</Text> : null}
              
              <View style={styles.row}>
                <Input
                  label="Prénom"
                  placeholder="Jean"
                  value={firstname}
                  onChangeText={setFirstname}
                  autoCapitalize="words"
                  containerStyle={styles.halfInput}
                />

                <Input
                  label="Nom"
                  placeholder="Dupont"
                  value={lastname}
                  onChangeText={setLastname}
                  autoCapitalize="words"
                  containerStyle={styles.halfInput}
                />
              </View>

              <Input
                label="Email"
                placeholder="exemple@email.com"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />

              <Input
                label="Mot de passe"
                placeholder="Min. 6 caractères"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
              />

              <GradientButton
                title="Créer mon compte"
                onPress={handleSubmit}
                size="large"
                style={styles.submitButton}
                loading={loading}
                disabled={loading || !firstname || !lastname || !email || !password}
              />

              <TouchableOpacity onPress={() => navigation.goBack()}>
                <Text style={styles.toggleText}>
                  Déjà un compte ? Connecte-toi
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
    paddingVertical: SPACING.lg,
  },
  header: {
    alignItems: 'center',
    marginTop: SPACING.lg,
    marginBottom: SPACING.xl,
  },
  backButton: {
    position: 'absolute',
    left: 0,
    top: 0,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  backButtonText: {
    fontSize: 24,
    color: COLORS.white,
  },
  logo: {
    fontSize: 48,
    fontWeight: 'bold',
    color: COLORS.white,
    letterSpacing: 2,
    marginBottom: SPACING.sm,
    marginTop: SPACING.xl,
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
    paddingHorizontal: SPACING.xl,
  },
  form: {
    flex: 1,
    marginTop: SPACING.lg,
  },
  row: {
    flexDirection: 'row',
    gap: SPACING.sm,
  },
  halfInput: {
    flex: 1,
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
    paddingVertical: SPACING.lg,
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

export default RegisterScreen;

