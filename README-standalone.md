# Analyse Immobilière Pro - Version Standalone

## Description

Version standalone complète de l'application d'analyse immobilière professionnelle. Cette version fonctionne entièrement en local sans nécessiter de serveur ou de framework JavaScript.

## Fichiers inclus

- `index-standalone.html` - Interface utilisateur complète
- `styles-standalone.css` - Styles CSS avec design system professionnel
- `script-standalone.js` - Logique JavaScript vanilla complète

## Fonctionnalités

### ✅ Analyse complète des biens immobiliers
- Informations de base (titre, localisation, prix, surface)
- Analyse financière avec estimation automatique du prix de revente
- Évaluation technique (état structurel, technique, classe énergétique)
- Analyse de marché

### ✅ Outils d'estimation intelligents
- **Estimation automatique du prix de revente** basée sur :
  - Localisation (bonus pour grandes villes)
  - État du bien (structurel et technique)
  - Coûts de travaux
  - Mots-clés dans la description
- **Analyse d'URL d'annonces** (simulation) pour extraction automatique

### ✅ Comparaison de stratégies d'investissement
- 8 stratégies différentes analysées automatiquement
- Calcul ROI, plus-value, durée, risque et faisabilité
- Recommandation automatique de la meilleure stratégie

### ✅ Analyse des risques
- Détection automatique des facteurs de risque
- Évaluation des risques techniques, financiers, réglementaires
- Niveau de risque global avec impact détaillé

### ✅ Système de notation global
- Scores financier, technique, marché et risque
- Note globale sur 10 avec recommandation d'achat
- Badges visuels (Achat recommandé/conditionné/déconseillé)

### ✅ Interface professionnelle
- Design moderne avec système de couleurs cohérent
- Onglets pour organisation des données
- Notifications toast pour feedback utilisateur
- Responsive design pour mobile et desktop

### ✅ Export et partage
- Export PDF complet avec html2canvas
- Impression optimisée
- Sauvegarde des analyses

## Installation et utilisation

### Prérequis
Aucun ! L'application fonctionne entièrement en local.

### Démarrage
1. Téléchargez les 3 fichiers dans le même dossier
2. Ouvrez `index-standalone.html` dans votre navigateur
3. L'application est prête à utiliser

### CDN utilisés
L'application charge automatiquement les bibliothèques suivantes :
- Chart.js (graphiques)
- jsPDF (export PDF)
- html2canvas (capture d'écran)
- xlsx (export Excel)
- Lucide Icons (icônes)

## Guide d'utilisation

### 1. Saisie des informations de base
- Remplissez le titre, localisation, prix et surface
- Utilisez la fonction "Analyse complète" pour extraire automatiquement les données d'une URL d'annonce
- La description aide à l'estimation automatique

### 2. Analyse financière
- Saisissez les frais de notaire et coûts de travaux
- Utilisez le bouton "Estimer" pour calculer automatiquement le prix de revente
- L'estimation prend en compte la localisation, l'état du bien et les travaux

### 3. État technique
- Utilisez les curseurs pour évaluer l'état structurel et technique
- Sélectionnez la classe énergétique
- Ces données impactent l'estimation de revente et l'analyse de risque

### 4. Marché local
- Renseignez la tendance du marché local
- Indiquez le temps de vente moyen dans le secteur

### 5. Résultats automatiques
- Les scores et recommandations se mettent à jour en temps réel
- Consultez l'analyse des risques pour identifier les points d'attention
- Comparez les différentes stratégies d'investissement

### 6. Export
- Cliquez sur "Exporter PDF" pour sauvegarder l'analyse complète
- L'export inclut tous les tableaux et graphiques

## Personnalisation

### Couleurs et thème
Modifiez les variables CSS dans `styles-standalone.css` :
```css
:root {
  --primary: hsl(218, 95%, 25%); /* Couleur principale */
  --success: hsl(142, 76%, 36%); /* Couleur succès */
  /* ... autres variables */
}
```

### Calculs et algorithmes
Les formules de calcul sont dans `script-standalone.js` :
- Estimation prix de revente : ligne ~90
- Calculs de rentabilité : ligne ~200
- Stratégies d'investissement : ligne ~350
- Analyse des risques : ligne ~560

## Compatibilité

- ✅ Chrome, Firefox, Safari, Edge (versions récentes)
- ✅ Mobile et tablette (responsive)
- ✅ Impression et export PDF
- ✅ Fonctionne hors ligne après premier chargement

## Support

Cette version standalone est complètement autonome et ne nécessite aucun serveur ou API externe. Toutes les fonctionnalités de l'application React originale sont reproduites fidèlement en JavaScript vanilla.

## Version

Version standalone complète - Identique à l'application React
Dernière mise à jour : 2024