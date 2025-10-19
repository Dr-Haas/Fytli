/**
 * Composant BodyCompositionStats
 * Affiche les statistiques et graphiques de composition corporelle
 */

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from './ui/Card';
import { Spinner } from './ui/Spinner';
import bodyCompositionService, { BodyStats, TrendData } from '../services/bodyComposition';
import { 
  TrendingDown, TrendingUp, Scale, Activity, Calendar, Target,
  BarChart3, LineChart as LineChartIcon, Minus
} from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ReactNode;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
  color?: string;
}

const StatCard = ({ title, value, subtitle, icon, trend, trendValue, color = '#FF6B3D' }: StatCardProps) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.3 }}
  >
    <Card className="card-fytli hover:shadow-lg transition-all">
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <p className="text-sm text-muted-foreground mb-1">{title}</p>
            <p className="text-2xl font-bold" style={{ color }}>
              {value}
            </p>
            {subtitle && (
              <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>
            )}
            {trend && trendValue && (
              <div className="flex items-center gap-1 mt-2">
                {trend === 'up' && <TrendingUp className="h-4 w-4 text-green-500" />}
                {trend === 'down' && <TrendingDown className="h-4 w-4 text-red-500" />}
                {trend === 'neutral' && <Minus className="h-4 w-4 text-gray-500" />}
                <span className={`text-xs font-medium ${
                  trend === 'up' ? 'text-green-500' : 
                  trend === 'down' ? 'text-red-500' : 
                  'text-gray-500'
                }`}>
                  {trendValue}
                </span>
              </div>
            )}
          </div>
          <div 
            className="p-3 rounded-full bg-opacity-10" 
            style={{ backgroundColor: color + '20' }}
          >
            <div style={{ color }}>
              {icon}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  </motion.div>
);

interface SimpleLineChartProps {
  data: TrendData[];
  dataKey: 'weight_kg' | 'bmi' | 'body_fat_percent' | 'muscle_mass_kg';
  title: string;
  unit: string;
  color?: string;
}

