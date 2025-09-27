import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/components/ui/use-toast';
import { 
  Building, 
  Calculator, 
  TrendingUp, 
  FileText, 
  AlertTriangle,
  CheckCircle,
  XCircle,
  Download,
  BarChart3,
  Target,
  Wrench,
  MapPin,
  Globe,
  Loader2
} from 'lucide-react';
import { StrategyComparison } from './StrategyComparison';
import { FinancialSummary } from './FinancialSummary';
import { RiskAnalysis } from './RiskAnalysis';

interface PropertyData {
  // Basic info
  title: string;
  price: number;
  surface: number;
  location: string;
  description: string;
  
  // Financial data
  notaryFees: number;
  renovationCosts: number;
  resalePrice: number;
  timeToSell: number;
  
  // Technical condition
  structuralCondition: number;
  technicalCondition: number;
  energyRating: string;
  
  // Market data
  pricePerSqm: number;
  marketTrend: number;
  sellingTime: number;
}

const initialData: PropertyData = {
  title: '',
  price: 0,
  surface: 0,
  location: '',
  description: '',
  notaryFees: 0,
  renovationCosts: 0,
  resalePrice: 0,
  timeToSell: 0,
  structuralCondition: 5,
  technicalCondition: 5,
  energyRating: 'D',
  pricePerSqm: 0,
  marketTrend: 0,
  sellingTime: 6
};

