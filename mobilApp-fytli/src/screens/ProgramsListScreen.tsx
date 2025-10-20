import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, ActivityIndicator, RefreshControl } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, GRADIENTS, SPACING, BORDER_RADIUS, SHADOWS } from '@config/theme';
import Card from '@components/Card';
import { programsService } from '@/services';
import { Program } from '@/types/database';

interface ProgramsListScreenProps {
  navigation: any;
}

const ProgramsListScreen: React.FC<ProgramsListScreenProps> = ({ navigation }) => {
  const [programs, setPrograms] = useState<Program[]>([]);
  const [filteredPrograms, setFilteredPrograms] = useState<Program[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchPrograms();
  }, []);

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredPrograms(programs);
    } else {
      const filtered = programs.filter((program) =>
        program.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        program.description?.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredPrograms(filtered);
    }
  }, [searchQuery, programs]);

  const fetchPrograms = async () => {
    try {
      const data = await programsService.getAll();
      setPrograms(data);
      setFilteredPrograms(data);
    } catch (error) {
      console.error('❌ Erreur lors du chargement des programmes:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchPrograms();
  };

  const getLevelLabel = (level?: string) => {
    switch (level) {
      case 'beginner': return 'Débutant';
      case 'intermediate': return 'Intermédiaire';
      case 'advanced': return 'Avancé';
      default: return 'Non défini';
    }
  };

  const getLevelColor = (level?: string) => {
    switch (level) {
      case 'beginner': return styles.levelBeginner;
      case 'intermediate': return styles.levelIntermediate;
      case 'advanced': return styles.levelAdvanced;
      default: return styles.levelDefault;
    }
  };

  if (loading) {
    return (
      <LinearGradient colors={[COLORS.cream, COLORS.white]} style={styles.container}>
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={COLORS.orange} />
            <Text style={styles.loadingText}>Chargement des programmes...</Text>
          </View>
        </SafeAreaView>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient colors={[COLORS.cream, COLORS.white]} style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={COLORS.orange} />
          }
        >
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>Programmes</Text>
            <Text style={styles.subtitle}>Choisis ton programme d'entraînement</Text>
          </View>

          {/* Search Bar */}
          <View style={styles.searchContainer}>
            <Text style={styles.searchIcon}>🔍</Text>
            <TextInput
              style={styles.searchInput}
              placeholder="Rechercher un programme..."
              placeholderTextColor={COLORS.darkGray}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>

          {/* Programs List */}
          {filteredPrograms.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyIcon}>💪</Text>
              <Text style={styles.emptyText}>
                {searchQuery ? 'Aucun programme trouvé' : 'Aucun programme disponible'}
              </Text>
            </View>
          ) : (
            <View style={styles.programsList}>
              {filteredPrograms.map((program, index) => (
                <TouchableOpacity
                  key={program.id}
                  activeOpacity={0.7}
                  onPress={() => navigation.navigate('ProgramDetail', { programId: program.id })}
                >
                  <Card style={styles.programCard}>
                    <View style={styles.programHeader}>
                      <View style={styles.programIconContainer}>
                        <LinearGradient colors={GRADIENTS.primary} style={styles.programIcon}>
                          <Text style={styles.programIconText}>💪</Text>
                        </LinearGradient>
                      </View>
                      <View style={styles.programInfo}>
                        <Text style={styles.programTitle} numberOfLines={1}>
                          {program.title}
                        </Text>
                        {program.level && (
                          <View style={[styles.levelBadge, getLevelColor(program.level)]}>
                            <Text style={styles.levelText}>{getLevelLabel(program.level)}</Text>
                          </View>
                        )}
                      </View>
                    </View>

                    {program.description && (
                      <Text style={styles.programDescription} numberOfLines={2}>
                        {program.description}
                      </Text>
                    )}

                    {program.goal && (
                      <View style={styles.goalContainer}>
                        <Text style={styles.goalIcon}>🎯</Text>
                        <Text style={styles.goalText} numberOfLines={1}>
                          {program.goal}
                        </Text>
                      </View>
                    )}

                    <View style={styles.programFooter}>
                      {program.duration_weeks && (
                        <View style={styles.footerItem}>
                          <Text style={styles.footerIcon}>📅</Text>
                          <Text style={styles.footerText}>{program.duration_weeks} sem.</Text>
                        </View>
                      )}
                      <View style={styles.arrowContainer}>
                        <Text style={styles.arrow}>→</Text>
                      </View>
                    </View>
                  </Card>
                </TouchableOpacity>
              ))}
            </View>
          )}
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
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING.xl,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: SPACING.md,
    fontSize: 14,
    color: COLORS.darkGray,
  },
  header: {
    marginTop: SPACING.lg,
    marginBottom: SPACING.lg,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: COLORS.warmText,
    marginBottom: SPACING.xs,
  },
  subtitle: {
    fontSize: 14,
    color: COLORS.darkGray,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.lg,
    paddingHorizontal: SPACING.md,
    marginBottom: SPACING.lg,
    ...SHADOWS.sm,
  },
  searchIcon: {
    fontSize: 20,
    marginRight: SPACING.sm,
  },
  searchInput: {
    flex: 1,
    paddingVertical: SPACING.md,
    fontSize: 16,
    color: COLORS.warmText,
  },
  programsList: {
    gap: SPACING.md,
  },
  programCard: {
    marginBottom: SPACING.md,
  },
  programHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  programIconContainer: {
    marginRight: SPACING.md,
  },
  programIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  programIconText: {
    fontSize: 24,
  },
  programInfo: {
    flex: 1,
    gap: SPACING.xs,
  },
  programTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.warmText,
  },
  levelBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: SPACING.sm,
    paddingVertical: 4,
    borderRadius: BORDER_RADIUS.sm,
  },
  levelBeginner: {
    backgroundColor: '#D1FAE5',
  },
  levelIntermediate: {
    backgroundColor: '#DBEAFE',
  },
  levelAdvanced: {
    backgroundColor: '#FCE7F3',
  },
  levelDefault: {
    backgroundColor: '#F3F4F6',
  },
  levelText: {
    fontSize: 10,
    fontWeight: '600',
    color: COLORS.warmText,
  },
  programDescription: {
    fontSize: 14,
    color: COLORS.darkGray,
    marginBottom: SPACING.sm,
    lineHeight: 20,
  },
  goalContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.cream,
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: BORDER_RADIUS.sm,
    marginBottom: SPACING.sm,
  },
  goalIcon: {
    fontSize: 14,
    marginRight: SPACING.xs,
  },
  goalText: {
    fontSize: 12,
    color: COLORS.warmText,
    fontWeight: '500',
    flex: 1,
  },
  programFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  footerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
  },
  footerIcon: {
    fontSize: 14,
  },
  footerText: {
    fontSize: 12,
    color: COLORS.darkGray,
  },
  arrowContainer: {
    backgroundColor: COLORS.orange,
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  arrow: {
    fontSize: 16,
    color: COLORS.white,
    fontWeight: 'bold',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: SPACING.xl * 2,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: SPACING.md,
    opacity: 0.5,
  },
  emptyText: {
    fontSize: 16,
    color: COLORS.darkGray,
    textAlign: 'center',
  },
});

export default ProgramsListScreen;

