// Real Estate Analysis Application - Standalone Version

class RealEstateAnalyzer {
    constructor() {
        this.propertyData = {
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
        
        this.init();
    }
    
    init() {
        this.setupEventListeners();
        this.setupTabs();
        this.updateAllCalculations();
    }
    
    setupEventListeners() {
        // Basic property info
        document.getElementById('title').addEventListener('input', (e) => this.updateData('title', e.target.value));
        document.getElementById('price').addEventListener('input', (e) => this.updateData('price', parseFloat(e.target.value) || 0));
        document.getElementById('surface').addEventListener('input', (e) => this.updateData('surface', parseFloat(e.target.value) || 0));
        document.getElementById('location').addEventListener('input', (e) => this.updateData('location', e.target.value));
        document.getElementById('description').addEventListener('input', (e) => this.updateData('description', e.target.value));
        
        // Financial data
        document.getElementById('notaryFees').addEventListener('input', (e) => this.updateData('notaryFees', parseFloat(e.target.value) || 0));
        document.getElementById('renovationCosts').addEventListener('input', (e) => this.updateData('renovationCosts', parseFloat(e.target.value) || 0));
        document.getElementById('resalePrice').addEventListener('input', (e) => this.updateData('resalePrice', parseFloat(e.target.value) || 0));
        document.getElementById('timeToSell').addEventListener('input', (e) => this.updateData('timeToSell', parseFloat(e.target.value) || 0));
        
        // Technical condition
        document.getElementById('structuralCondition').addEventListener('input', (e) => this.updateData('structuralCondition', parseFloat(e.target.value)));
        document.getElementById('technicalCondition').addEventListener('input', (e) => this.updateData('technicalCondition', parseFloat(e.target.value)));
        document.getElementById('energyRating').addEventListener('change', (e) => this.updateData('energyRating', e.target.value));
        
        // Market data
        document.getElementById('marketTrend').addEventListener('input', (e) => this.updateData('marketTrend', parseFloat(e.target.value) || 0));
        document.getElementById('sellingTime').addEventListener('input', (e) => this.updateData('sellingTime', parseFloat(e.target.value) || 0));
        
        // Export button
        document.getElementById('exportPdf').addEventListener('click', () => this.exportToPDF());
    }
    
    setupTabs() {
        const tabTriggers = document.querySelectorAll('.tab-trigger');
        const tabContents = document.querySelectorAll('.tab-content');
        
        tabTriggers.forEach(trigger => {
            trigger.addEventListener('click', () => {
                const targetTab = trigger.getAttribute('data-tab');
                
                // Remove active class from all triggers and contents
                tabTriggers.forEach(t => t.classList.remove('active'));
                tabContents.forEach(c => c.classList.remove('active'));
                
                // Add active class to clicked trigger and corresponding content
                trigger.classList.add('active');
                document.getElementById(targetTab).classList.add('active');
            });
        });
    }
    
    updateData(field, value) {
        this.propertyData[field] = value;
        this.updateAllCalculations();
    }
    
    updateAllCalculations() {
        this.updatePricePerSqm();
        this.updateFinancialSummary();
        this.updateProgressBars();
        this.updateGlobalScores();
        this.updateRecommendation();
        this.updateStrategyComparison();
        this.updateRiskAnalysis();
    }
    
    updatePricePerSqm() {
        const pricePerSqm = this.propertyData.surface > 0 ? this.propertyData.price / this.propertyData.surface : 0;
        this.propertyData.pricePerSqm = pricePerSqm;
        
        const display = document.getElementById('pricePerSqmDisplay');
        const value = document.getElementById('pricePerSqmValue');
        
        if (pricePerSqm > 0) {
            display.style.display = 'block';
            value.textContent = `${Math.round(pricePerSqm)} €/m²`;
        } else {
            display.style.display = 'none';
        }
    }
    
    updateProgressBars() {
        // Structural condition
        const structuralProgress = document.getElementById('structuralProgress');
        const structuralValue = document.getElementById('structuralValue');
        structuralProgress.style.width = `${this.propertyData.structuralCondition * 10}%`;
        structuralValue.textContent = `${this.propertyData.structuralCondition}/10`;
        
        // Technical condition
        const technicalProgress = document.getElementById('technicalProgress');
        const technicalValue = document.getElementById('technicalValue');
        technicalProgress.style.width = `${this.propertyData.technicalCondition * 10}%`;
        technicalValue.textContent = `${this.propertyData.technicalCondition}/10`;
    }
    
    calculateFinancials() {
        const totalInvestment = this.propertyData.price + this.propertyData.notaryFees + this.propertyData.renovationCosts;
        const grossProfit = this.propertyData.resalePrice - totalInvestment;
        const profitMargin = totalInvestment > 0 ? (grossProfit / totalInvestment) * 100 : 0;
        const roi = totalInvestment > 0 ? (grossProfit / totalInvestment) * 100 : 0;
        
        return { totalInvestment, grossProfit, profitMargin, roi };
    }
    
    updateFinancialSummary() {
        const { totalInvestment, grossProfit, profitMargin, roi } = this.calculateFinancials();
        const isPositive = grossProfit >= 0;
        
        const container = document.getElementById('financialSummary');
        if (!container) return;
        
        container.innerHTML = `
            <div class="financial-summary">
                <h3 class="card-title">
                    <i data-lucide="dollar-sign"></i>
                    Résumé Financier
                </h3>
                
                <div class="financial-grid">
                    <div class="financial-card">
                        <div class="financial-header">
                            <div>
                                <div class="financial-label">Investissement Total</div>
                                <div class="financial-value">${this.formatCurrency(totalInvestment)}</div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="financial-card ${isPositive ? 'positive' : 'negative'}">
                        <div class="financial-header">
                            <div>
                                <div class="financial-label">Plus-value Brute</div>
                                <div class="financial-value ${isPositive ? 'positive' : 'negative'}">${this.formatCurrency(grossProfit)}</div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="form-grid">
                    <div class="form-group">
                        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">
                            <span style="font-size: 0.875rem; font-weight: 500;">Marge bénéficiaire</span>
                            <span style="font-weight: 700; color: ${isPositive ? 'var(--success)' : 'var(--destructive)'};">${profitMargin.toFixed(1)}%</span>
                        </div>
                        <div class="progress">
                            <div class="progress-bar" style="width: ${Math.max(0, Math.min(100, profitMargin + 50))}%;"></div>
                        </div>
                        <p style="font-size: 0.75rem; color: var(--muted-foreground); margin-top: 0.25rem;">
                            ${profitMargin > 20 ? 'Excellent' : profitMargin > 10 ? 'Bon' : profitMargin > 0 ? 'Acceptable' : 'Insuffisant'}
                        </p>
                    </div>
                    
                    <div class="form-group">
                        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">
                            <span style="font-size: 0.875rem; font-weight: 500;">ROI</span>
                            <span style="font-weight: 700; color: ${roi > 0 ? 'var(--success)' : 'var(--destructive)'};">${roi.toFixed(1)}%</span>
                        </div>
                        <div class="progress">
                            <div class="progress-bar" style="width: ${Math.max(0, Math.min(100, roi * 2))}%;"></div>
                        </div>
                        <p style="font-size: 0.75rem; color: var(--muted-foreground); margin-top: 0.25rem;">
                            ${roi > 30 ? 'Excellent' : roi > 20 ? 'Très bon' : roi > 10 ? 'Bon' : roi > 0 ? 'Acceptable' : 'Négatif'}
                        </p>
                    </div>
                </div>
            </div>
        `;
        
        // Re-initialize lucide icons
        lucide.createIcons();
    }
    
    calculateGlobalScore() {
        const { roi } = this.calculateFinancials();
        const financialScore = Math.min(10, Math.max(0, roi / 5)); // 50% ROI = 10/10
        const technicalScore = (this.propertyData.structuralCondition + this.propertyData.technicalCondition) / 2;
        const marketScore = Math.min(10, Math.max(0, 10 - this.propertyData.sellingTime / 2)); // 6 months = 7/10
        const riskScore = Math.min(10, Math.max(0, 10 - (this.propertyData.timeToSell - 6) / 2)); // Lower time = higher score
        
        return {
            financial: Math.round(financialScore * 10) / 10,
            technical: technicalScore,
            market: marketScore,
            risk: riskScore,
            global: Math.round(((financialScore + technicalScore + marketScore + riskScore) / 4) * 10) / 10
        };
    }
    
    updateGlobalScores() {
        const scores = this.calculateGlobalScore();
        const container = document.getElementById('globalScores');
        
        container.innerHTML = `
            <div class="scores-grid">
                <div class="score-item">
                    <span class="score-value">${scores.financial}</span>
                    <div class="score-label">Financier</div>
                </div>
                <div class="score-item">
                    <span class="score-value">${scores.technical}</span>
                    <div class="score-label">Technique</div>
                </div>
                <div class="score-item">
                    <span class="score-value">${scores.market}</span>
                    <div class="score-label">Marché</div>
                </div>
                <div class="score-item">
                    <span class="score-value">${scores.global}</span>
                    <div class="score-label">Global</div>
                </div>
            </div>
        `;
    }
    
    getRecommendation() {
        const scores = this.calculateGlobalScore();
        if (scores.global >= 7.5) return { type: 'success', text: 'ACHAT RECOMMANDÉ', icon: 'check-circle' };
        if (scores.global >= 5) return { type: 'warning', text: 'ACHAT CONDITIONNÉ', icon: 'alert-triangle' };
        return { type: 'error', text: 'ACHAT DÉCONSEILLÉ', icon: 'x-circle' };
    }
    
    updateRecommendation() {
        const recommendation = this.getRecommendation();
        const container = document.getElementById('recommendationContent');
        
        container.innerHTML = `
            <div class="recommendation ${recommendation.type}">
                <div class="recommendation-icon">
                    <i data-lucide="${recommendation.icon}"></i>
                </div>
                <div class="recommendation-text">${recommendation.text}</div>
            </div>
        `;
        
        // Re-initialize lucide icons
        lucide.createIcons();
    }
    
    calculateStrategies() {
        const basePrice = this.propertyData.price;
        const notaryFees = basePrice * 0.08; // 8% frais de notaire
        
        return [
            {
                id: 'simple',
                name: 'Achat-Revente Simple',
                icon: 'home',
                description: 'Rafraîchissement et home staging uniquement',
                investment: basePrice + notaryFees + 5000,
                profit: this.propertyData.resalePrice - (basePrice + notaryFees + 5000),
                roi: ((this.propertyData.resalePrice - (basePrice + notaryFees + 5000)) / (basePrice + notaryFees + 5000)) * 100,
                duration: 3,
                risk: 'Faible',
                feasibility: 8
            },
            {
                id: 'renovation',
                name: 'Rénovation Standard',
                icon: 'wrench',
                description: 'Travaux second œuvre, modernisation',
                investment: basePrice + notaryFees + this.propertyData.renovationCosts,
                profit: this.propertyData.resalePrice - (basePrice + notaryFees + this.propertyData.renovationCosts),
                roi: ((this.propertyData.resalePrice - (basePrice + notaryFees + this.propertyData.renovationCosts)) / (basePrice + notaryFees + this.propertyData.renovationCosts)) * 100,
                duration: this.propertyData.timeToSell || 6,
                risk: 'Moyen',
                feasibility: 7
            },
            {
                id: 'heavy',
                name: 'Réhabilitation Lourde',
                icon: 'building-2',
                description: 'Transformation complète, structure, réseaux',
                investment: basePrice + notaryFees + (this.propertyData.renovationCosts * 1.8),
                profit: (this.propertyData.resalePrice * 1.2) - (basePrice + notaryFees + (this.propertyData.renovationCosts * 1.8)),
                roi: (((this.propertyData.resalePrice * 1.2) - (basePrice + notaryFees + (this.propertyData.renovationCosts * 1.8))) / (basePrice + notaryFees + (this.propertyData.renovationCosts * 1.8))) * 100,
                duration: 12,
                risk: 'Élevé',
                feasibility: 5
            },
            {
                id: 'division',
                name: 'Division/Découpe',
                icon: 'split',
                description: 'Division en plusieurs lots',
                investment: basePrice + notaryFees + (this.propertyData.renovationCosts * 1.3),
                profit: (this.propertyData.resalePrice * 1.4) - (basePrice + notaryFees + (this.propertyData.renovationCosts * 1.3)),
                roi: (((this.propertyData.resalePrice * 1.4) - (basePrice + notaryFees + (this.propertyData.renovationCosts * 1.3))) / (basePrice + notaryFees + (this.propertyData.renovationCosts * 1.3))) * 100,
                duration: 8,
                risk: 'Moyen',
                feasibility: 6
            },
            {
                id: 'changeUse',
                name: 'Changement Destination',
                icon: 'arrow-up-down',
                description: 'Commerce→Logement, Bureau→Habitation',
                investment: basePrice + notaryFees + (this.propertyData.renovationCosts * 1.5),
                profit: (this.propertyData.resalePrice * 1.3) - (basePrice + notaryFees + (this.propertyData.renovationCosts * 1.5)),
                roi: (((this.propertyData.resalePrice * 1.3) - (basePrice + notaryFees + (this.propertyData.renovationCosts * 1.5))) / (basePrice + notaryFees + (this.propertyData.renovationCosts * 1.5))) * 100,
                duration: 10,
                risk: 'Élevé',
                feasibility: 4
            },
            {
                id: 'extension',
                name: 'Surélévation/Extension',
                icon: 'plus',
                description: 'Création surface supplémentaire',
                investment: basePrice + notaryFees + (this.propertyData.renovationCosts * 2),
                profit: (this.propertyData.resalePrice * 1.5) - (basePrice + notaryFees + (this.propertyData.renovationCosts * 2)),
                roi: (((this.propertyData.resalePrice * 1.5) - (basePrice + notaryFees + (this.propertyData.renovationCosts * 2))) / (basePrice + notaryFees + (this.propertyData.renovationCosts * 2))) * 100,
                duration: 14,
                risk: 'Élevé',
                feasibility: 3
            },
            {
                id: 'furnished',
                name: 'Valorisation Meublé',
                icon: 'palette',
                description: 'Ameublement/décoration haut de gamme',
                investment: basePrice + notaryFees + this.propertyData.renovationCosts + 15000,
                profit: (this.propertyData.resalePrice * 1.1) - (basePrice + notaryFees + this.propertyData.renovationCosts + 15000),
                roi: (((this.propertyData.resalePrice * 1.1) - (basePrice + notaryFees + this.propertyData.renovationCosts + 15000)) / (basePrice + notaryFees + this.propertyData.renovationCosts + 15000)) * 100,
                duration: 4,
                risk: 'Moyen',
                feasibility: 8
            },
            {
                id: 'occupied',
                name: 'Bien Occupé',
                icon: 'users',
                description: 'Décote achat, libération puis revente libre',
                investment: (basePrice * 0.85) + notaryFees + 10000,
                profit: this.propertyData.resalePrice - ((basePrice * 0.85) + notaryFees + 10000),
                roi: ((this.propertyData.resalePrice - ((basePrice * 0.85) + notaryFees + 10000)) / ((basePrice * 0.85) + notaryFees + 10000)) * 100,
                duration: 18,
                risk: 'Élevé',
                feasibility: 6
            }
        ];
    }
    
    updateStrategyComparison() {
        const strategies = this.calculateStrategies();
        const sortedStrategies = [...strategies].sort((a, b) => b.roi - a.roi);
        const recommendedStrategy = sortedStrategies[0];
        
        const container = document.getElementById('strategyComparison');
        
        let html = `
            <div class="card">
                <div class="card-header">
                    <h3 class="card-title">
                        <i data-lucide="trending-up"></i>
                        Comparaison des Stratégies
                    </h3>
                    <p class="card-description">Analysez les différentes approches d'investissement pour ce bien</p>
                </div>
                <div class="card-content">
        `;
        
        // Recommended strategy highlight
        if (recommendedStrategy && recommendedStrategy.roi > 0) {
            html += `
                <div style="margin-bottom: 1.5rem; padding: 1rem; background: var(--gradient-accent); border-radius: var(--radius); border: 1px solid hsla(218, 95%, 25%, 0.2);">
                    <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.5rem;">
                        <i data-lucide="star" style="color: var(--primary);"></i>
                        <h4 style="font-weight: 600; color: var(--primary);">Stratégie Recommandée</h4>
                    </div>
                    <div class="form-grid" style="margin-bottom: 0;">
                        <div>
                            <p style="font-weight: 500;">${recommendedStrategy.name}</p>
                            <p style="font-size: 0.875rem; color: var(--muted-foreground);">${recommendedStrategy.description}</p>
                        </div>
                        <div style="font-size: 0.875rem;">
                            <div style="display: flex; justify-content: space-between;">
                                <span>ROI:</span>
                                <span style="font-weight: 600; color: var(--success);">${recommendedStrategy.roi.toFixed(1)}%</span>
                            </div>
                            <div style="display: flex; justify-content: space-between;">
                                <span>Plus-value:</span>
                                <span style="font-weight: 600;">${this.formatCurrency(recommendedStrategy.profit)}</span>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        }
        
        // Strategy grid
        html += '<div class="strategy-grid">';
        
        strategies.forEach(strategy => {
            const isRecommended = strategy.id === recommendedStrategy?.id && strategy.roi > 0;
            const badgeClass = this.getRiskBadgeClass(strategy.risk);
            
            html += `
                <div class="strategy-card ${isRecommended ? 'recommended' : ''}" data-strategy="${strategy.id}">
                    <div class="strategy-header">
                        <div class="strategy-icon ${isRecommended ? 'recommended' : ''}">
                            <i data-lucide="${strategy.icon}"></i>
                        </div>
                        <div>
                            <div class="strategy-title">
                                ${strategy.name}
                                ${isRecommended ? '<i data-lucide="star" style="width: 0.75rem; height: 0.75rem; color: var(--primary); margin-left: 0.25rem;"></i>' : ''}
                            </div>
                        </div>
                    </div>
                    <div class="strategy-description">${strategy.description}</div>
                    
                    <div class="strategy-metrics">
                        <div class="metric">
                            <span class="metric-label">Investissement:</span>
                            <span class="metric-value">${this.formatCurrency(strategy.investment)}</span>
                        </div>
                        <div class="metric">
                            <span class="metric-label">Plus-value:</span>
                            <span class="metric-value ${strategy.profit >= 0 ? 'positive' : 'negative'}">${this.formatCurrency(strategy.profit)}</span>
                        </div>
                        <div class="metric">
                            <span class="metric-label">ROI:</span>
                            <span class="metric-value ${strategy.roi >= 0 ? 'positive' : 'negative'}">${strategy.roi.toFixed(1)}%</span>
                        </div>
                        <div class="metric">
                            <span class="metric-label">Durée:</span>
                            <span class="metric-value">${strategy.duration} mois</span>
                        </div>
                    </div>
                    
                    <div style="display: flex; align-items: center; justify-content: space-between; margin-top: 0.75rem;">
                        <span class="badge ${badgeClass}">${strategy.risk}</span>
                        <div style="font-size: 0.75rem;">
                            <span style="color: var(--muted-foreground);">Faisabilité:</span>
                            <span style="font-weight: 500; margin-left: 0.25rem;">${strategy.feasibility}/10</span>
                        </div>
                    </div>
                    
                    <div class="progress" style="margin-top: 0.5rem;">
                        <div class="progress-bar" style="width: ${strategy.feasibility * 10}%;"></div>
                    </div>
                </div>
            `;
        });
        
        html += '</div></div></div>';
        container.innerHTML = html;
        
        // Re-initialize lucide icons
        lucide.createIcons();
    }
    
    calculateRiskFactors() {
        const factors = [];
        const { roi } = this.calculateFinancials();
        
        // Technical risks
        if (this.propertyData.structuralCondition < 6) {
            factors.push({
                id: 'structural',
                name: 'Risques structurels',
                icon: 'building',
                level: this.propertyData.structuralCondition < 4 ? 'high' : 'medium',
                impact: 10 - this.propertyData.structuralCondition,
                description: 'État structurel dégradé pouvant entraîner des surcoûts'
            });
        }
        
        if (this.propertyData.technicalCondition < 6) {
            factors.push({
                id: 'technical',
                name: 'Risques techniques',
                icon: 'zap',
                level: this.propertyData.technicalCondition < 4 ? 'high' : 'medium',
                impact: 10 - this.propertyData.technicalCondition,
                description: 'Installations vétustes nécessitant des travaux lourds'
            });
        }
        
        // Market risks
        if (this.propertyData.sellingTime > 8) {
            factors.push({
                id: 'market',
                name: 'Marché tendu',
                icon: 'trending-down',
                level: this.propertyData.sellingTime > 12 ? 'high' : 'medium',
                impact: Math.min(8, this.propertyData.sellingTime / 2),
                description: 'Temps de vente élevé dans le secteur'
            });
        }
        
        // Financial risks
        if (roi < 15) {
            factors.push({
                id: 'profitability',
                name: 'Rentabilité faible',
                icon: 'trending-down',
                level: roi < 5 ? 'high' : 'medium',
                impact: Math.max(1, 10 - roi / 2),
                description: 'Marge bénéficiaire insuffisante par rapport aux risques'
            });
        }
        
        // Timing risks
        if (this.propertyData.timeToSell > 12) {
            factors.push({
                id: 'timing',
                name: 'Délai de projet',
                icon: 'clock',
                level: this.propertyData.timeToSell > 18 ? 'high' : 'medium',
                impact: Math.min(8, this.propertyData.timeToSell / 3),
                description: 'Délai de réalisation long augmentant les risques'
            });
        }
        
        // Regulatory risks
        if (['F', 'G'].includes(this.propertyData.energyRating)) {
            factors.push({
                id: 'energy',
                name: 'Réglementation énergétique',
                icon: 'gavel',
                level: 'high',
                impact: 7,
                description: 'Classe énergétique défavorable avec contraintes futures'
            });
        }
        
        return factors;
    }
    
    updateRiskAnalysis() {
        const riskFactors = this.calculateRiskFactors();
        const globalRiskLevel = riskFactors.length === 0 ? 'low' : 
            riskFactors.some(f => f.level === 'high') ? 'high' : 'medium';
        
        const container = document.getElementById('riskAnalysis');
        
        let html = `
            <div class="card">
                <div class="card-header">
                    <h3 class="card-title">
                        <i data-lucide="shield"></i>
                        Analyse des Risques
                    </h3>
                </div>
                <div class="card-content">
                    <div class="risk-level ${globalRiskLevel}">
                        <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.5rem;">
                            <i data-lucide="alert-triangle"></i>
                            <span style="font-weight: 600;">
                                Niveau de risque global : ${globalRiskLevel === 'low' ? 'Faible' : globalRiskLevel === 'medium' ? 'Moyen' : 'Élevé'}
                            </span>
                        </div>
                        <div class="progress">
                            <div class="progress-bar" style="width: ${riskFactors.length * 20}%;"></div>
                        </div>
                        <p style="font-size: 0.875rem; margin-top: 0.25rem; opacity: 0.8;">
                            ${riskFactors.length === 0 ? 'Aucun risque majeur identifié' : 
                              `${riskFactors.length} facteur${riskFactors.length > 1 ? 's' : ''} de risque identifié${riskFactors.length > 1 ? 's' : ''}`}
                        </p>
                    </div>
        `;
        
        // Risk factors
        if (riskFactors.length > 0) {
            html += `
                <div style="margin-top: 1rem;">
                    <h4 style="font-weight: 600; margin-bottom: 0.75rem; font-size: 0.875rem;">Facteurs de risque identifiés</h4>
                    <div class="risk-factors">
            `;
            
            riskFactors.forEach(factor => {
                const riskColor = this.getRiskColor(factor.level);
                const riskBg = this.getRiskBg(factor.level);
                
                html += `
                    <div class="risk-factor">
                        <div class="risk-factor-icon" style="background: ${riskBg};">
                            <i data-lucide="${factor.icon}" style="color: ${riskColor};"></i>
                        </div>
                        <div class="risk-factor-content">
                            <div class="risk-factor-header">
                                <span class="risk-factor-title">${factor.name}</span>
                                <span class="badge" style="background: ${riskBg}; color: ${riskColor}; font-size: 0.75rem;">
                                    ${factor.level === 'low' ? 'Faible' : factor.level === 'medium' ? 'Moyen' : 'Élevé'}
                                </span>
                            </div>
                            <div class="risk-factor-description">${factor.description}</div>
                            <div class="impact-meter">
                                <span>Impact</span>
                                <span>${factor.impact}/10</span>
                            </div>
                            <div class="progress" style="margin-top: 0.25rem;">
                                <div class="progress-bar" style="width: ${factor.impact * 10}%;"></div>
                            </div>
                        </div>
                    </div>
                `;
            });
            
            html += '</div></div>';
        }
        
        html += '</div></div>';
        container.innerHTML = html;
        
        // Re-initialize lucide icons
        lucide.createIcons();
    }
    
    getRiskColor(level) {
        switch (level) {
            case 'low': return 'var(--success)';
            case 'medium': return 'var(--warning)';
            case 'high': return 'var(--destructive)';
            default: return 'var(--muted-foreground)';
        }
    }
    
    getRiskBg(level) {
        switch (level) {
            case 'low': return 'hsla(142, 76%, 36%, 0.1)';
            case 'medium': return 'hsla(38, 92%, 50%, 0.1)';
            case 'high': return 'hsla(0, 84%, 60%, 0.1)';
            default: return 'hsla(220, 14%, 96%, 0.1)';
        }
    }
    
    getRiskBadgeClass(risk) {
        switch (risk) {
            case 'Faible': return 'badge-secondary';
            case 'Moyen': return 'badge-warning';
            case 'Élevé': return 'badge-destructive';
            default: return 'badge-outline';
        }
    }
    
    formatCurrency(amount) {
        return new Intl.NumberFormat('fr-FR', {
            style: 'currency',
            currency: 'EUR',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(amount);
    }
    
    async exportToPDF() {
        try {
            // Use html2canvas to capture the main content
            const element = document.querySelector('.main-content');
            const canvas = await html2canvas(element, {
                scale: 2,
                useCORS: true,
                allowTaint: true
            });
            
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF('p', 'mm', 'a4');
            const imgWidth = 210;
            const pageHeight = 295;
            const imgHeight = (canvas.height * imgWidth) / canvas.width;
            let heightLeft = imgHeight;
            
            let position = 0;
            
            pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
            heightLeft -= pageHeight;
            
            while (heightLeft >= 0) {
                position = heightLeft - imgHeight;
                pdf.addPage();
                pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
                heightLeft -= pageHeight;
            }
            
            const filename = `analyse-immobiliere-${this.propertyData.location || 'bien'}-${Date.now()}.pdf`;
            pdf.save(filename);
        } catch (error) {
            console.error('Erreur lors de l\'export PDF:', error);
            alert('Erreur lors de l\'export PDF. Veuillez réessayer.');
        }
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new RealEstateAnalyzer();
});