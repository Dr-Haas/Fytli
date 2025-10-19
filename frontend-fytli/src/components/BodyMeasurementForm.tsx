/**
 * Composant BodyMeasurementForm
 * Formulaire de saisie des mesures corporelles
 */

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { Label } from './ui/Label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/Card';
import bodyCompositionService, { BodyMeasurement } from '../services/bodyComposition';
import { showToast } from '../utils/toast';
import { Scale, Ruler, Percent, Activity, X } from 'lucide-react';

interface BodyMeasurementFormProps {
  onSuccess?: (measurement: BodyMeasurement) => void;
  onCancel?: () => void;
  initialData?: BodyMeasurement;
}

export const BodyMeasurementForm = ({ onSuccess, onCancel, initialData }: BodyMeasurementFormProps) => {
  const [loading, setLoading] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);
  
  const [formData, setFormData] = useState<BodyMeasurement>({
    weight_kg: initialData?.weight_kg || 0,
    height_cm: initialData?.height_cm || 0,
    body_fat_percent: initialData?.body_fat_percent || null,
    lean_mass_percent: initialData?.lean_mass_percent || null,
    muscle_mass_kg: initialData?.muscle_mass_kg || null,
    waist_cm: initialData?.waist_cm || null,
    chest_cm: initialData?.chest_cm || null,
    hips_cm: initialData?.hips_cm || null,
    arms_cm: initialData?.arms_cm || null,
    thighs_cm: initialData?.thighs_cm || null,
    notes: initialData?.notes || '',
    measurement_date: initialData?.measurement_date || new Date().toISOString().split('T')[0]
  });

  // Calcul automatique de l'IMC
  const calculatedBMI = formData.weight_kg && formData.height_cm 
    ? bodyCompositionService.calculateBMI(formData.weight_kg, formData.height_cm)
    : 0;

  const bmiInterpretation = calculatedBMI > 0 
    ? bodyCompositionService.interpretBMI(calculatedBMI) 
    : null;

  const handleChange = (field: keyof BodyMeasurement, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value === '' ? null : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.weight_kg || !formData.height_cm) {
      showToast.error('Le poids et la taille sont requis');
      return;
    }

    if (formData.weight_kg < 20 || formData.weight_kg > 300) {
      showToast.error('Le poids doit être entre 20 et 300 kg');
      return;
    }

    if (formData.height_cm < 100 || formData.height_cm > 250) {
      showToast.error('La taille doit être entre 100 et 250 cm');
      return;
    }

    setLoading(true);
    try {
      const response = await bodyCompositionService.createMeasurement(formData);
      showToast.success('Mesure enregistrée avec succès ! 📊');
      
      if (onSuccess) {
        onSuccess(response.data);
      }
    } catch (error: any) {
      console.error('Erreur lors de l\'enregistrement:', error);
      showToast.error(error.response?.data?.message || 'Erreur lors de l\'enregistrement');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="card-fytli">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Scale className="h-5 w-5 text-fytli-orange" />
                Nouvelle Mesure
              </CardTitle>
              <CardDescription>
                Enregistrez vos mesures pour suivre votre progression
              </CardDescription>
            </div>
            {onCancel && (
              <button
                onClick={onCancel}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            )}
          </div>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Date de mesure */}
            <div className="space-y-2">
              <Label htmlFor="measurement_date">Date de la mesure</Label>
              <Input
                id="measurement_date"
                type="date"
                value={typeof formData.measurement_date === 'string' ? formData.measurement_date.split('T')[0] : ''}
                onChange={(e) => handleChange('measurement_date', e.target.value)}
                max={new Date().toISOString().split('T')[0]}
              />
            </div>

            {/* Mesures principales */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="weight_kg" className="flex items-center gap-2">
                  <Scale className="h-4 w-4" />
                  Poids (kg) *
                </Label>
                <Input
                  id="weight_kg"
                  type="number"
                  step="0.1"
                  min="20"
                  max="300"
                  value={formData.weight_kg || ''}
                  onChange={(e) => handleChange('weight_kg', parseFloat(e.target.value))}
                  placeholder="Ex: 75.5"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="height_cm" className="flex items-center gap-2">
                  <Ruler className="h-4 w-4" />
                  Taille (cm) *
                </Label>
                <Input
                  id="height_cm"
                  type="number"
                  step="0.1"
                  min="100"
                  max="250"
                  value={formData.height_cm || ''}
                  onChange={(e) => handleChange('height_cm', parseFloat(e.target.value))}
                  placeholder="Ex: 175"
                  required
                />
              </div>
            </div>

            {/* IMC calculé */}
            {calculatedBMI > 0 && bmiInterpretation && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-4 rounded-lg bg-gradient-to-r from-background to-card border border-border"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">IMC calculé</p>
                    <p className="text-2xl font-bold" style={{ color: bmiInterpretation.color }}>
                      {calculatedBMI}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold" style={{ color: bmiInterpretation.color }}>
                      {bmiInterpretation.category}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {bmiInterpretation.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Composition corporelle */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="body_fat_percent" className="flex items-center gap-2">
                  <Percent className="h-4 w-4" />
                  Masse grasse (%)
                </Label>
                <Input
                  id="body_fat_percent"
                  type="number"
                  step="0.1"
                  min="0"
                  max="100"
                  value={formData.body_fat_percent || ''}
                  onChange={(e) => handleChange('body_fat_percent', parseFloat(e.target.value))}
                  placeholder="Ex: 18.5"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="muscle_mass_kg" className="flex items-center gap-2">
                  <Activity className="h-4 w-4" />
                  Masse musculaire (kg)
                </Label>
                <Input
                  id="muscle_mass_kg"
                  type="number"
                  step="0.1"
                  min="0"
                  value={formData.muscle_mass_kg || ''}
                  onChange={(e) => handleChange('muscle_mass_kg', parseFloat(e.target.value))}
                  placeholder="Ex: 35.2"
                />
              </div>
            </div>

            {/* Mesures avancées (optionnel) */}
            <div>
              <button
                type="button"
                onClick={() => setShowAdvanced(!showAdvanced)}
                className="text-sm text-fytli-orange hover:text-fytli-red transition-colors"
              >
                {showAdvanced ? '− Masquer' : '+ Afficher'} les mesures détaillées (optionnel)
              </button>
            </div>

            {showAdvanced && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="space-y-4 pt-4 border-t border-border"
              >
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="waist_cm">Tour de taille (cm)</Label>
                    <Input
                      id="waist_cm"
                      type="number"
                      step="0.1"
                      value={formData.waist_cm || ''}
                      onChange={(e) => handleChange('waist_cm', parseFloat(e.target.value))}
                      placeholder="Ex: 80"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="chest_cm">Tour de poitrine (cm)</Label>
                    <Input
                      id="chest_cm"
                      type="number"
                      step="0.1"
                      value={formData.chest_cm || ''}
                      onChange={(e) => handleChange('chest_cm', parseFloat(e.target.value))}
                      placeholder="Ex: 95"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="hips_cm">Tour de hanches (cm)</Label>
                    <Input
                      id="hips_cm"
                      type="number"
                      step="0.1"
                      value={formData.hips_cm || ''}
                      onChange={(e) => handleChange('hips_cm', parseFloat(e.target.value))}
                      placeholder="Ex: 90"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="arms_cm">Tour de bras (cm)</Label>
                    <Input
                      id="arms_cm"
                      type="number"
                      step="0.1"
                      value={formData.arms_cm || ''}
                      onChange={(e) => handleChange('arms_cm', parseFloat(e.target.value))}
                      placeholder="Ex: 32"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="thighs_cm">Tour de cuisses (cm)</Label>
                    <Input
                      id="thighs_cm"
                      type="number"
                      step="0.1"
                      value={formData.thighs_cm || ''}
                      onChange={(e) => handleChange('thighs_cm', parseFloat(e.target.value))}
                      placeholder="Ex: 55"
                    />
                  </div>
                </div>
              </motion.div>
            )}

            {/* Notes */}
            <div className="space-y-2">
              <Label htmlFor="notes">Notes (optionnel)</Label>
              <textarea
                id="notes"
                value={formData.notes || ''}
                onChange={(e) => handleChange('notes', e.target.value)}
                placeholder="Ex: Mesure prise le matin à jeun..."
                className="w-full min-h-[80px] px-3 py-2 bg-background border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-fytli-orange resize-none"
              />
            </div>

            {/* Boutons */}
            <div className="flex gap-3 pt-4">
              {onCancel && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={onCancel}
                  className="flex-1"
                >
                  Annuler
                </Button>
              )}
              <Button
                type="submit"
                disabled={loading}
                className="flex-1 bg-gradient-to-r from-fytli-red to-fytli-orange"
              >
                {loading ? 'Enregistrement...' : '📊 Enregistrer'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  );
};

