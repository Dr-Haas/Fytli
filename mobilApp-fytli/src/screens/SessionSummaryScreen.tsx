import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert, Platform, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';
import { COLORS, GRADIENTS, SPACING, BORDER_RADIUS, SHADOWS } from '@config/theme';
import Card from '@components/Card';
import GradientButton from '@components/GradientButton';
import { completionsService, socialService } from '@/services';
import { Session } from '@/types/database';

interface SessionSummaryScreenProps {
  navigation: any;
  route: any;
}

type FeelingType = 'terrible' | 'bad' | 'okay' | 'good' | 'excellent';

const SessionSummaryScreen: React.FC<SessionSummaryScreenProps> = ({ navigation, route }) => {
  const { session, exercises, duration, programId } = route.params || {};
  
  const [notes, setNotes] = useState('');
  const [feeling, setFeeling] = useState<FeelingType>('good');
  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [completionId, setCompletionId] = useState<number | null>(null);
  const [streakCount, setStreakCount] = useState(0);
  const [feedUnlocked, setFeedUnlocked] = useState(false);

  // Demander les permissions au chargement
  useEffect(() => {
    requestPermissions();
  }, []);

  // Sauvegarder automatiquement la completion au chargement
  useEffect(() => {
    if (session && programId && !saved) {
      saveCompletion();
    }
  }, [session?.id, programId, saved]);

  const requestPermissions = async () => {
    const { status: cameraStatus } = await ImagePicker.requestCameraPermissionsAsync();
    const { status: libraryStatus } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (cameraStatus !== 'granted' || libraryStatus !== 'granted') {
      console.warn('⚠️ Permissions caméra/galerie non accordées');
    }
  };

  const saveCompletion = async () => {
    if (!session || !programId || saved) return;
    
    setSaving(true);
    try {
      const completion = await completionsService.create({
        program_id: programId,
        session_id: session.id,
        duration_minutes: duration,
        notes: notes || undefined,
        feeling: feeling,
        photo_url: photoUri || undefined,
      });

      setCompletionId(completion.id);
      setSaved(true);
      console.log('✅ Completion enregistrée:', completion);
      
      // Déverrouiller le feed social
      try {
        const feedResult = await socialService.unlockFeed(
          completion.id,
          `Séance terminée: ${session.title} 💪`,
          '🔥'
        );
        
        setStreakCount(feedResult.streak);
        setFeedUnlocked(feedResult.unlocked);
        console.log('✅ Feed déverrouillé - Streak:', feedResult.streak);
      } catch (feedError) {
        console.warn('⚠️ Impossible de déverrouiller le feed:', feedError);
        // Ne pas bloquer si le feed ne se déverrouille pas
      }
      
    } catch (error) {
      console.error('❌ Erreur sauvegarde completion:', error);
      Alert.alert('Erreur', 'Impossible d\'enregistrer la séance');
    } finally {
      setSaving(false);
    }
  };

  const updateCompletion = async () => {
    if (!completionId) return;
    
    try {
      await completionsService.update(completionId, {
        notes: notes || undefined,
        feeling: feeling,
        photo_url: photoUri || undefined,
      });
      console.log('✅ Completion mise à jour');
    } catch (error) {
      console.error('❌ Erreur mise à jour completion:', error);
      // Ne pas bloquer la navigation si la mise à jour échoue
    }
  };

  const takePhoto = async () => {
    try {
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        setPhotoUri(result.assets[0].uri);
        // Si déjà sauvegardé, mettre à jour
        if (completionId) {
          await updateCompletion();
        }
      }
    } catch (error) {
      console.error('❌ Erreur prise de photo:', error);
      Alert.alert('Erreur', 'Impossible d\'accéder à la caméra');
    }
  };

  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        setPhotoUri(result.assets[0].uri);
        // Si déjà sauvegardé, mettre à jour
        if (completionId) {
          await updateCompletion();
        }
      }
    } catch (error) {
      console.error('❌ Erreur sélection image:', error);
      Alert.alert('Erreur', 'Impossible d\'accéder à la galerie');
    }
  };

  const showPhotoOptions = () => {
    Alert.alert(
      'Ajouter une photo',
      'Choisis une option',
      [
        {
          text: 'Prendre une photo',
          onPress: takePhoto,
        },
        {
          text: 'Choisir depuis la galerie',
          onPress: pickImage,
        },
        {
          text: 'Annuler',
          style: 'cancel',
        },
      ]
    );
  };

  const removePhoto = () => {
    Alert.alert(
      'Supprimer la photo',
      'Veux-tu vraiment supprimer cette photo ?',
      [
        {
          text: 'Annuler',
          style: 'cancel',
        },
        {
          text: 'Supprimer',
          style: 'destructive',
          onPress: async () => {
            setPhotoUri(null);
            if (completionId) {
              await updateCompletion();
            }
          },
        },
      ]
    );
  };

  const handleReturnToDashboard = async () => {
    // Mettre à jour les notes et feeling avant de quitter
    if (completionId) {
      await updateCompletion();
    }
    navigation.navigate('Main');
  };

  const getFeelingEmoji = (feelingValue: string) => {
    const emojiMap: { [key: string]: string } = {
      'terrible': '😖',
      'bad': '😞',
      'okay': '😐',
      'good': '😊',
      'excellent': '🤩',
    };
    return emojiMap[feelingValue] || '💪';
  };

  if (!session) {
    return (
      <LinearGradient colors={[COLORS.cream, COLORS.white]} style={styles.container}>
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>Aucune session trouvée</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Main')}>
              <Text style={styles.linkText}>Retour au tableau de bord</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </LinearGradient>
    );
  }

  const feelings: { value: FeelingType; emoji: string; label: string }[] = [
    { value: 'terrible', emoji: '😖', label: 'Difficile' },
    { value: 'bad', emoji: '😞', label: 'Moyen' },
    { value: 'okay', emoji: '😐', label: 'Correct' },
    { value: 'good', emoji: '😊', label: 'Bien' },
    { value: 'excellent', emoji: '🤩', label: 'Excellent' },
  ];

  return (
    <LinearGradient colors={GRADIENTS.warm} style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Header de félicitations */}
          <View style={styles.header}>
            <Text style={styles.celebrationEmoji}>🎉</Text>
            <Text style={styles.title}>Bravo !</Text>
            <Text style={styles.subtitle}>
              Tu as terminé la séance{'\n'}
              <Text style={styles.sessionName}>{session.title}</Text>
            </Text>
          </View>

          {/* Stats de la séance */}
          <View style={styles.statsContainer}>
            <Card style={styles.statCard}>
              <Text style={styles.statIcon}>⏱️</Text>
              <Text style={styles.statValue}>{duration || 0}</Text>
              <Text style={styles.statLabel}>minutes</Text>
            </Card>
            <Card style={styles.statCard}>
              <Text style={styles.statIcon}>💪</Text>
              <Text style={styles.statValue}>{exercises?.length || 0}</Text>
              <Text style={styles.statLabel}>exercices</Text>
            </Card>
            {feedUnlocked && (
              <Card style={styles.statCard}>
                <Text style={styles.statIcon}>🔥</Text>
                <Text style={styles.statValue}>{streakCount}</Text>
                <Text style={styles.statLabel}>streak</Text>
              </Card>
            )}
          </View>

          {/* Photo */}
          <Card style={styles.section}>
            <Text style={styles.sectionTitle}>📸 Photo de la séance</Text>
            <Text style={styles.sectionSubtitle}>Immortalise ce moment !</Text>
            
            {photoUri ? (
              <View style={styles.photoContainer}>
                <Image source={{ uri: photoUri }} style={styles.photo} />
                <TouchableOpacity 
                  style={styles.removePhotoButton}
                  onPress={removePhoto}
                >
                  <Text style={styles.removePhotoText}>✕</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <TouchableOpacity 
                style={styles.addPhotoButton}
                onPress={showPhotoOptions}
              >
                <Text style={styles.addPhotoIcon}>📷</Text>
                <Text style={styles.addPhotoText}>Ajouter une photo</Text>
              </TouchableOpacity>
            )}
          </Card>

          {/* Comment tu te sens */}
          <Card style={styles.section}>
            <Text style={styles.sectionTitle}>Comment tu te sens ?</Text>
            <View style={styles.feelingsContainer}>
              {feelings.map((feel) => (
                <TouchableOpacity
                  key={feel.value}
                  style={[
                    styles.feelingButton,
                    feeling === feel.value && styles.feelingButtonActive,
                  ]}
                  onPress={() => setFeeling(feel.value)}
                >
                  <Text style={styles.feelingEmoji}>{feel.emoji}</Text>
                  <Text
                    style={[
                      styles.feelingLabel,
                      feeling === feel.value && styles.feelingLabelActive,
                    ]}
                  >
                    {feel.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </Card>

          {/* Notes */}
          <Card style={styles.section}>
            <Text style={styles.sectionTitle}>Notes personnelles</Text>
            <Text style={styles.sectionSubtitle}>Optionnel</Text>
            <TextInput
              style={styles.notesInput}
              placeholder="Comment s'est passée la séance ? Objectifs atteints ?"
              placeholderTextColor={COLORS.darkGray}
              value={notes}
              onChangeText={setNotes}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
              maxLength={500}
            />
            <Text style={styles.characterCount}>{notes.length}/500</Text>
          </Card>

          {/* Message de feed déverrouillé */}
          {feedUnlocked && (
            <Card style={styles.feedUnlockedCard}>
              <Text style={styles.feedUnlockedEmoji}>🎊</Text>
              <Text style={styles.feedUnlockedText}>
                Feed déverrouillé !{'\n'}
                Ton activité est maintenant visible par tes amis
              </Text>
            </Card>
          )}

          {/* Bouton de retour */}
          <GradientButton
            title="Terminer"
            onPress={handleReturnToDashboard}
            size="large"
            style={styles.finishButton}
            disabled={saving}
            loading={saving}
          />

          <View style={styles.motivationContainer}>
            <Text style={styles.motivationText}>
              "Chaque séance compte. Continue comme ça ! 💪"
            </Text>
          </View>
        </ScrollView>
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
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: SPACING.xl * 2,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: SPACING.xl,
  },
  errorText: {
    fontSize: 18,
    color: COLORS.warmText,
    marginBottom: SPACING.md,
    textAlign: 'center',
  },
  linkText: {
    fontSize: 16,
    color: COLORS.orange,
    fontWeight: '600',
  },
  header: {
    alignItems: 'center',
    paddingVertical: SPACING.xl,
    paddingHorizontal: SPACING.lg,
  },
  celebrationEmoji: {
    fontSize: 64,
    marginBottom: SPACING.md,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: COLORS.white,
    marginBottom: SPACING.xs,
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  subtitle: {
    fontSize: 16,
    color: COLORS.white,
    textAlign: 'center',
    lineHeight: 24,
  },
  sessionName: {
    fontWeight: 'bold',
    fontSize: 18,
  },
  statsContainer: {
    flexDirection: 'row',
    gap: SPACING.sm,
    paddingHorizontal: SPACING.lg,
    marginBottom: SPACING.lg,
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: SPACING.md,
  },
  statIcon: {
    fontSize: 32,
    marginBottom: SPACING.xs,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.warmText,
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 12,
    color: COLORS.darkGray,
  },
  section: {
    marginHorizontal: SPACING.lg,
    marginBottom: SPACING.md,
    padding: SPACING.lg,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.warmText,
    marginBottom: SPACING.xs,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: COLORS.darkGray,
    marginBottom: SPACING.md,
  },
  // Photo
  photoContainer: {
    position: 'relative',
    borderRadius: BORDER_RADIUS.lg,
    overflow: 'hidden',
  },
  photo: {
    width: '100%',
    height: 200,
    borderRadius: BORDER_RADIUS.lg,
  },
  removePhotoButton: {
    position: 'absolute',
    top: SPACING.sm,
    right: SPACING.sm,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  removePhotoText: {
    color: COLORS.white,
    fontSize: 18,
    fontWeight: 'bold',
  },
  addPhotoButton: {
    backgroundColor: COLORS.cream,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.xl,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: COLORS.orange,
    borderStyle: 'dashed',
  },
  addPhotoIcon: {
    fontSize: 48,
    marginBottom: SPACING.sm,
  },
  addPhotoText: {
    fontSize: 16,
    color: COLORS.orange,
    fontWeight: '600',
  },
  // Feelings
  feelingsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.sm,
  },
  feelingButton: {
    flex: 1,
    minWidth: 70,
    backgroundColor: COLORS.cream,
    borderRadius: BORDER_RADIUS.lg,
    paddingVertical: SPACING.md,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  feelingButtonActive: {
    borderColor: COLORS.orange,
    backgroundColor: '#FFF5F0',
  },
  feelingEmoji: {
    fontSize: 32,
    marginBottom: SPACING.xs,
  },
  feelingLabel: {
    fontSize: 12,
    color: COLORS.darkGray,
    fontWeight: '600',
  },
  feelingLabelActive: {
    color: COLORS.orange,
  },
  // Notes
  notesInput: {
    backgroundColor: COLORS.cream,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.md,
    fontSize: 16,
    color: COLORS.warmText,
    minHeight: 100,
  },
  characterCount: {
    fontSize: 12,
    color: COLORS.darkGray,
    textAlign: 'right',
    marginTop: SPACING.xs,
  },
  // Feed déverrouillé
  feedUnlockedCard: {
    marginHorizontal: SPACING.lg,
    marginBottom: SPACING.md,
    padding: SPACING.lg,
    backgroundColor: '#D1FAE5',
    alignItems: 'center',
  },
  feedUnlockedEmoji: {
    fontSize: 48,
    marginBottom: SPACING.sm,
  },
  feedUnlockedText: {
    fontSize: 16,
    color: '#065F46',
    fontWeight: '600',
    textAlign: 'center',
    lineHeight: 22,
  },
  // Boutons
  finishButton: {
    marginHorizontal: SPACING.lg,
    marginTop: SPACING.lg,
  },
  motivationContainer: {
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.lg,
    alignItems: 'center',
  },
  motivationText: {
    fontSize: 14,
    color: COLORS.white,
    fontStyle: 'italic',
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
});

export default SessionSummaryScreen;
