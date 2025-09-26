import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { TrendingUp, TrendingDown, DollarSign, Clock } from 'lucide-react';

interface FinancialSummaryProps {
  totalInvestment: number;
  grossProfit: number;
  profitMargin: number;
  roi: number;
}

export function FinancialSummary({ totalInvestment, grossProfit, profitMargin, roi }: FinancialSummaryProps) {
  const isPositive = grossProfit >= 0;
  
  return (
    <div className="mt-6 space-y-4">
      <h3 className="font-semibold text-lg flex items-center gap-2">
        <DollarSign className="h-5 w-5 text-primary" />
        Résumé Financier
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="gradient-card border-l-4 border-l-primary">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Investissement Total</p>
                <p className="text-2xl font-bold">{totalInvestment.toLocaleString()} €</p>
              </div>
              <DollarSign className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card className={`gradient-card border-l-4 ${isPositive ? 'border-l-success' : 'border-l-destructive'}`}>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Plus-value Brute</p>
                <p className={`text-2xl font-bold ${isPositive ? 'text-success' : 'text-destructive'}`}>
                  {grossProfit.toLocaleString()} €
                </p>
              </div>
              {isPositive ? (
                <TrendingUp className="h-8 w-8 text-success" />
              ) : (
                <TrendingDown className="h-8 w-8 text-destructive" />
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">Marge bénéficiaire</span>
            <span className={`font-bold ${isPositive ? 'text-success' : 'text-destructive'}`}>
              {profitMargin.toFixed(1)}%
            </span>
          </div>
          <Progress 
            value={Math.max(0, Math.min(100, profitMargin + 50))} 
            className="h-2"
          />
          <p className="text-xs text-muted-foreground">
            {profitMargin > 20 ? 'Excellent' : profitMargin > 10 ? 'Bon' : profitMargin > 0 ? 'Acceptable' : 'Insuffisant'}
          </p>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">ROI (Retour sur Investissement)</span>
            <span className={`font-bold ${roi > 0 ? 'text-success' : 'text-destructive'}`}>
              {roi.toFixed(1)}%
            </span>
          </div>
          <Progress 
            value={Math.max(0, Math.min(100, roi * 2))} 
            className="h-2"
          />
          <p className="text-xs text-muted-foreground">
            {roi > 30 ? 'Excellent' : roi > 20 ? 'Très bon' : roi > 10 ? 'Bon' : roi > 0 ? 'Acceptable' : 'Négatif'}
          </p>
        </div>
      </div>

      {totalInvestment > 0 && (
        <div className="mt-4 p-4 bg-accent/50 rounded-lg">
          <h4 className="font-semibold mb-2 flex items-center gap-2">
            <Clock className="h-4 w-4" />
            Analyse de rentabilité
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <p className="text-muted-foreground">Seuil de rentabilité</p>
              <p className="font-medium">
                {roi > 0 ? 'Atteint' : 'Non atteint'}
              </p>
            </div>
            <div>
              <p className="text-muted-foreground">Rentabilité annualisée</p>
              <p className="font-medium">
                {(roi / 12 * 6).toFixed(1)}% /an
              </p>
            </div>
            <div>
              <p className="text-muted-foreground">Risque/Rendement</p>
              <p className="font-medium">
                {roi > 25 ? 'Élevé/Élevé' : roi > 15 ? 'Moyen/Bon' : roi > 5 ? 'Faible/Moyen' : 'Élevé/Faible'}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}