export function RealEstateAnalysis() {
  const [propertyData, setPropertyData] = useState<PropertyData>(initialData);
  const [activeTab, setActiveTab] = useState('basic');
  const [listingUrl, setListingUrl] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const updateData = (field: keyof PropertyData, value: any) => {
    setPropertyData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const estimateResalePrice = () => {
    if (!propertyData.price || !propertyData.surface || !propertyData.location) {
      toast({
        title: "Données manquantes",
        description: "Veuillez renseigner le prix, la surface et la localisation pour l'estimation",
        variant: "destructive",
      });
      return;
    }

    // Facteurs d'estimation basés sur différents critères
    let estimationMultiplier = 1;
    
    // Facteur location (très simplifié)
    const locationLower = propertyData.location.toLowerCase();
    if (locationLower.includes('paris') || locationLower.includes('lyon') || locationLower.includes('marseille')) {
      estimationMultiplier += 0.15; // +15% pour grandes villes
    } else if (locationLower.includes('bordeaux') || locationLower.includes('toulouse') || locationLower.includes('nantes')) {
      estimationMultiplier += 0.10; // +10% pour villes moyennes
    }

    // Facteur état du bien
    if (propertyData.structuralCondition >= 8) {
      estimationMultiplier += 0.10; // +10% si excellent état
    } else if (propertyData.structuralCondition >= 6) {
      estimationMultiplier += 0.05; // +5% si bon état
    } else if (propertyData.structuralCondition <= 4) {
      estimationMultiplier -= 0.05; // -5% si mauvais état
    }

    // Facteur travaux
    if (propertyData.renovationCosts) {
      const worksCostPerSqm = propertyData.renovationCosts / propertyData.surface;
      if (worksCostPerSqm > 1000) {
        estimationMultiplier += 0.12; // +12% si gros travaux (rénovation complète)
      } else if (worksCostPerSqm > 500) {
        estimationMultiplier += 0.08; // +8% si travaux moyens
      } else {
        estimationMultiplier += 0.04; // +4% si petits travaux
      }
    }

    // Facteur description (mots-clés positifs)
    const description = propertyData.description.toLowerCase();
    if (description.includes('rénové') || description.includes('neuf') || description.includes('moderne')) {
      estimationMultiplier += 0.05;
    }
    if (description.includes('balcon') || description.includes('terrasse') || description.includes('jardin')) {
      estimationMultiplier += 0.03;
    }
    if (description.includes('parking') || description.includes('garage')) {
      estimationMultiplier += 0.02;
    }

    // Calcul du prix de revente estimé
    const basePrice = propertyData.price + (propertyData.renovationCosts || 0) + (propertyData.notaryFees || 0);
    const estimatedResalePrice = Math.round(basePrice * estimationMultiplier);
    
    updateData('resalePrice', estimatedResalePrice);
    
    toast({
      title: "Estimation calculée",
      description: `Prix de revente estimé : ${estimatedResalePrice.toLocaleString('fr-FR')} €`,
    });
  };

  const analyzeListingUrl = async () => {
    if (!listingUrl.trim()) {
      toast({
        title: "URL manquante",
        description: "Veuillez saisir une URL d'annonce immobilière",
        variant: "destructive",
      });
      return;
    }
    
    setIsAnalyzing(true);
    
    try {
      // Étape 1: Récupération du contenu de la page
      toast({
        title: "Analyse en cours",
        description: "Récupération du contenu de l'annonce...",
      });

      const response = await fetch('/api/analyze-listing', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url: listingUrl }),
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la récupération de l\'annonce');
      }

      const analysisResult = await response.json();
      
      // Étape 2: Mise à jour des données avec les résultats de l'analyse
      if (analysisResult.success) {
        const { data } = analysisResult;
        
        // Mise à jour des informations de base
        if (data.title) updateData('title', data.title);
        if (data.location) updateData('location', data.location);
        if (data.price) updateData('price', data.price);
        if (data.surface) updateData('surface', data.surface);
        if (data.description) updateData('description', data.description);
        
        // Estimation automatique des frais de notaire (environ 8% du prix)
        if (data.price) {
          updateData('notaryFees', Math.round(data.price * 0.08));
        }
        
        // Calculs automatiques basés sur l'analyse IA
        if (data.estimatedRenovationCosts) {
          updateData('renovationCosts', data.estimatedRenovationCosts);
        }
        
        if (data.estimatedResalePrice) {
          updateData('resalePrice', data.estimatedResalePrice);
        }
        
        // État technique estimé
        if (data.structuralCondition) {
          updateData('structuralCondition', data.structuralCondition);
        }
        
        if (data.technicalCondition) {
          updateData('technicalCondition', data.technicalCondition);
        }
        
        if (data.energyRating) {
          updateData('energyRating', data.energyRating);
        }

        toast({
          title: "Analyse terminée",
          description: "L'annonce a été analysée avec succès. Vérifiez et ajustez les données si nécessaire.",
        });
      } else {
        throw new Error(analysisResult.error || 'Erreur lors de l\'analyse');
      }
      
    } catch (error) {
      console.error('Erreur lors de l\'analyse:', error);
      
      // Fallback: analyse basique avec extraction d'URL
      try {
        await performBasicAnalysis();
      } catch (fallbackError) {
        toast({
          title: "Erreur d'analyse",
          description: "Impossible d'analyser cette annonce. Veuillez saisir les informations manuellement.",
          variant: "destructive",
        });
      }
    } finally {
      setIsAnalyzing(false);
    }
  };

  const performBasicAnalysis = async () => {
    // Simulation d'une analyse basique pour demonstration
    // En production, ceci ferait appel à un service de scraping
    toast({
      title: "Analyse de base",
      description: "Analyse basique en cours...",
    });

    // Extraction d'informations basiques depuis l'URL
    const urlAnalysis = analyzeUrlPattern(listingUrl);
    
    if (urlAnalysis.platform) {
      updateData('title', `Bien trouvé sur ${urlAnalysis.platform}`);
      updateData('description', `Annonce analysée automatiquement depuis ${listingUrl}`);
      
      // Estimations par défaut basées sur des moyennes de marché
      const defaultPrice = 250000;
      const defaultSurface = 65;
      
      updateData('price', defaultPrice);
      updateData('surface', defaultSurface);
      updateData('notaryFees', Math.round(defaultPrice * 0.08));
      updateData('renovationCosts', Math.round(defaultPrice * 0.15)); // 15% du prix
      updateData('resalePrice', Math.round(defaultPrice * 1.25)); // +25% après travaux
      updateData('structuralCondition', 6);
      updateData('technicalCondition', 5);
      updateData('energyRating', 'D');

      toast({
        title: "Analyse de base terminée",
        description: "Données par défaut appliquées. Veuillez les ajuster selon l'annonce réelle.",
      });
    }
  };

  const analyzeUrlPattern = (url: string) => {
    const platforms = {
      'seloger.com': 'SeLoger',
      'leboncoin.fr': 'LeBonCoin',
      'pap.fr': 'PAP',
      'orpi.com': 'Orpi',
      'century21.fr': 'Century 21',
      'laforet.com': 'Laforêt',
      'fnaim.fr': 'FNAIM',
      'logic-immo.com': 'Logic-immo'
    };

    for (const [domain, platform] of Object.entries(platforms)) {
      if (url.includes(domain)) {
        return { platform, domain };
      }
    }
    
    return { platform: 'Plateforme inconnue', domain: null };
  };

  const { toast } = useToast();

  // Calculations
  const totalInvestment = propertyData.price + propertyData.notaryFees + propertyData.renovationCosts;
  const grossProfit = propertyData.resalePrice - totalInvestment;
  const profitMargin = totalInvestment > 0 ? (grossProfit / totalInvestment) * 100 : 0;
  const roi = totalInvestment > 0 ? (grossProfit / totalInvestment) * 100 : 0;
  const pricePerSqm = propertyData.surface > 0 ? propertyData.price / propertyData.surface : 0;

  // Global score calculation
  const calculateGlobalScore = () => {
    const financialScore = Math.min(10, Math.max(0, roi / 5)); // 50% ROI = 10/10
    const technicalScore = (propertyData.structuralCondition + propertyData.technicalCondition) / 2;
    const marketScore = Math.min(10, Math.max(0, 10 - propertyData.sellingTime / 2)); // 6 months = 7/10
    const riskScore = Math.min(10, Math.max(0, 10 - (propertyData.timeToSell - 6) / 2)); // Lower time = higher score
    
    return {
      financial: Math.round(financialScore * 10) / 10,
      technical: technicalScore,
      market: marketScore,
      risk: riskScore,
      global: Math.round(((financialScore + technicalScore + marketScore + riskScore) / 4) * 10) / 10
    };
  };

  const scores = calculateGlobalScore();

  const getRecommendation = () => {
    if (scores.global >= 7.5) return { type: 'success', text: 'ACHAT RECOMMANDÉ', icon: CheckCircle };
    if (scores.global >= 5) return { type: 'warning', text: 'ACHAT CONDITIONNÉ', icon: AlertTriangle };
    return { type: 'error', text: 'ACHAT DÉCONSEILLÉ', icon: XCircle };
  };

  const recommendation = getRecommendation();

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-card border-b shadow-soft">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Building className="h-8 w-8 text-primary" />
              <div>
                <h1 className="text-2xl font-bold text-foreground">Analyse Immobilière Pro</h1>
                <p className="text-sm text-muted-foreground">Outil professionnel pour marchands de biens</p>
              </div>
            </div>
            <Button 
              variant="professional" 
              size="lg" 
              className="gap-2"
              onClick={() => window.print()}
            >
              <Download className="h-4 w-4" />
              Exporter PDF
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Panel - Forms */}
          <div className="lg:col-span-2 space-y-6">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="basic" className="gap-2">
                  <Building className="h-4 w-4" />
                  Bien
                </TabsTrigger>
                <TabsTrigger value="financial" className="gap-2">
                  <Calculator className="h-4 w-4" />
                  Financier
                </TabsTrigger>
                <TabsTrigger value="technical" className="gap-2">
                  <Wrench className="h-4 w-4" />
                  Technique
                </TabsTrigger>
                <TabsTrigger value="market" className="gap-2">
                  <MapPin className="h-4 w-4" />
                  Marché
                </TabsTrigger>
              </TabsList>

              <TabsContent value="basic" className="space-y-6">
                <Card className="shadow-medium">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Building className="h-5 w-5 text-primary" />
                      Informations du bien
                    </CardTitle>
                    <CardDescription>
                      Renseignez les caractéristiques principales du bien immobilier
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* URL Analysis Section */}
                    <div className="p-4 bg-accent/50 rounded-lg border border-border">
                      <div className="flex items-center gap-2 mb-3">
                        <Globe className="h-4 w-4 text-primary" />
                        <span className="text-sm font-medium">Analyse automatique d'annonce</span>
                      </div>
                      <div className="flex gap-2">
                        <Input
                          placeholder="https://www.seloger.com/annonces/achat/..."
                          value={listingUrl}
                          onChange={(e) => setListingUrl(e.target.value)}
                          className="flex-1"
                        />
                        <Button 
                          onClick={analyzeListingUrl}
                          disabled={!listingUrl.trim() || isAnalyzing}
                          variant="default"
                          className="gap-2 min-w-[140px]"
                        >
                          {isAnalyzing ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Globe className="h-4 w-4" />
                          )}
                          {isAnalyzing ? 'Analyse...' : 'Analyse complète'}
                        </Button>
                      </div>
                      <div className="text-xs text-muted-foreground mt-2 space-y-1">
                        <p>✓ L'IA analysera automatiquement le contenu et les photos de l'annonce</p>
                        <p>✓ Extraction du prix, surface, localisation, description</p>
                        <p>✓ Estimation des travaux et du potentiel de revente</p>
                        <p>✓ Évaluation de l'état technique du bien</p>
                        <div className="flex flex-wrap gap-1 mt-2">
                          <Badge variant="outline" className="text-xs">SeLoger</Badge>
                          <Badge variant="outline" className="text-xs">LeBonCoin</Badge>
                          <Badge variant="outline" className="text-xs">PAP</Badge>
                          <Badge variant="outline" className="text-xs">Orpi</Badge>
                          <Badge variant="outline" className="text-xs">Century21</Badge>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="title">Titre de l'annonce</Label>
                        <Input
                          id="title"
                          value={propertyData.title}
                          onChange={(e) => updateData('title', e.target.value)}
                          placeholder="Ex: Appartement 3 pièces à rénover"
                        />
                      </div>
                      <div>
                        <Label htmlFor="location">Localisation</Label>
                        <Input
                          id="location"
                          value={propertyData.location}
                          onChange={(e) => updateData('location', e.target.value)}
                          placeholder="Ex: Paris 11ème"
                        />
                      </div>
                      <div>
                        <Label htmlFor="price">Prix demandé (€)</Label>
                        <Input
                          id="price"
                          type="number"
                          value={propertyData.price || ''}
                          onChange={(e) => updateData('price', Number(e.target.value))}
                          placeholder="250000"
                        />
                      </div>
                      <div>
                        <Label htmlFor="surface">Surface (m²)</Label>
                        <Input
                          id="surface"
                          type="number"
                          value={propertyData.surface || ''}
                          onChange={(e) => updateData('surface', Number(e.target.value))}
                          placeholder="65"
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="description">Description de l'annonce</Label>
                      <Textarea
                        id="description"
                        value={propertyData.description}
                        onChange={(e) => updateData('description', e.target.value)}
                        placeholder="Collez ici le contenu de l'annonce immobilière..."
                        rows={6}
                      />
                    </div>
                    {pricePerSqm > 0 && (
                      <div className="p-4 bg-accent rounded-lg">
                        <p className="text-sm font-medium">
                          Prix au m² : <span className="text-primary font-bold">{Math.round(pricePerSqm)} €/m²</span>
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="financial" className="space-y-6">
                <Card className="shadow-medium">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Calculator className="h-5 w-5 text-primary" />
                      Analyse financière
                    </CardTitle>
                    <CardDescription>
                      Estimez les coûts et la rentabilité du projet
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="notaryFees">Frais de notaire (€)</Label>
                        <Input
                          id="notaryFees"
                          type="number"
                          value={propertyData.notaryFees || ''}
                          onChange={(e) => updateData('notaryFees', Number(e.target.value))}
                          placeholder="20000"
                        />
                      </div>
                      <div>
                        <Label htmlFor="renovationCosts">Coût des travaux (€)</Label>
                        <Input
                          id="renovationCosts"
                          type="number"
                          value={propertyData.renovationCosts || ''}
                          onChange={(e) => updateData('renovationCosts', Number(e.target.value))}
                          placeholder="50000"
                        />
                      </div>
                      <div>
                        <Label htmlFor="resalePrice">Prix de revente estimé (€)</Label>
                        <div className="flex gap-2">
                          <Input
                            id="resalePrice"
                            type="number"
                            value={propertyData.resalePrice || ''}
                            onChange={(e) => updateData('resalePrice', Number(e.target.value))}
                            placeholder="380000"
                          />
                          <Button 
                            type="button" 
                            variant="outline" 
                            onClick={estimateResalePrice}
                            disabled={!propertyData.price || !propertyData.surface || !propertyData.location}
                            className="px-3"
                          >
                            Estimer
                          </Button>
                        </div>
                        {propertyData.resalePrice && (
                          <p className="text-xs text-muted-foreground mt-1">
                            Estimation basée sur le marché local et l'état du bien
                          </p>
                        )}
                      </div>
                      <div>
                        <Label htmlFor="timeToSell">Délai de revente (mois)</Label>
                        <Input
                          id="timeToSell"
                          type="number"
                          value={propertyData.timeToSell || ''}
                          onChange={(e) => updateData('timeToSell', Number(e.target.value))}
                          placeholder="8"
                        />
                      </div>
                    </div>
                    
                    <FinancialSummary 
                      totalInvestment={totalInvestment}
                      grossProfit={grossProfit}
                      profitMargin={profitMargin}
                      roi={roi}
                    />
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="technical" className="space-y-6">
                <Card className="shadow-medium">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Wrench className="h-5 w-5 text-primary" />
                      État technique
                    </CardTitle>
                    <CardDescription>
                      Évaluez l'état général du bien et les travaux nécessaires
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <Label>État structurel (/10)</Label>
                        <div className="mt-2">
                          <Progress value={propertyData.structuralCondition * 10} className="h-3" />
                          <div className="flex justify-between mt-1">
                            <span className="text-xs text-muted-foreground">Mauvais</span>
                            <span className="text-sm font-medium">{propertyData.structuralCondition}/10</span>
                            <span className="text-xs text-muted-foreground">Excellent</span>
                          </div>
                        </div>
                        <Input
                          type="number"
                          min="0"
                          max="10"
                          step="0.5"
                          value={propertyData.structuralCondition}
                          onChange={(e) => updateData('structuralCondition', Number(e.target.value))}
                          className="mt-2"
                        />
                      </div>
                      
                      <div>
                        <Label>État technique (/10)</Label>
                        <div className="mt-2">
                          <Progress value={propertyData.technicalCondition * 10} className="h-3" />
                          <div className="flex justify-between mt-1">
                            <span className="text-xs text-muted-foreground">Mauvais</span>
                            <span className="text-sm font-medium">{propertyData.technicalCondition}/10</span>
                            <span className="text-xs text-muted-foreground">Excellent</span>
                          </div>
                        </div>
                        <Input
                          type="number"
                          min="0"
                          max="10"
                          step="0.5"
                          value={propertyData.technicalCondition}
                          onChange={(e) => updateData('technicalCondition', Number(e.target.value))}
                          className="mt-2"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <Label htmlFor="energyRating">Classe énergétique</Label>
                      <select
                        id="energyRating"
                        className="w-full mt-1 p-2 border border-input rounded-md bg-background"
                        value={propertyData.energyRating}
                        onChange={(e) => updateData('energyRating', e.target.value)}
                      >
                        <option value="A">A - Très économe</option>
                        <option value="B">B - Économe</option>
                        <option value="C">C - Correct</option>
                        <option value="D">D - Moyen</option>
                        <option value="E">E - Énergivore</option>
                        <option value="F">F - Très énergivore</option>
                        <option value="G">G - Extrêmement énergivore</option>
                      </select>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="market" className="space-y-6">
                <Card className="shadow-medium">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <MapPin className="h-5 w-5 text-primary" />
                      Analyse de marché
                    </CardTitle>
                    <CardDescription>
                      Évaluez le marché local et les tendances
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="marketTrend">Tendance du marché (%/an)</Label>
                        <Input
                          id="marketTrend"
                          type="number"
                          step="0.1"
                          value={propertyData.marketTrend || ''}
                          onChange={(e) => updateData('marketTrend', Number(e.target.value))}
                          placeholder="2.5"
                        />
                      </div>
                      <div>
                        <Label htmlFor="sellingTime">Temps de vente moyen (mois)</Label>
                        <Input
                          id="sellingTime"
                          type="number"
                          value={propertyData.sellingTime || ''}
                          onChange={(e) => updateData('sellingTime', Number(e.target.value))}
                          placeholder="6"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>

            <StrategyComparison propertyData={propertyData} />
          </div>

          {/* Right Panel - Summary & Analysis */}
          <div className="space-y-6">
            {/* Global Score */}
            <Card className="shadow-strong">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Target className="h-5 w-5 text-primary" />
                  Score Global
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center space-y-4">
                  <div className="text-4xl font-bold text-primary">
                    {scores.global}/10
                  </div>
                  <Progress value={scores.global * 10} className="h-4" />
                  
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div className="space-y-1">
                      <div className="flex justify-between">
                        <span>Financier</span>
                        <span className="font-medium">{scores.financial}/10</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Technique</span>
                        <span className="font-medium">{scores.technical}/10</span>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <div className="flex justify-between">
                        <span>Marché</span>
                        <span className="font-medium">{scores.market}/10</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Risque</span>
                        <span className="font-medium">{scores.risk}/10</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="pt-2">
                    <Badge 
                      variant={recommendation.type === 'success' ? 'default' : recommendation.type === 'warning' ? 'secondary' : 'destructive'}
                      className="px-4 py-2 text-sm font-semibold"
                    >
                      <recommendation.icon className="h-4 w-4 mr-2" />
                      {recommendation.text}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <RiskAnalysis propertyData={propertyData} scores={scores} />

            {/* Quick Financial Summary */}
            <Card className="shadow-medium">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <TrendingUp className="h-5 w-5 text-primary" />
                  Résumé financier
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <p className="text-muted-foreground">Investissement</p>
                    <p className="font-semibold">{totalInvestment.toLocaleString()} €</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Plus-value</p>
                    <p className={`font-semibold ${grossProfit >= 0 ? 'text-success' : 'text-destructive'}`}>
                      {grossProfit.toLocaleString()} €
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">ROI</p>
                    <p className={`font-semibold ${roi >= 0 ? 'text-success' : 'text-destructive'}`}>
                      {roi.toFixed(1)} %
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Délai</p>
                    <p className="font-semibold">{propertyData.timeToSell} mois</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Actions */}
            <div className="space-y-3">
              <Button variant="professional" size="lg" className="w-full gap-2">
                <BarChart3 className="h-4 w-4" />
                Analyse complète
              </Button>
              <Button variant="outline" size="lg" className="w-full gap-2">
                <FileText className="h-4 w-4" />
                Générer rapport
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}