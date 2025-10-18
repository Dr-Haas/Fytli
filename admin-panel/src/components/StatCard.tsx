import { LucideIcon } from 'lucide-react';
import { Card, CardContent } from './Card';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  description?: string;
}

export default function StatCard({ title, value, icon: Icon, trend, description }: StatCardProps) {
  return (
    <Card>
      <CardContent className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
          <p className="text-3xl font-bold text-gray-900 mb-2">{value}</p>
          {description && (
            <p className="text-xs text-gray-500">{description}</p>
          )}
          {trend && (
            <div className="flex items-center mt-2">
              <span className={`text-sm font-medium ${trend.isPositive ? 'text-green-600' : 'text-red-600'}`}>
                {trend.isPositive ? '+' : ''}{trend.value}%
              </span>
              <span className="text-xs text-gray-500 ml-2">vs. mois dernier</span>
            </div>
          )}
        </div>
        <div className="ml-4">
          <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
            <Icon className="h-6 w-6 text-primary-600" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

