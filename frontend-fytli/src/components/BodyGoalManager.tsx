/**
 * Composant BodyGoalManager
 * Gestion des objectifs corporels
 */

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/Card';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { Label } from './ui/Label';
import { Spinner } from './ui/Spinner';
import bodyCompositionService, { BodyGoal, GoalProgress } from '../services/bodyComposition';
import { showToast } from '../utils/toast';
import { Target, Plus, CheckCircle, X, Calendar, TrendingDown } from 'lucide-react';

export const BodyGoalManager = () => {
  const [loading, setLoading] = useState(true);
  const [activeGoal, setActiveGoal] = useState<(BodyGoal & { progress?: GoalProgress }) | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    goal_type: 'weight_loss' as BodyGoal['goal_type'],
    target_weight_kg: '',
    target_body_fat_percent: '',
    target_muscle_mass_kg: '',
    start_date: new Date().toISOString().split('T')[0],
    target_date: '',
    description: ''
  });

  useEffect(() => {
    loadActiveGoal();
  }, []);

  const loadActiveGoal = async () => {
    try {
      setLoading(true);
      const goal = await bodyCompositionService.getActiveGoal();
      setActiveGoal(goal);
    } catch (error) {
      console.error('Erreur lors du chargement de l\'objectif:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.target_date) {
      showToast.error('Veuillez définir une date cible');
      return;
    }

    if (!formData.target_weight_kg && !formData.target_body_fat_percent && !formData.target_muscle_mass_kg) {
      showToast.error('Veuillez définir au moins un objectif chiffré');
      return;
    }

    setSaving(true);
    try {
      await bodyCompositionService.createGoal({
        goal_type: formData.goal_type,
        target_weight_kg: formData.target_weight_kg ? parseFloat(formData.target_weight_kg) : null,
        target_body_fat_percent: formData.target_body_fat_percent ? parseFloat(formData.target_body_fat_percent) : null,
        target_muscle_mass_kg: formData.target_muscle_mass_kg ? parseFloat(formData.target_muscle_mass_kg) : null,
        start_date: formData.start_date,
        target_date: formData.target_date,
        description: formData.description || null
      });

      showToast.success('Objectif créé avec succès ! 🎯');
      setShowForm(false);
      loadActiveGoal();
      
      // Réinitialiser le formulaire
      setFormData({
        goal_type: 'weight_loss',
        target_weight_kg: '',
        target_body_fat_percent: '',
        target_muscle_mass_kg: '',
        start_date: new Date().toISOString().split('T')[0],
        target_date: '',
        description: ''
      });
    } catch (error: any) {
      console.error('Erreur lors de la création de l\'objectif:', error);
      showToast.error(error.response?.data?.message || 'Erreur lors de la création');
    } finally {
      setSaving(false);
    }
  };

  const handleCompleteGoal = async () => {
    if (!activeGoal) return;

    try {
      await bodyCompositionService.updateGoalStatus(activeGoal.id!, 'completed');
      showToast.success('Félicitations ! Objectif atteint ! 🎉');
      loadActiveGoal();
    } catch (error) {
      showToast.error('Erreur lors de la mise à jour');
    }
  };

  const handleAbandonGoal = async () => {
    if (!activeGoal) return;
    
    if (!confirm('Êtes-vous sûr de vouloir abandonner cet objectif ?')) {
      return;
    }

    try {
      await bodyCompositionService.updateGoalStatus(activeGoal.id!, 'abandoned');
      showToast.success('Objectif abandonné');
      loadActiveGoal();
    } catch (error) {
      showToast.error('Erreur lors de la mise à jour');
    }
  };

  if (loading) {
    return (
      <Card className="card-fytli">
        <CardContent className="p-8 flex items-center justify-center">
          <Spinner size="lg" />
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Objectif actif */}
      {activeGoal && !showForm && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className="card-fytli bg-gradient-to-br from-fytli-orange/10 to-amber-500/10 border-fytli-orange/30">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5 text-fytli-orange" />
                Objectif Actif
              </CardTitle>
              <CardDescription>
                {bodyCompositionService.getGoalTypeLabel(activeGoal.goal_type)}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Objectifs */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {activeGoal.target_weight_kg && (
                  <div className="p-3 rounded-lg bg-background/50 border border-border">
                    <p className="text-xs text-muted-foreground">Poids cible</p>
                    <p className="text-xl font-bold text-fytli-orange">
                      {activeGoal.target_weight_kg} kg
                    </p>
                  </div>
                )}
                {activeGoal.target_body_fat_percent && (
                  <div className="p-3 rounded-lg bg-background/50 border border-border">
                    <p className="text-xs text-muted-foreground">Masse grasse cible</p>
                    <p className="text-xl font-bold text-fytli-orange">
                      {activeGoal.target_body_fat_percent}%
                    </p>
                  </div>
                )}
                {activeGoal.target_muscle_mass_kg && (
                  <div className="p-3 rounded-lg bg-background/50 border border-border">
                    <p className="text-xs text-muted-foreground">Masse musculaire cible</p>
                    <p className="text-xl font-bold text-fytli-orange">
                      {activeGoal.target_muscle_mass_kg} kg
                    </p>
                  </div>
                )}
              </div>

              {/* Progression */}
              {activeGoal.progress && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Progression</span>
                    <span className="font-semibold">
                      {activeGoal.progress.progress_percent?.toFixed(0) || 0}%
                    </span>
                  </div>
                  <div className="w-full h-3 bg-background rounded-full overflow-hidden border border-border">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.min(activeGoal.progress.progress_percent || 0, 100)}%` }}
                      transition={{ duration: 1, ease: 'easeOut' }}
                      className="h-full bg-gradient-to-r from-fytli-red to-fytli-orange"
                    />
                  </div>
                </div>
              )}

              {/* Dates */}
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  <span>
                    {new Date(activeGoal.start_date).toLocaleDateString('fr-FR')} - {new Date(activeGoal.target_date).toLocaleDateString('fr-FR')}
                  </span>
                </div>
                {activeGoal.progress && (
                  <span className={`font-semibold ${
                    activeGoal.progress.days_remaining > 0 ? 'text-fytli-orange' : 'text-red-500'
                  }`}>
                    {activeGoal.progress.days_remaining > 0 
                      ? `${activeGoal.progress.days_remaining} jours restants`
                      : 'Échéance dépassée'
                    }
                  </span>
                )}
              </div>

              {/* Description */}
              {activeGoal.description && (
                <p className="text-sm text-muted-foreground italic">
                  {activeGoal.description}
                </p>
              )}

              {/* Actions */}
              <div className="flex gap-3 pt-4">
                <Button
                  onClick={handleCompleteGoal}
                  className="flex-1 bg-gradient-to-r from-green-600 to-emerald-500"
                >
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Marquer comme atteint
                </Button>
                <Button
                  onClick={handleAbandonGoal}
                  variant="outline"
                  className="flex-1"
                >
                  <X className="h-4 w-4 mr-2" />
                  Abandonner
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Bouton pour créer un nouvel objectif */}
      {!activeGoal && !showForm && (
        <Card className="card-fytli border-dashed">
          <CardContent className="p-8 text-center">
            <Target className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground mb-4">
              Vous n'avez pas d'objectif actif. Créez-en un pour suivre votre progression !
            </p>
            <Button
              onClick={() => setShowForm(true)}
              className="bg-gradient-to-r from-fytli-red to-fytli-orange"
            >
              <Plus className="h-4 w-4 mr-2" />
              Créer un objectif
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Formulaire de création */}
      {showForm && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className="card-fytli">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plus className="h-5 w-5 text-fytli-orange" />
                Créer un Objectif
              </CardTitle>
              <CardDescription>
                Définissez votre objectif de composition corporelle
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Type d'objectif */}
                <div className="space-y-2">
                  <Label htmlFor="goal_type">Type d'objectif</Label>
                  <select
                    id="goal_type"
                    value={formData.goal_type}
                    onChange={(e) => handleChange('goal_type', e.target.value)}
                    className="w-full px-3 py-2 bg-background border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-fytli-orange"
                  >
                    <option value="weight_loss">Perte de poids</option>
                    <option value="weight_gain">Prise de poids</option>
                    <option value="muscle_gain">Prise de masse musculaire</option>
                    <option value="fat_loss">Perte de masse grasse</option>
                    <option value="body_recomposition">Recomposition corporelle</option>
                    <option value="maintenance">Maintien</option>
                  </select>
                </div>

                {/* Objectifs chiffrés */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="target_weight_kg">Poids cible (kg)</Label>
                    <Input
                      id="target_weight_kg"
                      type="number"
                      step="0.1"
                      value={formData.target_weight_kg}
                      onChange={(e) => handleChange('target_weight_kg', e.target.value)}
                      placeholder="Ex: 75"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="target_body_fat_percent">Masse grasse cible (%)</Label>
                    <Input
                      id="target_body_fat_percent"
                      type="number"
                      step="0.1"
                      value={formData.target_body_fat_percent}
                      onChange={(e) => handleChange('target_body_fat_percent', e.target.value)}
                      placeholder="Ex: 15"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="target_muscle_mass_kg">Masse musculaire cible (kg)</Label>
                    <Input
                      id="target_muscle_mass_kg"
                      type="number"
                      step="0.1"
                      value={formData.target_muscle_mass_kg}
                      onChange={(e) => handleChange('target_muscle_mass_kg', e.target.value)}
                      placeholder="Ex: 40"
                    />
                  </div>
                </div>

                {/* Dates */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="start_date">Date de début</Label>
                    <Input
                      id="start_date"
                      type="date"
                      value={formData.start_date}
                      onChange={(e) => handleChange('start_date', e.target.value)}
                      max={new Date().toISOString().split('T')[0]}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="target_date">Date cible *</Label>
                    <Input
                      id="target_date"
                      type="date"
                      value={formData.target_date}
                      onChange={(e) => handleChange('target_date', e.target.value)}
                      min={formData.start_date}
                      required
                    />
                  </div>
                </div>

                {/* Description */}
                <div className="space-y-2">
                  <Label htmlFor="description">Description (optionnel)</Label>
                  <textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => handleChange('description', e.target.value)}
                    placeholder="Ex: Objectif pour l'été 2025..."
                    className="w-full min-h-[80px] px-3 py-2 bg-background border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-fytli-orange resize-none"
                  />
                </div>

                {/* Boutons */}
                <div className="flex gap-3 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowForm(false)}
                    className="flex-1"
                  >
                    Annuler
                  </Button>
                  <Button
                    type="submit"
                    disabled={saving}
                    className="flex-1 bg-gradient-to-r from-fytli-red to-fytli-orange"
                  >
                    {saving ? 'Création...' : '🎯 Créer l\'objectif'}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  );
};