const SimpleLineChart = ({ data, dataKey, title, unit, color = '#FF6B3D' }: SimpleLineChartProps) => {
  if (!data || data.length === 0) {
    return (
      <Card className="card-fytli">
        <CardHeader>
          <CardTitle className="text-base">{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground text-center py-8">
            Pas assez de données pour afficher le graphique
          </p>
        </CardContent>
      </Card>
    );
  }

  // Filtrer les données valides
  const validData = data.filter(d => d[dataKey] !== null && d[dataKey] !== undefined);
  
  if (validData.length === 0) {
    return (
      <Card className="card-fytli">
        <CardHeader>
          <CardTitle className="text-base">{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground text-center py-8">
            Aucune donnée disponible
          </p>
        </CardContent>
      </Card>
    );
  }

  const values = validData.map(d => Number(d[dataKey]));
  const minValue = Math.min(...values);
  const maxValue = Math.max(...values);
  const range = maxValue - minValue;
  const padding = range * 0.1;

  const chartHeight = 150;
  const chartWidth = 100;

  // Calculer les points pour le graphique
  const points = validData.map((d, i) => {
    const x = (i / (validData.length - 1)) * chartWidth;
    const value = Number(d[dataKey]);
    const y = chartHeight - ((value - minValue + padding) / (range + 2 * padding)) * chartHeight;
    return `${x},${y}`;
  }).join(' ');

  const latestValue = values[values.length - 1];
  const firstValue = values[0];
  const change = latestValue - firstValue;
  const changePercent = ((change / firstValue) * 100).toFixed(1);

  return (
    <Card className="card-fytli">
      <CardHeader>
        <CardTitle className="text-base flex items-center justify-between">
          <span>{title}</span>
          <span className="text-sm font-normal text-muted-foreground">
            {validData.length} mesures
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Valeur actuelle */}
          <div className="flex items-baseline justify-between">
            <div>
              <p className="text-3xl font-bold" style={{ color }}>
                {latestValue.toFixed(1)} {unit}
              </p>
              {change !== 0 && (
                <div className="flex items-center gap-1 mt-1">
                  {change > 0 ? (
                    <TrendingUp className="h-4 w-4 text-green-500" />
                  ) : (
                    <TrendingDown className="h-4 w-4 text-red-500" />
                  )}
                  <span className={`text-sm ${change > 0 ? 'text-green-500' : 'text-red-500'}`}>
                    {change > 0 ? '+' : ''}{change.toFixed(1)} {unit} ({changePercent}%)
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Graphique SVG simple */}
          <div className="relative w-full" style={{ height: chartHeight }}>
            <svg
              viewBox={`0 0 ${chartWidth} ${chartHeight}`}
              className="w-full h-full"
              preserveAspectRatio="none"
            >
              {/* Grille de fond */}
              <line
                x1="0"
                y1={chartHeight / 2}
                x2={chartWidth}
                y2={chartHeight / 2}
                stroke="currentColor"
                strokeOpacity="0.1"
                strokeDasharray="2,2"
              />
              
              {/* Zone sous la courbe */}
              <polygon
                points={`0,${chartHeight} ${points} ${chartWidth},${chartHeight}`}
                fill={color}
                fillOpacity="0.1"
              />
              
              {/* Ligne de tendance */}
              <polyline
                points={points}
                fill="none"
                stroke={color}
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              
              {/* Points */}
              {validData.map((d, i) => {
                const x = (i / (validData.length - 1)) * chartWidth;
                const value = Number(d[dataKey]);
                const y = chartHeight - ((value - minValue + padding) / (range + 2 * padding)) * chartHeight;
                return (
                  <circle
                    key={i}
                    cx={x}
                    cy={y}
                    r="2"
                    fill={color}
                  />
                );
              })}
            </svg>
          </div>

          {/* Dates */}
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>{new Date(validData[0].date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })}</span>
            <span>{new Date(validData[validData.length - 1].date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export const BodyCompositionStats = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<BodyStats | null>(null);
  const [weightTrend, setWeightTrend] = useState<TrendData[]>([]);
  const [compositionTrend, setCompositionTrend] = useState<TrendData[]>([]);
  const [period, setPeriod] = useState<30 | 90>(90);

  useEffect(() => {
    loadData();
  }, [period]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [statsData, weightData, compData] = await Promise.all([
        bodyCompositionService.getStats(),
        bodyCompositionService.getWeightTrend(period),
        bodyCompositionService.getCompositionTrend(period)
      ]);

      setStats(statsData);
      setWeightTrend(weightData);
      setCompositionTrend(compData);
    } catch (error) {
      console.error('Erreur lors du chargement des statistiques:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!stats || !stats.overview) {
    return (
      <Card className="card-fytli">
        <CardContent className="p-8 text-center">
          <BarChart3 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">
            Aucune mesure enregistrée. Commencez par ajouter votre première mesure !
          </p>
        </CardContent>
      </Card>
    );
  }

  const { overview, latest } = stats;
  const bmiInterpretation = latest?.bmi 
    ? bodyCompositionService.interpretBMI(latest.bmi) 
    : null;

  return (
    <div className="space-y-6">
      {/* Période */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <LineChartIcon className="h-5 w-5 text-fytli-orange" />
          Vos Statistiques
        </h3>
        <div className="flex gap-2">
          <button
            onClick={() => setPeriod(30)}
            className={`px-3 py-1 text-sm rounded-full transition-all ${
              period === 30
                ? 'bg-gradient-to-r from-fytli-red to-fytli-orange text-white'
                : 'bg-card border border-border text-muted-foreground hover:text-foreground'
            }`}
          >
            30 jours
          </button>
          <button
            onClick={() => setPeriod(90)}
            className={`px-3 py-1 text-sm rounded-full transition-all ${
              period === 90
                ? 'bg-gradient-to-r from-fytli-red to-fytli-orange text-white'
                : 'bg-card border border-border text-muted-foreground hover:text-foreground'
            }`}
          >
            90 jours
          </button>
        </div>
      </div>

      {/* Cartes de statistiques principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {latest && (
          <>
            <StatCard
              title="Poids actuel"
              value={`${latest.weight_kg} kg`}
              subtitle={overview.starting_weight ? `Départ: ${overview.starting_weight} kg` : undefined}
              icon={<Scale className="h-5 w-5" />}
              trend={
                overview.total_weight_change 
                  ? overview.total_weight_change < 0 ? 'down' : overview.total_weight_change > 0 ? 'up' : 'neutral'
                  : undefined
              }
              trendValue={
                overview.total_weight_change
                  ? `${overview.total_weight_change > 0 ? '+' : ''}${overview.total_weight_change.toFixed(1)} kg`
                  : undefined
              }
              color="#FF6B3D"
            />

            {latest.bmi && bmiInterpretation && (
              <StatCard
                title="IMC"
                value={latest.bmi.toFixed(1)}
                subtitle={bmiInterpretation.category}
                icon={<Target className="h-5 w-5" />}
                color={bmiInterpretation.color}
              />
            )}

            {latest.body_fat_percent && (
              <StatCard
                title="Masse grasse"
                value={`${latest.body_fat_percent}%`}
                subtitle={overview.starting_body_fat ? `Départ: ${overview.starting_body_fat}%` : undefined}
                icon={<Activity className="h-5 w-5" />}
                trend={
                  overview.total_body_fat_change
                    ? overview.total_body_fat_change < 0 ? 'down' : overview.total_body_fat_change > 0 ? 'up' : 'neutral'
                    : undefined
                }
                trendValue={
                  overview.total_body_fat_change
                    ? `${overview.total_body_fat_change > 0 ? '+' : ''}${overview.total_body_fat_change.toFixed(1)}%`
                    : undefined
                }
                color="#F59E0B"
              />
            )}

            <StatCard
              title="Suivi"
              value={overview.total_measurements}
              subtitle={`${overview.tracking_days} jours`}
              icon={<Calendar className="h-5 w-5" />}
              color="#10B981"
            />
          </>
        )}
      </div>

      {/* Graphiques */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SimpleLineChart
          data={weightTrend}
          dataKey="weight_kg"
          title="Évolution du poids"
          unit="kg"
          color="#FF6B3D"
        />

        {compositionTrend.length > 0 && compositionTrend.some(d => d.body_fat_percent) && (
          <SimpleLineChart
            data={compositionTrend}
            dataKey="body_fat_percent"
            title="Évolution de la masse grasse"
            unit="%"
            color="#F59E0B"
          />
        )}

        {compositionTrend.length > 0 && compositionTrend.some(d => d.muscle_mass_kg) && (
          <SimpleLineChart
            data={compositionTrend}
            dataKey="muscle_mass_kg"
            title="Évolution de la masse musculaire"
            unit="kg"
            color="#10B981"
          />
        )}

        <SimpleLineChart
          data={weightTrend}
          dataKey="bmi"
          title="Évolution de l'IMC"
          unit=""
          color="#8B5CF6"
        />
      </div>
    </div>
  );
};

