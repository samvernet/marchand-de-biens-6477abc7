import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  AlertTriangle, 
  Shield, 
  TrendingDown, 
  Clock, 
  Building,
  Gavel,
  Users,
  Zap
} from 'lucide-react';

interface PropertyData {
  price: number;
  surface: number;
  renovationCosts: number;
  resalePrice: number;
  timeToSell: number;
  structuralCondition: number;
  technicalCondition: number;
  energyRating: string;
  sellingTime: number;
}

interface Scores {
  financial: number;
  technical: number;
  market: number;
  risk: number;
  global: number;
}

interface RiskAnalysisProps {
  propertyData: PropertyData;
  scores: Scores;
}

interface RiskFactor {
  id: string;
  name: string;
  icon: React.ElementType;
  level: 'low' | 'medium' | 'high';
  impact: number; // 1-10
  description: string;
}

export function RiskAnalysis({ propertyData, scores }: RiskAnalysisProps) {
  const calculateRiskFactors = (): RiskFactor[] => {
    const factors: RiskFactor[] = [];

    // Technical risks
    if (propertyData.structuralCondition < 6) {
      factors.push({
        id: 'structural',
        name: 'Risques structurels',
        icon: Building,
        level: propertyData.structuralCondition < 4 ? 'high' : 'medium',
        impact: 10 - propertyData.structuralCondition,
        description: 'État structurel dégradé pouvant entraîner des surcoûts'
      });
    }

    if (propertyData.technicalCondition < 6) {
      factors.push({
        id: 'technical',
        name: 'Risques techniques',
        icon: Zap,
        level: propertyData.technicalCondition < 4 ? 'high' : 'medium',
        impact: 10 - propertyData.technicalCondition,
        description: 'Installations vétustes nécessitant des travaux lourds'
      });
    }

    // Market risks
    if (propertyData.sellingTime > 8) {
      factors.push({
        id: 'market',
        name: 'Marché tendu',
        icon: TrendingDown,
        level: propertyData.sellingTime > 12 ? 'high' : 'medium',
        impact: Math.min(8, propertyData.sellingTime / 2),
        description: 'Temps de vente élevé dans le secteur'
      });
    }

    // Financial risks
    const roi = ((propertyData.resalePrice - (propertyData.price + propertyData.renovationCosts)) / (propertyData.price + propertyData.renovationCosts)) * 100;
    if (roi < 15) {
      factors.push({
        id: 'profitability',
        name: 'Rentabilité faible',
        icon: TrendingDown,
        level: roi < 5 ? 'high' : 'medium',
        impact: Math.max(1, 10 - roi / 2),
        description: 'Marge bénéficiaire insuffisante par rapport aux risques'
      });
    }

    // Timing risks
    if (propertyData.timeToSell > 12) {
      factors.push({
        id: 'timing',
        name: 'Délai de projet',
        icon: Clock,
        level: propertyData.timeToSell > 18 ? 'high' : 'medium',
        impact: Math.min(8, propertyData.timeToSell / 3),
        description: 'Délai de réalisation long augmentant les risques'
      });
    }

    // Regulatory risks
    if (['F', 'G'].includes(propertyData.energyRating)) {
      factors.push({
        id: 'energy',
        name: 'Réglementation énergétique',
        icon: Gavel,
        level: 'high',
        impact: 7,
        description: 'Classe énergétique défavorable avec contraintes futures'
      });
    }

    return factors;
  };

  const riskFactors = calculateRiskFactors();
  const globalRiskLevel = riskFactors.length === 0 ? 'low' : 
    riskFactors.some(f => f.level === 'high') ? 'high' : 'medium';

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'low': return 'text-success';
      case 'medium': return 'text-warning';
      case 'high': return 'text-destructive';
      default: return 'text-muted-foreground';
    }
  };

  const getRiskBg = (level: string) => {
    switch (level) {
      case 'low': return 'bg-success/10';
      case 'medium': return 'bg-warning/10';
      case 'high': return 'bg-destructive/10';
      default: return 'bg-muted/10';
    }
  };

  const mitigationStrategies = [
    {
      condition: riskFactors.some(f => f.id === 'structural'),
      strategy: 'Faire réaliser un diagnostic structure complet avant achat'
    },
    {
      condition: riskFactors.some(f => f.id === 'technical'),
      strategy: 'Prévoir une marge de sécurité de 20% sur le budget travaux'
    },
    {
      condition: riskFactors.some(f => f.id === 'market'),
      strategy: 'Négocier le prix d\'achat pour compenser le risque marché'
    },
    {
      condition: riskFactors.some(f => f.id === 'profitability'),
      strategy: 'Revoir la stratégie ou le positionnement prix'
    },
    {
      condition: riskFactors.some(f => f.id === 'timing'),
      strategy: 'Échelonner les investissements et prévoir un financement relais'
    },
    {
      condition: riskFactors.some(f => f.id === 'energy'),
      strategy: 'Intégrer obligatoirement une rénovation énergétique'
    }
  ];

  return (
    <Card className="shadow-medium">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5 text-primary" />
          Analyse des Risques
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Global Risk Level */}
        <div className={`p-4 rounded-lg ${getRiskBg(globalRiskLevel)}`}>
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className={`h-5 w-5 ${getRiskColor(globalRiskLevel)}`} />
            <span className="font-semibold">
              Niveau de risque global : {globalRiskLevel === 'low' ? 'Faible' : globalRiskLevel === 'medium' ? 'Moyen' : 'Élevé'}
            </span>
          </div>
          <Progress 
            value={riskFactors.length * 20} 
            className="h-2" 
          />
          <p className="text-sm text-muted-foreground mt-1">
            {riskFactors.length === 0 ? 'Aucun risque majeur identifié' : 
             `${riskFactors.length} facteur${riskFactors.length > 1 ? 's' : ''} de risque identifié${riskFactors.length > 1 ? 's' : ''}`}
          </p>
        </div>

        {/* Risk Factors */}
        {riskFactors.length > 0 && (
          <div className="space-y-3">
            <h4 className="font-semibold text-sm">Facteurs de risque identifiés</h4>
            {riskFactors.map((factor) => {
              const IconComponent = factor.icon;
              return (
                <div key={factor.id} className="flex items-start gap-3 p-3 border rounded-lg">
                  <div className={`p-2 rounded-md ${getRiskBg(factor.level)}`}>
                    <IconComponent className={`h-4 w-4 ${getRiskColor(factor.level)}`} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium text-sm">{factor.name}</span>
                      <span className={`text-xs px-2 py-1 rounded-full ${getRiskBg(factor.level)} ${getRiskColor(factor.level)}`}>
                        {factor.level === 'low' ? 'Faible' : factor.level === 'medium' ? 'Moyen' : 'Élevé'}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground">{factor.description}</p>
                    <div className="mt-2">
                      <div className="flex justify-between items-center text-xs">
                        <span>Impact</span>
                        <span>{factor.impact}/10</span>
                      </div>
                      <Progress value={factor.impact * 10} className="h-1 mt-1" />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Mitigation Strategies */}
        {mitigationStrategies.some(s => s.condition) && (
          <div className="space-y-3">
            <h4 className="font-semibold text-sm">Stratégies de mitigation</h4>
            <div className="space-y-2">
              {mitigationStrategies
                .filter(s => s.condition)
                .map((strategy, index) => (
                  <Alert key={index}>
                    <Shield className="h-4 w-4" />
                    <AlertDescription className="text-sm">
                      {strategy.strategy}
                    </AlertDescription>
                  </Alert>
                ))}
            </div>
          </div>
        )}

        {/* Risk Score Breakdown */}
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div>
            <span className="text-muted-foreground">Risque technique</span>
            <div className="flex items-center gap-2">
              <Progress value={(10 - scores.technical) * 10} className="h-2 flex-1" />
              <span className="font-medium">{Math.round(10 - scores.technical)}/10</span>
            </div>
          </div>
          <div>
            <span className="text-muted-foreground">Risque marché</span>
            <div className="flex items-center gap-2">
              <Progress value={(10 - scores.market) * 10} className="h-2 flex-1" />
              <span className="font-medium">{Math.round(10 - scores.market)}/10</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}