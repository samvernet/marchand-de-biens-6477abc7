interface ListingAnalysisResult {
  success: boolean;
  data?: {
    title: string;
    location: string;
    price: number;
    surface: number;
    description: string;
    estimatedRenovationCosts?: number;
    estimatedResalePrice?: number;
    structuralCondition?: number;
    technicalCondition?: number;
    energyRating?: string;
    rooms?: number;
    floor?: number;
    yearBuilt?: number;
    heatingType?: string;
    hasGarden?: boolean;
    hasParking?: boolean;
    proximityScores?: {
      transport: number;
      shops: number;
      schools: number;
    };
  };
  error?: string;
}

export class ListingAnalyzer {
  private static readonly ANALYSIS_PROMPT = `
    Tu es un expert en analyse immobilière. Analyse cette annonce immobilière et extrait toutes les informations pertinentes.
    
    INFORMATIONS À EXTRAIRE :
    - Titre exact de l'annonce
    - Localisation précise (ville, arrondissement, quartier)
    - Prix demandé (en euros)
    - Surface habitable (en m²)
    - Nombre de pièces/chambres
    - Étage et nombre d'étages de l'immeuble
    - Année de construction si mentionnée
    - Type de chauffage
    - Présence de jardin/terrasse/balcon
    - Présence de parking/garage
    - Description complète
    
    ESTIMATIONS À FAIRE :
    - État structurel (note sur 10 basée sur l'âge, description)
    - État technique (note sur 10 basée sur les équipements mentionnés)
    - Classe énergétique estimée si non mentionnée
    - Coût des travaux de rénovation estimé (% du prix selon l'état)
    - Prix de revente potentiel après travaux
    
    ANALYSE DU SECTEUR :
    - Proximité des transports (note sur 10)
    - Proximité des commerces (note sur 10)
    - Proximité des écoles (note sur 10)
    
    Réponds UNIQUEMENT avec un objet JSON valide contenant toutes ces informations.
  `;

  static async analyzeFromUrl(url: string): Promise<ListingAnalysisResult> {
    try {
      // Étape 1: Récupération du contenu de la page
      const response = await fetch('/api/fetch-listing', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const { content, images } = await response.json();

      // Étape 2: Analyse du contenu avec l'IA
      const analysisResult = await this.analyzeContent(content, images);
      
      return {
        success: true,
        data: analysisResult
      };

    } catch (error) {
      console.error('Erreur lors de l\'analyse:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Erreur inconnue'
      };
    }
  }

  private static async analyzeContent(content: string, images: string[] = []): Promise<any> {
    try {
      // Ici, on utiliserait l'API d'analyse IA de Lovable
      // Pour la démo, on simule l'analyse
      const analysisPrompt = `${this.ANALYSIS_PROMPT}\n\nContenu de l'annonce:\n${content}`;
      
      // Simulation d'analyse basée sur des patterns courants
      const mockAnalysis = this.performMockAnalysis(content);
      
      return mockAnalysis;
    } catch (error) {
      throw new Error('Erreur lors de l\'analyse du contenu');
    }
  }

  private static performMockAnalysis(content: string): any {
    const text = content.toLowerCase();
    
    // Extraction du prix
    const priceMatch = content.match(/(\d[\d\s]+)\s*€|(\d[\d\s]+)\s*euros?/i);
    const price = priceMatch ? parseInt(priceMatch[1]?.replace(/\s/g, '') || priceMatch[2]?.replace(/\s/g, '')) : 0;
    
    // Extraction de la surface
    const surfaceMatch = content.match(/(\d+)\s*m[²2]|(\d+)\s*metres?\s*carres?/i);
    const surface = surfaceMatch ? parseInt(surfaceMatch[1] || surfaceMatch[2]) : 0;
    
    // Extraction du nombre de pièces
    const roomsMatch = content.match(/(\d+)\s*pi[eè]ces?|(\d+)\s*p\b|T(\d+)/i);
    const rooms = roomsMatch ? parseInt(roomsMatch[1] || roomsMatch[2] || roomsMatch[3]) : 0;
    
    // Extraction de la localisation
    const locationMatch = content.match(/(Paris\s*\d+|Lyon\s*\d+|Marseille\s*\d+|\w+\s*\(\d+\))/i);
    const location = locationMatch ? locationMatch[1] : '';
    
    // Estimation de l'état basée sur des mots-clés
    let structuralCondition = 7; // Par défaut
    let technicalCondition = 6;
    
    if (text.includes('rénov') || text.includes('travaux')) {
      structuralCondition = 4;
      technicalCondition = 3;
    } else if (text.includes('neuf') || text.includes('récent')) {
      structuralCondition = 9;
      technicalCondition = 9;
    } else if (text.includes('bon état')) {
      structuralCondition = 7;
      technicalCondition = 7;
    }
    
    // Estimation de la classe énergétique
    let energyRating = 'D';
    if (text.includes('classe a') || text.includes('bbc')) energyRating = 'A';
    else if (text.includes('classe b')) energyRating = 'B';
    else if (text.includes('classe c')) energyRating = 'C';
    else if (text.includes('classe e')) energyRating = 'E';
    else if (text.includes('classe f') || text.includes('passoire')) energyRating = 'F';
    else if (text.includes('classe g')) energyRating = 'G';
    
    // Estimation des coûts de travaux (% du prix)
    let renovationCostPercent = 0.10; // 10% par défaut
    if (structuralCondition <= 4) renovationCostPercent = 0.25;
    else if (structuralCondition <= 6) renovationCostPercent = 0.15;
    
    const estimatedRenovationCosts = price * renovationCostPercent;
    const estimatedResalePrice = price * 1.20; // +20% après travaux
    
    return {
      title: this.extractTitle(content),
      location: location || 'Localisation à préciser',
      price,
      surface,
      description: content.substring(0, 500) + (content.length > 500 ? '...' : ''),
      rooms,
      estimatedRenovationCosts: Math.round(estimatedRenovationCosts),
      estimatedResalePrice: Math.round(estimatedResalePrice),
      structuralCondition,
      technicalCondition,
      energyRating,
      hasGarden: text.includes('jardin') || text.includes('terrasse'),
      hasParking: text.includes('parking') || text.includes('garage'),
      proximityScores: {
        transport: this.calculateProximityScore(text, ['métro', 'rer', 'tramway', 'bus', 'gare']),
        shops: this.calculateProximityScore(text, ['commerces', 'magasins', 'supermarch', 'centre commercial']),
        schools: this.calculateProximityScore(text, ['école', 'collège', 'lycée', 'université', 'crèche'])
      }
    };
  }

  private static extractTitle(content: string): string {
    // Extraction du titre (première ligne ou pattern typique)
    const lines = content.split('\n').filter(line => line.trim());
    if (lines.length > 0) {
      const firstLine = lines[0].trim();
      if (firstLine.length > 10 && firstLine.length < 100) {
        return firstLine;
      }
    }
    
    // Fallback: recherche de patterns de titre
    const titlePattern = /(appartement|maison|studio|loft|duplex).*\d+.*m[²2]/i;
    const titleMatch = content.match(titlePattern);
    
    return titleMatch ? titleMatch[0] : 'Bien immobilier analysé';
  }

  private static calculateProximityScore(text: string, keywords: string[]): number {
    let score = 5; // Score par défaut
    
    for (const keyword of keywords) {
      if (text.includes(keyword)) {
        if (text.includes(`proche ${keyword}`) || text.includes(`à proximité ${keyword}`)) {
          score = Math.min(10, score + 2);
        } else {
          score = Math.min(10, score + 1);
        }
      }
    }
    
    return score;
  }
}