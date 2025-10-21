import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert, KeyboardAvoidingView, Platform, Modal } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, SPACING, BORDER_RADIUS, SHADOWS } from '@config/theme';
import GradientButton from '@components/GradientButton';
import Card from '@components/Card';
import { programsService, sessionsService, exercisesService } from '@/services';
import { Exercise } from '@/types/database';

interface CreateProgramScreenProps {
  navigation: any;
}

interface SessionData {
  title: string;
  description: string;
  day_number: number;
  exercises: SelectedExercise[];
}

interface SelectedExercise extends Exercise {
  sets: number;
  reps: number;
  rest_time_sec: number;
}

const CreateProgramScreen: React.FC<CreateProgramScreenProps> = ({ navigation }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [goal, setGoal] = useState('');
  const [level, setLevel] = useState<'beginner' | 'intermediate' | 'advanced'>('beginner');
  const [durationWeeks, setDurationWeeks] = useState('');
  
  const [sessions, setSessions] = useState<SessionData[]>([{
    title: 'Session 1',
    description: '',
    day_number: 1,
    exercises: []
  }]);
  
  const [availableExercises, setAvailableExercises] = useState<Exercise[]>([]);
  const [showExerciseModal, setShowExerciseModal] = useState(false);
  const [currentSessionIndex, setCurrentSessionIndex] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);

  const levels = [
    { value: 'beginner', label: 'Débutant', emoji: '🌱' },
    { value: 'intermediate', label: 'Intermédiaire', emoji: '💪' },
    { value: 'advanced', label: 'Avancé', emoji: '🔥' },
  ];

  useEffect(() => {
    loadExercises();
  }, []);

  const loadExercises = async () => {
    try {
      const exercises = await exercisesService.getAll();
      setAvailableExercises(exercises);
    } catch (error) {
      console.error('❌ Erreur chargement exercices:', error);
    }
  };

  const addSession = () => {
    setSessions([
      ...sessions,
      {
        title: `Session ${sessions.length + 1}`,
        description: '',
        day_number: sessions.length + 1,
        exercises: []
      }
    ]);
  };

  const removeSession = (index: number) => {
    if (sessions.length === 1) {
      Alert.alert('Erreur', 'Un programme doit avoir au moins une session');
      return;
    }
    const newSessions = sessions.filter((_, i) => i !== index);
    setSessions(newSessions);
  };

  const updateSession = (index: number, field: keyof SessionData, value: any) => {
    const newSessions = [...sessions];
    newSessions[index] = { ...newSessions[index], [field]: value };
    setSessions(newSessions);
  };

  const openExerciseModal = (sessionIndex: number) => {
    setCurrentSessionIndex(sessionIndex);
    setShowExerciseModal(true);
  };

  const addExerciseToSession = (exercise: Exercise) => {
    const newSessions = [...sessions];
    const session = newSessions[currentSessionIndex];
    
    if (session.exercises.find(e => e.id === exercise.id)) {
      Alert.alert('Info', 'Cet exercice est déjà ajouté à cette session');
      return;
    }
    
    session.exercises.push({
      ...exercise,
      sets: 3,
      reps: 12,
      rest_time_sec: 60
    });
    
    setSessions(newSessions);
    setShowExerciseModal(false);
    setSearchQuery('');
  };

  const removeExerciseFromSession = (sessionIndex: number, exerciseId: number) => {
    const newSessions = [...sessions];
    newSessions[sessionIndex].exercises = newSessions[sessionIndex].exercises.filter(e => e.id !== exerciseId);
    setSessions(newSessions);
  };

  const updateExerciseParams = (sessionIndex: number, exerciseId: number, field: string, value: number) => {
    const newSessions = [...sessions];
    const exerciseIndex = newSessions[sessionIndex].exercises.findIndex(e => e.id === exerciseId);
    if (exerciseIndex !== -1) {
      newSessions[sessionIndex].exercises[exerciseIndex] = {
        ...newSessions[sessionIndex].exercises[exerciseIndex],
        [field]: value
      };
      setSessions(newSessions);
    }
  };

  const filteredExercises = availableExercises.filter(exercise =>
    exercise.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    exercise.muscle_group?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCreateProgram = async () => {
    // Validation
    if (!title.trim()) {
      Alert.alert('Erreur', 'Le titre est requis');
      return;
    }

    if (!description.trim()) {
      Alert.alert('Erreur', 'La description est requise');
      return;
    }

    if (!durationWeeks || parseInt(durationWeeks) <= 0) {
      Alert.alert('Erreur', 'La durée doit être un nombre positif');
      return;
    }

    if (sessions.some(s => s.exercises.length === 0)) {
      Alert.alert('Erreur', 'Chaque session doit avoir au moins un exercice');
      return;
    }

    setLoading(true);

    try {
      // 1. Créer le programme
      const program = await programsService.create({
        title: title.trim(),
        description: description.trim(),
        goal: goal.trim() || null,
        level,
        duration_weeks: parseInt(durationWeeks),
      });

      // 2. Créer les sessions et leurs exercices
      for (const sessionData of sessions) {
        const session = await sessionsService.create({
          program_id: program.id,
          title: sessionData.title,
          description: sessionData.description,
          day_number: sessionData.day_number,
          order_index: sessionData.day_number,
        });

        // 3. Ajouter les exercices à la session
        for (let i = 0; i < sessionData.exercises.length; i++) {
          const exercise = sessionData.exercises[i];
          await sessionsService.addExercise({
            session_id: session.id,
            exercise_id: exercise.id,
            sets: exercise.sets,
            reps: exercise.reps,
            rest_time_sec: exercise.rest_time_sec,
            order_index: i + 1,
          });
        }
      }

      Alert.alert(
        'Succès',
        'Le programme et ses sessions ont été créés avec succès !',
        [
          {
            text: 'OK',
            onPress: () => navigation.goBack(),
          },
        ]
      );
    } catch (error: any) {
      console.error('❌ Erreur création programme:', error);
      Alert.alert('Erreur', error.message || 'Une erreur est survenue lors de la création du programme');
    } finally {
      setLoading(false);
    }
  };

  return (
    <LinearGradient colors={[COLORS.cream, COLORS.white]} style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardView}
        >
          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
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
              <Text style={styles.title}>Créer un programme</Text>
              <Text style={styles.subtitle}>Configure ton nouveau programme d'entraînement</Text>
            </View>

            {/* Form */}
            <View style={styles.form}>
              {/* Titre */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Titre du programme *</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Ex: Prise de masse"
                  placeholderTextColor={COLORS.darkGray}
                  value={title}
                  onChangeText={setTitle}
                  maxLength={100}
                />
              </View>

              {/* Description */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Description *</Text>
                <TextInput
                  style={[styles.input, styles.textArea]}
                  placeholder="Décris les objectifs et le contenu du programme..."
                  placeholderTextColor={COLORS.darkGray}
                  value={description}
                  onChangeText={setDescription}
                  multiline
                  numberOfLines={4}
                  textAlignVertical="top"
                  maxLength={500}
                />
              </View>

              {/* Objectif */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Objectif principal</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Ex: Développer la force et la masse musculaire"
                  placeholderTextColor={COLORS.darkGray}
                  value={goal}
                  onChangeText={setGoal}
                  maxLength={200}
                />
              </View>

              {/* Niveau */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Niveau *</Text>
                <View style={styles.levelSelector}>
                  {levels.map((lvl) => (
                    <TouchableOpacity
                      key={lvl.value}
                      style={[
                        styles.levelButton,
                        level === lvl.value && styles.levelButtonActive,
                      ]}
                      onPress={() => setLevel(lvl.value as any)}
                    >
                      <Text style={styles.levelEmoji}>{lvl.emoji}</Text>
                      <Text
                        style={[
                          styles.levelButtonText,
                          level === lvl.value && styles.levelButtonTextActive,
                        ]}
                      >
                        {lvl.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Durée */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Durée (en semaines) *</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Ex: 12"
                  placeholderTextColor={COLORS.darkGray}
                  value={durationWeeks}
                  onChangeText={setDurationWeeks}
                  keyboardType="number-pad"
                  maxLength={3}
                />
              </View>

              {/* Sessions */}
              <View style={styles.inputGroup}>
                <View style={styles.sectionHeader}>
                  <Text style={styles.label}>Sessions *</Text>
                  <TouchableOpacity onPress={addSession} style={styles.addButton}>
                    <Text style={styles.addButtonText}>+ Ajouter une session</Text>
                  </TouchableOpacity>
                </View>

                {sessions.map((session, sessionIndex) => (
                  <Card key={sessionIndex} style={styles.sessionCard}>
                    <View style={styles.sessionHeader}>
                      <TextInput
                        style={styles.sessionTitleInput}
                        value={session.title}
                        onChangeText={(text) => updateSession(sessionIndex, 'title', text)}
                        placeholder="Titre de la session"
                        placeholderTextColor={COLORS.darkGray}
                      />
                      {sessions.length > 1 && (
                        <TouchableOpacity onPress={() => removeSession(sessionIndex)}>
                          <Text style={styles.removeButton}>🗑️</Text>
                        </TouchableOpacity>
                      )}
                    </View>

                    <TextInput
                      style={styles.sessionDescInput}
                      value={session.description}
                      onChangeText={(text) => updateSession(sessionIndex, 'description', text)}
                      placeholder="Description (optionnelle)"
                      placeholderTextColor={COLORS.darkGray}
                      multiline
                    />

                    {/* Exercices de la session */}
                    <View style={styles.exercisesSection}>
                      <Text style={styles.exercisesLabel}>
                        Exercices ({session.exercises.length})
                      </Text>
                      
                      {session.exercises.map((exercise, exerciseIndex) => (
                        <View key={exercise.id} style={styles.exerciseItem}>
                          <View style={styles.exerciseInfo}>
                            <Text style={styles.exerciseName}>{exercise.name}</Text>
                            <Text style={styles.exerciseMuscle}>{exercise.muscle_group}</Text>
                            
                            <View style={styles.exerciseParams}>
                              <View style={styles.paramItem}>
                                <Text style={styles.paramLabel}>Sets:</Text>
                                <TextInput
                                  style={styles.paramInput}
                                  value={String(exercise.sets)}
                                  onChangeText={(text) => updateExerciseParams(sessionIndex, exercise.id, 'sets', parseInt(text) || 0)}
                                  keyboardType="number-pad"
                                  maxLength={2}
                                />
                              </View>
                              <View style={styles.paramItem}>
                                <Text style={styles.paramLabel}>Reps:</Text>
                                <TextInput
                                  style={styles.paramInput}
                                  value={String(exercise.reps)}
                                  onChangeText={(text) => updateExerciseParams(sessionIndex, exercise.id, 'reps', parseInt(text) || 0)}
                                  keyboardType="number-pad"
                                  maxLength={3}
                                />
                              </View>
                              <View style={styles.paramItem}>
                                <Text style={styles.paramLabel}>Repos (s):</Text>
                                <TextInput
                                  style={styles.paramInput}
                                  value={String(exercise.rest_time_sec)}
                                  onChangeText={(text) => updateExerciseParams(sessionIndex, exercise.id, 'rest_time_sec', parseInt(text) || 0)}
                                  keyboardType="number-pad"
                                  maxLength={3}
                                />
                              </View>
                            </View>
                          </View>
                          
                          <TouchableOpacity 
                            onPress={() => removeExerciseFromSession(sessionIndex, exercise.id)}
                            style={styles.removeExerciseButton}
                          >
                            <Text style={styles.removeExerciseText}>✕</Text>
                          </TouchableOpacity>
                        </View>
                      ))}

                      <TouchableOpacity 
                        style={styles.addExerciseButton}
                        onPress={() => openExerciseModal(sessionIndex)}
                      >
                        <Text style={styles.addExerciseText}>+ Ajouter un exercice</Text>
                      </TouchableOpacity>
                    </View>
                  </Card>
                ))}
              </View>

              {/* Bouton de création */}
              <GradientButton
                title="Créer le programme complet"
                onPress={handleCreateProgram}
                loading={loading}
                disabled={loading || !title.trim() || !description.trim() || !durationWeeks || sessions.some(s => s.exercises.length === 0)}
                size="large"
                style={styles.createButton}
              />
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>

      {/* Modal de sélection d'exercices */}
      <Modal
        visible={showExerciseModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowExerciseModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Ajouter un exercice</Text>
              <TouchableOpacity onPress={() => setShowExerciseModal(false)}>
                <Text style={styles.modalClose}>✕</Text>
              </TouchableOpacity>
            </View>

            <TextInput
              style={styles.searchInput}
              placeholder="Rechercher un exercice..."
              placeholderTextColor={COLORS.darkGray}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />

            <ScrollView style={styles.exercisesList}>
              {filteredExercises.map((exercise) => (
                <TouchableOpacity
                  key={exercise.id}
                  style={styles.exerciseListItem}
                  onPress={() => addExerciseToSession(exercise)}
                >
                  <Text style={styles.exerciseListName}>{exercise.name}</Text>
                  <Text style={styles.exerciseListMuscle}>{exercise.muscle_group}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>
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
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: SPACING.xl,
  },
  header: {
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.lg,
    paddingBottom: SPACING.md,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.white,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.md,
    ...SHADOWS.sm,
  },
  backButtonText: {
    fontSize: 24,
    color: COLORS.warmText,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.warmText,
    marginBottom: SPACING.xs,
  },
  subtitle: {
    fontSize: 14,
    color: COLORS.darkGray,
  },
  form: {
    paddingHorizontal: SPACING.lg,
  },
  inputGroup: {
    marginBottom: SPACING.lg,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.warmText,
    marginBottom: SPACING.sm,
  },
  input: {
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.lg,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.md,
    fontSize: 16,
    color: COLORS.warmText,
    ...SHADOWS.sm,
  },
  textArea: {
    minHeight: 100,
    paddingTop: SPACING.md,
  },
  levelSelector: {
    flexDirection: 'row',
    gap: SPACING.sm,
  },
  levelButton: {
    flex: 1,
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.lg,
    paddingVertical: SPACING.md,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
    ...SHADOWS.sm,
  },
  levelButtonActive: {
    borderColor: COLORS.orange,
    backgroundColor: '#FFF5F0',
  },
  levelEmoji: {
    fontSize: 24,
    marginBottom: SPACING.xs,
  },
  levelButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.darkGray,
  },
  levelButtonTextActive: {
    color: COLORS.orange,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  addButton: {
    backgroundColor: COLORS.orange,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: BORDER_RADIUS.md,
  },
  addButtonText: {
    color: COLORS.white,
    fontSize: 12,
    fontWeight: '600',
  },
  sessionCard: {
    marginBottom: SPACING.md,
    padding: SPACING.md,
  },
  sessionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  sessionTitleInput: {
    flex: 1,
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.warmText,
    padding: 0,
  },
  removeButton: {
    fontSize: 20,
    marginLeft: SPACING.sm,
  },
  sessionDescInput: {
    fontSize: 14,
    color: COLORS.darkGray,
    marginBottom: SPACING.md,
  },
  exercisesSection: {
    marginTop: SPACING.sm,
  },
  exercisesLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.warmText,
    marginBottom: SPACING.sm,
  },
  exerciseItem: {
    flexDirection: 'row',
    backgroundColor: COLORS.cream,
    padding: SPACING.sm,
    borderRadius: BORDER_RADIUS.md,
    marginBottom: SPACING.sm,
  },
  exerciseInfo: {
    flex: 1,
  },
  exerciseName: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.warmText,
    marginBottom: 2,
  },
  exerciseMuscle: {
    fontSize: 12,
    color: COLORS.darkGray,
    marginBottom: SPACING.sm,
  },
  exerciseParams: {
    flexDirection: 'row',
    gap: SPACING.sm,
  },
  paramItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  paramLabel: {
    fontSize: 12,
    color: COLORS.darkGray,
    marginRight: 4,
  },
  paramInput: {
    backgroundColor: COLORS.white,
    borderRadius: 4,
    padding: 4,
    width: 40,
    textAlign: 'center',
    fontSize: 12,
  },
  removeExerciseButton: {
    justifyContent: 'center',
    paddingLeft: SPACING.sm,
  },
  removeExerciseText: {
    fontSize: 18,
    color: COLORS.red,
  },
  addExerciseButton: {
    backgroundColor: COLORS.white,
    padding: SPACING.sm,
    borderRadius: BORDER_RADIUS.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.orange,
    borderStyle: 'dashed',
  },
  addExerciseText: {
    color: COLORS.orange,
    fontSize: 14,
    fontWeight: '600',
  },
  createButton: {
    marginTop: SPACING.md,
  },
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: COLORS.white,
    borderTopLeftRadius: BORDER_RADIUS.xl,
    borderTopRightRadius: BORDER_RADIUS.xl,
    maxHeight: '80%',
    padding: SPACING.lg,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.warmText,
  },
  modalClose: {
    fontSize: 24,
    color: COLORS.darkGray,
  },
  searchInput: {
    backgroundColor: COLORS.cream,
    borderRadius: BORDER_RADIUS.lg,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    fontSize: 16,
    marginBottom: SPACING.md,
  },
  exercisesList: {
    maxHeight: 400,
  },
  exerciseListItem: {
    padding: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.cream,
  },
  exerciseListName: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.warmText,
    marginBottom: 4,
  },
  exerciseListMuscle: {
    fontSize: 14,
    color: COLORS.darkGray,
  },
});

export default CreateProgramScreen;
