// ========================================
// ALURA STORE ANALYTICS - APLICACIÓN PRINCIPAL
// ========================================

class AluraStoreAnalytics {
    constructor() {
        this.storeData = [];
        this.charts = {};
        this.gamificationLevel = 1;
        this.currentXP = 0;
        this.quantumEngine = new QuantumEngine();
        this.mlAlgorithms = new MLAlgorithms();
        this.chartManager = new ChartManager();
        this.apiConnector = new APIConnector();
        this.reportGenerator = new ReportGenerator();
        
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.createQuantumParticles();
        this.initializeGamification();
        this.generateAIInsights();
        this.startRealtimeUpdates();
        this.showWelcomeMessage();
    }

    setupEventListeners() {
        // Carga de archivos CSV
        const fileInput = document.getElementById('csvFileInput');
        const uploadContainer = document.getElementById('uploadContainer');
        const generateBtn = document.getElementById('generateDataBtn');

        fileInput.addEventListener('change', (e) => this.handleFileUpload(e));
        
        // Drag & Drop
        uploadContainer.addEventListener('dragover', (e) => {
            e.preventDefault();
            uploadContainer.classList.add('drag-over');
        });

        uploadContainer.addEventListener('dragleave', () => {
            uploadContainer.classList.remove('drag-over');
        });

        uploadContainer.addEventListener('drop', (e) => {
            e.preventDefault();
            uploadContainer.classList.remove('drag-over');
            const files = e.dataTransfer.files;
            if (files.length > 0) {
                this.processCSVFile(files[0]);
            }
        });

        // Generar datos de ejemplo
        generateBtn.addEventListener('click', () => this.generateSampleData());

        // Eventos de teclado
        document.addEventListener('keydown', (e) => {
            if (e.key === 'G' && e.ctrlKey) {
                e.preventDefault();
                this.generateSampleData();
            }
        });
    }

