import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  TrendingUp, 
  Clock, 
  AlertTriangle, 
  Star,
  Home,
  Wrench,
  Building2,
  Split,
  ArrowUpDown,
  Plus,
  Palette,
  Users
} from 'lucide-react';

interface PropertyData {
  price: number;
  surface: number;
  renovationCosts: number;
  resalePrice: number;
  timeToSell: number;
}

interface Strategy {
  id: string;
  name: string;
  icon: React.ElementType;
  description: string;
  investment: number;
  profit: number;
  roi: number;
  duration: number;
  risk: 'Faible' | 'Moyen' | 'Élevé';
  feasibility: number; // 0-10
}

interface StrategyComparisonProps {
  propertyData: PropertyData;
}

export function StrategyComparison({ propertyData }: StrategyComparisonProps) {
  const [selectedStrategy, setSelectedStrategy] = useState<string>('renovation');

  const calculateStrategies = (): Strategy[] => {
    const basePrice = propertyData.price;
    const notaryFees = basePrice * 0.08; // 8% frais de notaire
    
    return [
      {
        id: 'simple',
        name: 'Achat-Revente Simple',
        icon: Home,
        description: 'Rafraîchissement et home staging uniquement',
        investment: basePrice + notaryFees + 5000,
        profit: propertyData.resalePrice - (basePrice + notaryFees + 5000),
        roi: ((propertyData.resalePrice - (basePrice + notaryFees + 5000)) / (basePrice + notaryFees + 5000)) * 100,
        duration: 3,
        risk: 'Faible',
        feasibility: 8
      },
      {
        id: 'renovation',
        name: 'Rénovation Standard',
        icon: Wrench,
        description: 'Travaux second œuvre, modernisation',
        investment: basePrice + notaryFees + propertyData.renovationCosts,
        profit: propertyData.resalePrice - (basePrice + notaryFees + propertyData.renovationCosts),
        roi: ((propertyData.resalePrice - (basePrice + notaryFees + propertyData.renovationCosts)) / (basePrice + notaryFees + propertyData.renovationCosts)) * 100,
        duration: propertyData.timeToSell || 6,
        risk: 'Moyen',
        feasibility: 7
      },
      {
        id: 'heavy',
        name: 'Réhabilitation Lourde',
        icon: Building2,
        description: 'Transformation complète, structure, réseaux',
        investment: basePrice + notaryFees + (propertyData.renovationCosts * 1.8),
        profit: (propertyData.resalePrice * 1.2) - (basePrice + notaryFees + (propertyData.renovationCosts * 1.8)),
        roi: (((propertyData.resalePrice * 1.2) - (basePrice + notaryFees + (propertyData.renovationCosts * 1.8))) / (basePrice + notaryFees + (propertyData.renovationCosts * 1.8))) * 100,
        duration: 12,
        risk: 'Élevé',
        feasibility: 5
      },
      {
        id: 'division',
        name: 'Division/Découpe',
        icon: Split,
        description: 'Division en plusieurs lots',
        investment: basePrice + notaryFees + (propertyData.renovationCosts * 1.3),
        profit: (propertyData.resalePrice * 1.4) - (basePrice + notaryFees + (propertyData.renovationCosts * 1.3)),
        roi: (((propertyData.resalePrice * 1.4) - (basePrice + notaryFees + (propertyData.renovationCosts * 1.3))) / (basePrice + notaryFees + (propertyData.renovationCosts * 1.3))) * 100,
        duration: 8,
        risk: 'Moyen',
        feasibility: 6
      },
      {
        id: 'changeUse',
        name: 'Changement Destination',
        icon: ArrowUpDown,
        description: 'Commerce→Logement, Bureau→Habitation',
        investment: basePrice + notaryFees + (propertyData.renovationCosts * 1.5),
        profit: (propertyData.resalePrice * 1.3) - (basePrice + notaryFees + (propertyData.renovationCosts * 1.5)),
        roi: (((propertyData.resalePrice * 1.3) - (basePrice + notaryFees + (propertyData.renovationCosts * 1.5))) / (basePrice + notaryFees + (propertyData.renovationCosts * 1.5))) * 100,
        duration: 10,
        risk: 'Élevé',
        feasibility: 4
      },
      {
        id: 'extension',
        name: 'Surélévation/Extension',
        icon: Plus,
        description: 'Création surface supplémentaire',
        investment: basePrice + notaryFees + (propertyData.renovationCosts * 2),
        profit: (propertyData.resalePrice * 1.5) - (basePrice + notaryFees + (propertyData.renovationCosts * 2)),
        roi: (((propertyData.resalePrice * 1.5) - (basePrice + notaryFees + (propertyData.renovationCosts * 2))) / (basePrice + notaryFees + (propertyData.renovationCosts * 2))) * 100,
        duration: 14,
        risk: 'Élevé',
        feasibility: 3
      },
      {
        id: 'furnished',
        name: 'Valorisation Meublé',
        icon: Palette,
        description: 'Ameublement/décoration haut de gamme',
        investment: basePrice + notaryFees + propertyData.renovationCosts + 15000,
        profit: (propertyData.resalePrice * 1.1) - (basePrice + notaryFees + propertyData.renovationCosts + 15000),
        roi: (((propertyData.resalePrice * 1.1) - (basePrice + notaryFees + propertyData.renovationCosts + 15000)) / (basePrice + notaryFees + propertyData.renovationCosts + 15000)) * 100,
        duration: 4,
        risk: 'Moyen',
        feasibility: 8
      },
      {
        id: 'occupied',
        name: 'Bien Occupé',
        icon: Users,
        description: 'Décote achat, libération puis revente libre',
        investment: (basePrice * 0.85) + notaryFees + 10000,
        profit: propertyData.resalePrice - ((basePrice * 0.85) + notaryFees + 10000),
        roi: ((propertyData.resalePrice - ((basePrice * 0.85) + notaryFees + 10000)) / ((basePrice * 0.85) + notaryFees + 10000)) * 100,
        duration: 18,
        risk: 'Élevé',
        feasibility: 6
      }
    ];
  };

  const strategies = calculateStrategies();
  const sortedStrategies = [...strategies].sort((a, b) => b.roi - a.roi);
  const recommendedStrategy = sortedStrategies[0];

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'Faible': return 'text-success';
      case 'Moyen': return 'text-warning';
      case 'Élevé': return 'text-destructive';
      default: return 'text-muted-foreground';
    }
  };

  const getRiskBadgeVariant = (risk: string) => {
    switch (risk) {
      case 'Faible': return 'default';
      case 'Moyen': return 'secondary';
      case 'Élevé': return 'destructive';
      default: return 'outline';
    }
  };

  return (
    <Card className="shadow-medium">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-primary" />
          Comparaison des Stratégies
        </CardTitle>
        <CardDescription>
          Analysez les différentes approches d'investissement pour ce bien
        </CardDescription>
      </CardHeader>
      <CardContent>
        {/* Recommended Strategy Highlight */}
        {recommendedStrategy && (
          <div className="mb-6 p-4 gradient-accent rounded-lg border border-primary/20">
            <div className="flex items-center gap-2 mb-2">
              <Star className="h-5 w-5 text-primary" />
              <h3 className="font-semibold text-primary">Stratégie Recommandée</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <p className="font-medium">{recommendedStrategy.name}</p>
                <p className="text-sm text-muted-foreground">{recommendedStrategy.description}</p>
              </div>
              <div className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span>ROI:</span>
                  <span className="font-semibold text-success">{recommendedStrategy.roi.toFixed(1)}%</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Plus-value:</span>
                  <span className="font-semibold">{recommendedStrategy.profit.toLocaleString()} €</span>
                </div>
              </div>
              <div className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span>Durée:</span>
                  <span className="font-semibold">{recommendedStrategy.duration} mois</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Risque:</span>
                  <Badge variant={getRiskBadgeVariant(recommendedStrategy.risk)} className="text-xs">
                    {recommendedStrategy.risk}
                  </Badge>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Strategy Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {strategies.map((strategy) => {
            const IconComponent = strategy.icon;
            const isRecommended = strategy.id === recommendedStrategy?.id;
            
            return (
              <div
                key={strategy.id}
                className={`p-4 rounded-lg border transition-smooth cursor-pointer hover:shadow-medium ${
                  selectedStrategy === strategy.id 
                    ? 'border-primary bg-accent/50' 
                    : 'border-border hover:border-primary/50'
                } ${isRecommended ? 'ring-2 ring-primary/20' : ''}`}
                onClick={() => setSelectedStrategy(strategy.id)}
              >
                <div className="flex items-start gap-3">
                  <div className={`p-2 rounded-md ${isRecommended ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
                    <IconComponent className="h-4 w-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-medium text-sm">{strategy.name}</h4>
                      {isRecommended && (
                        <Star className="h-3 w-3 text-primary fill-primary" />
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground mb-3">{strategy.description}</p>
                    
                    <div className="space-y-2">
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div>
                          <span className="text-muted-foreground">Investissement:</span>
                          <p className="font-medium">{strategy.investment.toLocaleString()} €</p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Plus-value:</span>
                          <p className={`font-medium ${strategy.profit >= 0 ? 'text-success' : 'text-destructive'}`}>
                            {strategy.profit.toLocaleString()} €
                          </p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">ROI:</span>
                          <p className={`font-medium ${strategy.roi >= 0 ? 'text-success' : 'text-destructive'}`}>
                            {strategy.roi.toFixed(1)}%
                          </p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Durée:</span>
                          <p className="font-medium">{strategy.duration} mois</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Badge variant={getRiskBadgeVariant(strategy.risk)} className="text-xs">
                            {strategy.risk}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-1 text-xs">
                          <span className="text-muted-foreground">Faisabilité:</span>
                          <span className="font-medium">{strategy.feasibility}/10</span>
                        </div>
                      </div>
                      
                      <Progress value={strategy.feasibility * 10} className="h-1" />
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Detailed view of selected strategy */}
        {selectedStrategy && (
          <div className="mt-6 p-4 bg-muted/50 rounded-lg">
            <h4 className="font-semibold mb-2">Plan d'exécution détaillé</h4>
            <div className="text-sm space-y-2">
              <p className="text-muted-foreground">
                Conditions de réussite pour la stratégie sélectionnée :
              </p>
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li>Prix d'achat maximum recommandé</li>
                <li>Budget travaux optimisé</li>
                <li>Délai de commercialisation maîtrisé</li>
                <li>Points de vigilance spécifiques</li>
              </ul>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}