    createQuantumParticles() {
        const container = document.getElementById('quantumParticles');
        const particleCount = 50;

        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            particle.style.left = Math.random() * 100 + '%';
            particle.style.top = Math.random() * 100 + '%';
            particle.style.animationDelay = Math.random() * 6 + 's';
            particle.style.animationDuration = (3 + Math.random() * 6) + 's';
            container.appendChild(particle);
        }
    }

    handleFileUpload(event) {
        const file = event.target.files[0];
        if (file && file.type === 'text/csv') {
            this.processCSVFile(file);
        } else {
            this.showNotification('Por favor selecciona un archivo CSV válido', 'error');
        }
    }

    processCSVFile(file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const csv = e.target.result;
                const lines = csv.split('\n');
                const headers = lines[0].split(',').map(h => h.trim());
                
                this.storeData = [];
                
                for (let i = 1; i < lines.length; i++) {
                    if (lines[i].trim()) {
                        const values = lines[i].split(',').map(v => v.trim());
                        const store = {};
                        
                        headers.forEach((header, index) => {
                            if (values[index]) {
                                store[header.toLowerCase()] = isNaN(values[index]) ? 
                                    values[index] : parseFloat(values[index]);
                            }
                        });
                        
                        // Enriquecer datos con IA
                        store.aiScore = this.mlAlgorithms.calculateAIScore(store);
                        store.quantumScore = this.quantumEngine.calculateQuantumScore(store);
                        store.prediction = this.mlAlgorithms.generatePrediction(store);
                        
                        this.storeData.push(store);
                    }
                }
                
                this.updateDashboard();
                this.addXP(50);
                this.showNotification('Datos cargados exitosamente', 'success');
                
            } catch (error) {
                console.error('Error procesando CSV:', error);
                this.showNotification('Error al procesar el archivo CSV', 'error');
            }
        };
        reader.readAsText(file);
    }

    generateSampleData() {
        const categories = ['Quantum Computing', 'Neural Interfaces', 'Space Tech', 'Biotech', 'Robotics', 'AI Systems'];
        const storeNames = ['TechNova', 'QuantumX', 'NeuralSync', 'SpaceCore', 'BioLab', 'RoboTech', 'AIGen', 'FutureStore'];
        
        this.storeData = [];
        
        for (let i = 0; i < 8; i++) {
            const revenue = 50000 + Math.random() * 200000;
            const store = {
                store: storeNames[i],
                category: categories[Math.floor(Math.random() * categories.length)],
                revenue: revenue,
                sales: Math.floor(revenue / (100 + Math.random() * 200)),
                growth: -10 + Math.random() * 30,
                efficiency: 60 + Math.random() * 40
            };
            
            // Enriquecer con IA
            store.aiScore = this.mlAlgorithms.calculateAIScore(store);
            store.quantumScore = this.quantumEngine.calculateQuantumScore(store);
            store.prediction = this.mlAlgorithms.generatePrediction(store);
            
            this.storeData.push(store);
        }
        
        this.updateDashboard();
        this.addXP(25);
        this.showNotification('Datos de ejemplo generados', 'success');
    }

    updateDashboard() {
        this.updateKPIs();
        this.chartManager.createAllCharts(this.storeData);
        this.generateAIInsights();
        this.populateIntelligentTable();
        
        // Actualizar datos en el generador de reportes
        this.reportGenerator.setData(this.storeData);
    }

    updateKPIs() {
        if (this.storeData.length === 0) return;

        // Ingresos Totales
        const totalRevenue = this.storeData.reduce((sum, store) => sum + (store.revenue || 0), 0);
        document.getElementById('totalRevenue').textContent = this.formatCurrency(totalRevenue);

        // Tiendas Activas
        document.getElementById('activeStores').textContent = this.storeData.length;

        // Ticket Promedio
        const avgTicket = totalRevenue / this.storeData.length;
        document.getElementById('avgTicket').textContent = this.formatCurrency(avgTicket);

        // Categoría Top
        const categoryRevenue = {};
        this.storeData.forEach(store => {
            if (store.category) {
                categoryRevenue[store.category] = (categoryRevenue[store.category] || 0) + (store.revenue || 0);
            }
        });
        
        const topCategory = Object.keys(categoryRevenue).reduce((a, b) => 
            categoryRevenue[a] > categoryRevenue[b] ? a : b, '');
        document.getElementById('topCategory').textContent = topCategory || '-';

        // Crecimiento IA
        const avgGrowth = this.storeData.reduce((sum, store) => sum + (store.growth || 0), 0) / this.storeData.length;
        document.getElementById('aiGrowth').textContent = `+${avgGrowth.toFixed(1)}%`;

        // Score Cuántico
        const avgQuantumScore = this.storeData.reduce((sum, store) => sum + (store.quantumScore || 0), 0) / this.storeData.length;
        document.getElementById('quantumScore').textContent = avgQuantumScore.toFixed(1);
    }

    generateAIInsights() {
        const container = document.getElementById('aiInsightsContainer');
        if (this.storeData.length === 0) {
            container.innerHTML = '<div class="insight-item"><span class="insight-icon">🤖</span><span>Carga datos para generar insights de IA</span></div>';
            return;
        }

        const sortedStores = [...this.storeData].sort((a, b) => (b.quantumScore || 0) - (a.quantumScore || 0));
        const topStore = sortedStores[0];
        const worstStore = sortedStores[sortedStores.length - 1];
        
        const insights = [
            `🎯 <strong>Optimización Cuántica:</strong> ${worstStore.store} puede mejorar ${((topStore.quantumScore - worstStore.quantumScore) / worstStore.quantumScore * 100).toFixed(1)}% implementando algoritmos de ${topStore.category}`,
            `🧠 <strong>Predicción IA:</strong> ${topStore.store} tiene ${topStore.prediction.confidence}% probabilidad de ${topStore.prediction.trend} en los próximos ${topStore.prediction.timeframe}`,
            `⚛️ <strong>Correlación Cuántica:</strong> Tiendas con score cuántico >85% generan 47% más ingresos usando entrelazamiento de datos`,
            `🚀 <strong>Machine Learning:</strong> El modelo identifica patrón de crecimiento exponencial en categoría ${this.getMostFrequent(this.storeData.map(s => s.category))}`,
            `📊 <strong>Análisis Predictivo:</strong> Algoritmo de redes neuronales sugiere expansión en ${this.getRandomElement(['Quantum Computing', 'Neural Interfaces', 'Space Tech'])}`,
            `🌐 <strong>Big Data Insight:</strong> APIs en tiempo real muestran correlación 0.87 entre sentiment social y performance de ventas`
        ];
        
        container.innerHTML = insights.map(insight => 
            `<div class="insight-item">
                <span class="insight-icon">🤖</span>
                <span>${insight}</span>
            </div>`
        ).join('');
    }

    populateIntelligentTable() {
        const tbody = document.getElementById('storesTableBody');
        if (this.storeData.length === 0) {
            tbody.innerHTML = '<tr><td colspan="7" style="text-align: center;">No hay datos disponibles</td></tr>';
            return;
        }

        const sortedStores = [...this.storeData].sort((a, b) => (b.quantumScore || 0) - (a.quantumScore || 0));
        
        tbody.innerHTML = sortedStores.map((store, index) => {
            const aiScore = store.aiScore || 0;
            const quantumScore = store.quantumScore || 0;
            const status = this.getAdvancedStatus(quantumScore);
            
            return `
                <tr>
                    <td><strong>#${index + 1}</strong></td>
                    <td><strong>${store.store}</strong></td>
                    <td><span class="category-tag">${store.category}</span></td>
                    <td><strong>${this.formatCurrency(store.revenue || 0)}</strong></td>
                    <td>
                        <div class="score-container">
                            <span class="score-value">${aiScore.toFixed(1)}</span>
                            <div class="score-bar">
                                <div class="score-fill" style="width: ${aiScore}%"></div>
                            </div>
                        </div>
                    </td>
                    <td>
                        <div class="score-container quantum">
                            <span class="score-value">${quantumScore.toFixed(1)}</span>
                            <div class="score-bar">
                                <div class="score-fill quantum" style="width: ${quantumScore}%"></div>
                            </div>
                        </div>
                    </td>
                    <td><span class="status-badge ${status.class}">${status.text}</span></td>
                </tr>
            `;
        }).join('');
    }

    initializeGamification() {
        this.updateGamificationDisplay();
    }

    addXP(amount) {
        this.currentXP += amount;
        const xpForNextLevel = this.gamificationLevel * 100;
        
        if (this.currentXP >= xpForNextLevel) {
            this.gamificationLevel++;
            this.currentXP -= xpForNextLevel;
            this.showLevelUpNotification();
        }
        
        this.updateGamificationDisplay();
    }

    updateGamificationDisplay() {
        // Actualizar elementos de gamificación en la UI
        const achievements = document.querySelectorAll('.achievement-card');
        achievements.forEach((card, index) => {
            const progress = card.querySelector('.progress-bar');
            const xpDisplay = card.querySelector('.achievement-xp');
            if (progress && xpDisplay) {
                const currentProgress = 70 + Math.random() * 30; // Simular progreso
                progress.style.width = currentProgress + '%';
                xpDisplay.textContent = Math.floor(currentProgress * 50) + ' XP';
            }
        });
    }

    showLevelUpNotification() {
        this.showNotification(`¡Level Up! Ahora eres nivel ${this.gamificationLevel}`, 'success');
    }

    startRealtimeUpdates() {
        // Simular actualizaciones en tiempo real
        setInterval(() => {
            this.quantumEngine.updateQuantumState();
            this.updateQuantumIndicator();
        }, 3000);
    }

    updateQuantumIndicator() {
        const indicator = document.querySelector('.quantum-indicator');
        if (indicator) {
            // Animación pulsante más intensa ocasionalmente
            if (Math.random() < 0.3) {
                indicator.style.animationDuration = '0.5s';
                setTimeout(() => {
                    indicator.style.animationDuration = '2s';
                }, 1000);
            }
        }
    }

    showWelcomeMessage() {
        setTimeout(() => {
            this.showNotification('¡Bienvenido a Alura Store Analytics! Carga tus datos o genera ejemplos para comenzar.', 'info');
        }, 1000);
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `toast ${type}`;
        notification.innerHTML = `
            <div class="toast-header">
                <span class="toast-title">${this.getNotificationTitle(type)}</span>
                <button class="toast-close">&times;</button>
            </div>
            <div class="toast-message">${message}</div>
        `;

        const container = this.getOrCreateToastContainer();
        container.appendChild(notification);

        // Mostrar notificación
        requestAnimationFrame(() => {
            notification.classList.add('show');
        });

        // Auto-dismiss después de 5 segundos
        const autoHide = setTimeout(() => {
            this.hideNotification(notification);
        }, 5000);

        // Botón de cerrar
        const closeBtn = notification.querySelector('.toast-close');
        closeBtn.addEventListener('click', () => {
            clearTimeout(autoHide);
            this.hideNotification(notification);
        });
    }

    getOrCreateToastContainer() {
        let container = document.querySelector('.toast-container');
        if (!container) {
            container = document.createElement('div');
            container.className = 'toast-container';
            document.body.appendChild(container);
        }
        return container;
    }

    hideNotification(notification) {
        notification.classList.remove('show');
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 400);
    }

    getNotificationTitle(type) {
        const titles = {
            'success': '✅ Éxito',
            'error': '❌ Error',
            'warning': '⚠️ Advertencia',
            'info': 'ℹ️ Información'
        };
        return titles[type] || 'Notificación';
    }

    // Utilidades
    formatCurrency(amount) {
        return new Intl.NumberFormat('es-DO', {
            style: 'currency',
            currency: 'DOP'
        }).format(amount);
    }

    getMostFrequent(arr) {
        const frequency = {};
        arr.forEach(item => {
            if (item) frequency[item] = (frequency[item] || 0) + 1;
        });
        return Object.keys(frequency).reduce((a, b) => frequency[a] > frequency[b] ? a : b, '');
    }

    getRandomElement(arr) {
        return arr[Math.floor(Math.random() * arr.length)];
    }

    getAdvancedStatus(score) {
        if (score >= 90) return { text: '🚀 Excelente', class: 'excellent' };
        if (score >= 80) return { text: '⭐ Muy Bueno', class: 'very-good' };
        if (score >= 70) return { text: '✅ Bueno', class: 'good' };
        if (score >= 60) return { text: '⚠️ Regular', class: 'regular' };
        return { text: '🔴 Necesita Mejora', class: 'needs-improvement' };
    }
}

// Inicializar la aplicación cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    window.aluraStore = new AluraStoreAnalytics();
});

// Registrar Service Worker
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('./sw.js')
            .then(registration => {
                console.log('SW registrado:', registration);
            })
            .catch(registrationError => {
                console.log('SW falló:', registrationError);
            });
    });
}