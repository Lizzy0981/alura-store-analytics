
// ═══════════════════════════════════════════════════════════════
// LANGUAGE MANAGER — 11 idiomas · Traducción 100% de la página
// ═══════════════════════════════════════════════════════════════
class LanguageManager {
    constructor() {
        this.current = localStorage.getItem('alura_lang') ||
                       navigator.language.slice(0,2) || 'es';
        this.supported = ['es','en','pt','fr','ru','tr','ar','he','zh','ja','ko'];
        this.rtl       = ['ar','he'];
        this.flags     = {
            es:'🇪🇸', en:'🇺🇸', pt:'🇧🇷', fr:'🇫🇷',
            ru:'🇷🇺', tr:'🇹🇷', ar:'🇸🇦', he:'🇮🇱',
            zh:'🇨🇳', ja:'🇯🇵', ko:'🇰🇷'
        };
        this.names = {
            es:'Español', en:'English', pt:'Português', fr:'Français',
            ru:'Русский', tr:'Türkçe', ar:'العربية', he:'עברית',
            zh:'中文', ja:'日本語', ko:'한국어'
        };
        if (!this.supported.includes(this.current)) this.current = 'es';
        this.t = {};
    }

    async init() {
        try {
            const r = await fetch('assets/data/translations.json');
            const all = await r.json();
            this.t = all;
            this.renderSelector();
            this.apply(this.current);
        } catch(e) {
            console.warn('Translations not loaded:', e);
        }
    }

    apply(lang) {
        if (!this.t[lang]) return;
        this.current = lang;
        localStorage.setItem('alura_lang', lang);

        // ── Dirección RTL/LTR ──────────────────────────────────
        const isRTL = this.rtl.includes(lang);
        document.documentElement.setAttribute('dir', isRTL ? 'rtl' : 'ltr');
        document.documentElement.setAttribute('lang', lang);
        document.body.style.direction = isRTL ? 'rtl' : 'ltr';

        const T = this.t[lang];

        // ── Traducir todos los elementos con data-i18n ─────────
        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.getAttribute('data-i18n');
            if (T[key] !== undefined) el.textContent = T[key];
        });

        // ── Traducir placeholders ──────────────────────────────
        document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
            const key = el.getAttribute('data-i18n-placeholder');
            if (T[key] !== undefined) el.setAttribute('placeholder', T[key]);
        });

        // ── Traducir títulos (title attribute) ─────────────────
        document.querySelectorAll('[data-i18n-title]').forEach(el => {
            const key = el.getAttribute('data-i18n-title');
            if (T[key] !== undefined) el.setAttribute('title', T[key]);
        });

        // ── Elementos específicos por ID ───────────────────────
        const map = {
            'app-title':           T.app_title,
            'app-subtitle':        T.app_subtitle,
            'system-active-text':  T.system_active,
            'kpi-total-revenue':   T.total_revenue,
            'kpi-active-stores':   T.active_stores,
            'kpi-avg-ticket':      T.avg_ticket,
            'kpi-top-category':    T.top_category,
            'kpi-ai-growth':       T.ai_growth,
            'kpi-quantum-score':   T.quantum_score,
            'upload-title':        T.upload_title,
            'upload-subtitle':     T.upload_subtitle,
            'btn-select-file':     T.select_file,
            'btn-generate-sample': T.generate_sample,
            'btn-process-data':    T.process_data,
            'btn-clear-data':      T.clear_data,
            'chart-title-revenue': T.chart_revenue,
            'chart-title-cat':     T.chart_category,
            'chart-title-trend':   T.chart_trend,
            'chart-title-matrix':  T.chart_matrix,
            'reports-title':       T.reports_title,
            'ai-insights-title':   T.ai_insights,
            'store-ranking-title': T.store_ranking,
            'footer-tagline':      T.footer_text,
            'footer-copyright':    T.footer_copy,
            'badge-data-master':   T.data_master,
            'badge-speed':         T.speed_analyzer,
            'badge-ai-explorer':   T.ai_explorer,
        };
        Object.entries(map).forEach(([id, val]) => {
            const el = document.getElementById(id);
            if (el && val) el.textContent = val;
        });

        // ── Tabla ranking ──────────────────────────────────────
        const thMap = {
            'th-rank':    T.col_rank,
            'th-store':   T.col_store,
            'th-cat':     T.col_category,
            'th-revenue': T.col_revenue,
            'th-ai':      T.col_ai_score,
            'th-quantum': T.col_quantum,
            'th-status':  T.col_status,
        };
        Object.entries(thMap).forEach(([id, val]) => {
            const el = document.getElementById(id);
            if (el && val) el.textContent = val;
        });

        // ── Reportes ───────────────────────────────────────────
        const reports = [
            ['report-executive', T.report_executive, T.report_executive_desc],
            ['report-financial',  T.report_financial,  T.report_financial_desc],
            ['report-predictive', T.report_predictive, T.report_predictive_desc],
            ['report-trends',     T.report_trends,     T.report_trends_desc],
            ['report-segment',    T.report_segmentation, T.report_segmentation_desc],
            ['report-quantum',    T.report_quantum,    T.report_quantum_desc],
        ];
        reports.forEach(([id, title, desc]) => {
            const titleEl = document.getElementById(id + '-title');
            const descEl  = document.getElementById(id + '-desc');
            if (titleEl && title) titleEl.textContent = title;
            if (descEl  && desc)  descEl.textContent  = desc;
        });

        // ── Botones PDF/Excel en reportes ──────────────────────
        document.querySelectorAll('.btn-pdf').forEach(el  => el.textContent = T.btn_pdf);
        document.querySelectorAll('.btn-excel').forEach(el => el.textContent = T.btn_excel);

        // ── Actualizar selector visual ─────────────────────────
        const current = document.getElementById('current-lang');
        if (current) {
            current.textContent = `${this.flags[lang]} ${this.names[lang]}`;
        }
        document.querySelectorAll('.lang-option').forEach(el => {
            el.classList.toggle('active', el.dataset.lang === lang);
        });

        // ── Disparar evento para otros módulos ─────────────────
        window.dispatchEvent(new CustomEvent('languageChanged', {detail: {lang, T}}));
    }

    renderSelector() {
        const container = document.getElementById('lang-selector');
        if (!container) return;
        container.innerHTML = `
            <button class="lang-btn" id="current-lang" onclick="window.langManager.toggleDropdown()">
                ${this.flags[this.current]} ${this.names[this.current]} ▼
            </button>
            <div class="lang-dropdown" id="lang-dropdown">
                ${this.supported.map(l => `
                    <div class="lang-option ${l===this.current?'active':''}"
                         data-lang="${l}"
                         onclick="window.langManager.apply('${l}')">
                        ${this.flags[l]} ${this.names[l]}
                    </div>
                `).join('')}
            </div>`;
    }

    toggleDropdown() {
        const dd = document.getElementById('lang-dropdown');
        if (dd) dd.classList.toggle('open');
    }

    get(key) {
        return (this.t[this.current] || {})[key] || key;
    }
}

// ── Inicialización global ──────────────────────────────────────
window.langManager = new LanguageManager();
document.addEventListener('DOMContentLoaded', () => window.langManager.init());

// ── Cerrar dropdown al hacer clic fuera ───────────────────────
document.addEventListener('click', e => {
    if (!e.target.closest('#lang-selector')) {
        const dd = document.getElementById('lang-dropdown');
        if (dd) dd.classList.remove('open');
    }
});


// ========================================
// SISTEMA DE IDIOMAS / LANGUAGE MANAGER
// ========================================

class LanguageManager {
    constructor() {
        this.currentLang = localStorage.getItem('alura-lang') || 'es';
        (this.translations || {}) = {};
        this.langConfig = {
            'es': { name: 'Español', flag: '🇪🇸' },
            'en': { name: 'English', flag: '🇺🇸' },
            'pt': { name: 'Português', flag: '🇧🇷' },
            'fr': { name: 'Français', flag: '🇫🇷' },
            'ar': { name: 'العربية', flag: '🇸🇦' },
            'he': { name: 'עברית', flag: '🇮🇱' },
            'zh': { name: '中文', flag: '🇨🇳' }
        };
        
        this.isReady = false;
        this.init();
    }

    async init() {
        await this.loadTranslations();
        this.setupLanguageSelector();
        this.applyLanguage(this.currentLang);
        this.isReady = true;
        console.log('✅ LanguageManager initialized successfully');
    }

    async loadTranslations() {
        try {
            console.log('🌐 Loading translations from assets/data/translations.json...');
            const response = await fetch('./assets/data/translations.json');
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            (this.translations || {}) = await response.json();
            console.log('✅ Translations loaded:', Object.keys((this.translations || {})));
        } catch (error) {
            console.error('❌ Error loading translations:', error);
            // Fallback translations
            (this.translations || {}) = {
                es: {
                    title: "Alura Store Analytics",
                    subtitle: "Quantum AI Business Intelligence Dashboard",
                    quantum_status: "Sistema Cuántico Activo"
                }
            };
            console.warn('⚠️ Using fallback translations');
        }
    }

    setupLanguageSelector() {
        const langBtn = document.getElementById('languageBtn');
        const langDropdown = document.getElementById('languageDropdown');
        const langOptions = document.querySelectorAll('.language-option');

        if (!langBtn || !langDropdown) {
            console.error('❌ Language selector elements not found in DOM');
            return;
        }

        console.log('🎨 Setting up language selector...');

        // Toggle dropdown
        langBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            langDropdown.classList.toggle('active');
            langBtn.classList.toggle('active');
        });

        // Close dropdown when clicking outside
        document.addEventListener('click', () => {
            langDropdown.classList.remove('active');
            langBtn.classList.remove('active');
        });

        // Language selection
        langOptions.forEach(option => {
            option.addEventListener('click', (e) => {
                e.stopPropagation();
                const selectedLang = option.dataset.lang;
                console.log('🌍 Language selected:', selectedLang);
                this.changeLanguage(selectedLang);
                langDropdown.classList.remove('active');
                langBtn.classList.remove('active');
            });
        });
        
        console.log('✅ Language selector configured');
    }

    changeLanguage(lang) {
        console.log('🔄 Changing language to:', lang);
        this.currentLang = lang;
        localStorage.setItem('alura-lang', lang);
        this.applyLanguage(lang);
        this.updateLanguageButton(lang);
        
        // Disparar evento personalizado para que otros componentes puedan reaccionar
        document.dispatchEvent(new CustomEvent('languageChanged', { detail: { lang } }));
        
        console.log('✅ Language changed successfully to:', lang);
    }

    applyLanguage(lang) {
        console.log('📝 Applying language:', lang);
        const elements = document.querySelectorAll('[data-translate]');
        console.log('📋 Found', elements.length, 'elements to translate');
        
        let translatedCount = 0;
        elements.forEach(element => {
            const key = element.getAttribute('data-translate');
            const translation = this.getNestedTranslation(lang, key);
            if (translation) {
                element.textContent = translation;
                translatedCount++;
            } else {
                console.warn('⚠️ Translation not found for key:', key);
            }
        });
        
        console.log('✅ Translated', translatedCount, 'elements');

        // Update HTML lang attribute
        document.documentElement.lang = lang;

        // Apply RTL for Arabic and Hebrew
        if (lang === 'ar' || lang === 'he') {
            document.body.setAttribute('dir', 'rtl');
            console.log('↔️ RTL mode enabled');
        } else {
            document.body.setAttribute('dir', 'ltr');
            console.log('↔️ LTR mode enabled');
        }
    }

    getNestedTranslation(lang, key) {
        const keys = key.split('.');
        let value = (this.translations || {})[lang];
        
        for (const k of keys) {
            if (value && typeof value === 'object') {
                value = value[k];
            } else {
                return null;
            }
        }
        
        return value;
    }

    updateLanguageButton(lang) {
        const currentFlag = document.getElementById('currentFlag');
        const currentLang = document.getElementById('currentLang');
        
        if (currentFlag && currentLang && this.langConfig[lang]) {
            currentFlag.textContent = this.langConfig[lang].flag;
            currentLang.textContent = lang.toUpperCase();
        }

        // Update active state in dropdown
        document.querySelectorAll('.language-option').forEach(option => {
            if (option.dataset.lang === lang) {
                option.classList.add('active');
            } else {
                option.classList.remove('active');
            }
        });
    }

    t(key) {
        return this.getNestedTranslation(this.currentLang, key) || key;
    }
}

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
        this.languageManager = new LanguageManager();
        
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.createQuantumParticles();
        this.initializeGamification();
        this.generateAIInsights();
        this.startRealtimeUpdates();
        this.showWelcomeMessage();
        
        // Escuchar cambios de idioma para regenerar contenido dinámico
        document.addEventListener('languageChanged', () => {
            this.generateAIInsights();
        });
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
                        const row = {};
                        headers.forEach((header, index) => {
                            row[header] = values[index];
                        });
                        this.storeData.push(row);
                    }
                }

                this.analyzeData();
                this.showNotification('✅ Datos cargados exitosamente!', 'success');
                this.addXP(100);
            } catch (error) {
                this.showNotification('❌ Error al procesar el archivo', 'error');
                console.error(error);
            }
        };
        reader.readAsText(file);
    }

    generateSampleData() {
        const stores = ['TechHub Norte', 'TechHub Sur', 'TechHub Centro', 'TechHub Este', 'TechHub Oeste', 'TechHub Plaza', 'TechHub Mall', 'TechHub Express'];
        const categories = ['Electrónicos', 'Ropa', 'Alimentos', 'Hogar', 'Deportes', 'Libros', 'Juguetes'];
        
        this.storeData = [];
        for (let i = 0; i < 100; i++) {
            this.storeData.push({
                tienda: this.getRandomElement(stores),
                categoria: this.getRandomElement(categories),
                ingresos: Math.floor(Math.random() * 50000) + 10000,
                fecha: this.getRandomDate(),
                unidades: Math.floor(Math.random() * 500) + 50
            });
        }

        this.analyzeData();
        this.showNotification('⚡ Datos de ejemplo generados!', 'success');
        this.addXP(50);
    }

    analyzeData() {
        if (this.storeData.length === 0) return;

        // Calcular KPIs
        this.calculateKPIs();
        
        // Generar gráficos
        this.generateCharts();
        
        // Análisis ML
        const mlResults = this.mlAlgorithms.analyze(this.storeData);
        this.displayMLInsights(mlResults);
        
        // Análisis Cuántico
        const quantumResults = this.quantumEngine.analyze(this.storeData);
        this.displayQuantumResults(quantumResults);
        
        // Actualizar tabla
        this.updateIntelligentTable();
    }

    calculateKPIs() {
        const totalRevenue = this.storeData.reduce((sum, item) => {
            return sum + parseFloat(item.ingresos || 0);
        }, 0);

        const activeStores = new Set(this.storeData.map(item => item.tienda)).size;
        
        const avgTicket = totalRevenue / this.storeData.length;

        const categoryRevenue = {};
        this.storeData.forEach(item => {
            const cat = item.categoria;
            categoryRevenue[cat] = (categoryRevenue[cat] || 0) + parseFloat(item.ingresos || 0);
        });

        const topCategory = Object.keys(categoryRevenue).reduce((a, b) => 
            categoryRevenue[a] > categoryRevenue[b] ? a : b
        );

        // Actualizar UI
        document.getElementById('totalRevenue').textContent = '$' + totalRevenue.toLocaleString('es-ES');
        document.getElementById('activeStores').textContent = activeStores;
        document.getElementById('avgTicket').textContent = '$' + Math.floor(avgTicket).toLocaleString('es-ES');
        document.getElementById('topCategory').textContent = topCategory;
        
        // Calcular crecimiento IA
        const aiGrowth = this.mlAlgorithms.predictGrowth(this.storeData);
        document.getElementById('aiGrowth').textContent = aiGrowth > 0 ? `+${aiGrowth}%` : `${aiGrowth}%`;

        // Calcular Score Cuántico
        const quantumScore = this.quantumEngine.calculateScore(this.storeData);
        document.getElementById('quantumScore').textContent = quantumScore;
    }

    generateCharts() {
        // Ingresos por Tienda
        const storeRevenue = {};
        this.storeData.forEach(item => {
            const store = item.tienda;
            storeRevenue[store] = (storeRevenue[store] || 0) + parseFloat(item.ingresos || 0);
        });

        this.chartManager.createBarChart('revenueChart', {
            labels: Object.keys(storeRevenue),
            data: Object.values(storeRevenue),
            label: 'Ingresos por Tienda'
        });

        // Distribución por Categoría
        const categoryRevenue = {};
        this.storeData.forEach(item => {
            const cat = item.categoria;
            categoryRevenue[cat] = (categoryRevenue[cat] || 0) + parseFloat(item.ingresos || 0);
        });

        this.chartManager.createDoughnutChart('categoryChart', {
            labels: Object.keys(categoryRevenue),
            data: Object.values(categoryRevenue)
        });

        // Tendencia Temporal
        const temporalData = this.mlAlgorithms.getTemporalTrend(this.storeData);
        this.chartManager.createLineChart('trendChart', temporalData);

        // Matriz de Rentabilidad
        const profitabilityData = this.mlAlgorithms.getProfitabilityMatrix(this.storeData);
        this.chartManager.createScatterChart('profitabilityChart', profitabilityData);
    }

    displayMLInsights(results) {
        const container = document.getElementById('aiInsightsContainer');
        container.innerHTML = '';

        results.insights.forEach(insight => {
            const insightEl = document.createElement('div');
            insightEl.className = 'insight-item';
            insightEl.innerHTML = `
                <div class="insight-icon">${insight.icon}</div>
                <div class="insight-text">${insight.text}</div>
            `;
            container.appendChild(insightEl);
        });
    }

    displayQuantumResults(results) {
        console.log('Quantum Analysis Results:', results);
        // Aquí puedes agregar visualización adicional si lo deseas
    }

    updateIntelligentTable() {
        const tbody = document.getElementById('storesTableBody');
        tbody.innerHTML = '';

        // Calcular scores para cada tienda
        const storeStats = {};
        this.storeData.forEach(item => {
            const store = item.tienda;
            if (!storeStats[store]) {
                storeStats[store] = {
                    tienda: store,
                    categoria: item.categoria,
                    ingresos: 0,
                    count: 0
                };
            }
            storeStats[store].ingresos += parseFloat(item.ingresos || 0);
            storeStats[store].count++;
        });

        // Convertir a array y ordenar
        const storesArray = Object.values(storeStats).map(store => {
            const aiScore = this.mlAlgorithms.calculateStoreScore(store);
            const quantumScore = this.quantumEngine.calculateStoreScore(store);
            return { ...store, aiScore, quantumScore };
        }).sort((a, b) => b.aiScore - a.aiScore);

        // Renderizar tabla
        storesArray.forEach((store, index) => {
            const row = tbody.insertRow();
            const status = this.getAdvancedStatus(store.aiScore);
            
            row.innerHTML = `
                <td><strong>#${index + 1}</strong></td>
                <td>${store.tienda}</td>
                <td>${store.categoria}</td>
                <td>$${Math.floor(store.ingresos).toLocaleString('es-ES')}</td>
                <td>${store.aiScore}</td>
                <td>${store.quantumScore}</td>
                <td><span class="status-badge ${status.class}">${status.text}</span></td>
            `;
        });
    }

    generateAIInsights() {
        const icons = ['🎯', '⚡', '🧠', '📊'];
        const insightsTexts = this.languageManager.translations[this.languageManager.currentLang].insights || [
            'El sistema de IA está optimizado y listo para analizar datos',
            'Motor cuántico con 256 qubits virtuales activo',
            'Algoritmos de Machine Learning entrenados y calibrados',
            'Visualizaciones interactivas preparadas para insights en tiempo real'
        ];

        const container = document.getElementById('aiInsightsContainer');
        container.innerHTML = '';

        insightsTexts.forEach((text, index) => {
            const insightEl = document.createElement('div');
            insightEl.className = 'insight-item';
            insightEl.innerHTML = `
                <div class="insight-icon">${icons[index]}</div>
                <div class="insight-text">${text}</div>
            `;
            container.appendChild(insightEl);
        });
    }

    initializeGamification() {
        // Sistema de gamificación ya inicializado en el HTML
        this.loadGameProgress();
    }

    loadGameProgress() {
        const savedLevel = localStorage.getItem('alura-level');
        const savedXP = localStorage.getItem('alura-xp');
        
        if (savedLevel) this.gamificationLevel = parseInt(savedLevel);
        if (savedXP) this.currentXP = parseInt(savedXP);
    }

    addXP(amount) {
        this.currentXP += amount;
        localStorage.setItem('alura-xp', this.currentXP);
        
        const levelUpThreshold = this.gamificationLevel * 1000;
        if (this.currentXP >= levelUpThreshold) {
            this.levelUp();
        }
    }

    levelUp() {
        this.gamificationLevel++;
        localStorage.setItem('alura-level', this.gamificationLevel);
        this.showNotification(`🎉 ¡Nivel ${this.gamificationLevel} alcanzado!`, 'success');
    }

    startRealtimeUpdates() {
        // Simulación de actualizaciones en tiempo real
        setInterval(() => {
            if (this.storeData.length > 0) {
                this.apiConnector.fetchRealtimeData();
            }
        }, 30000); // Cada 30 segundos
    }

    showWelcomeMessage() {
        setTimeout(() => {
            this.showNotification('🚀 ¡Bienvenido a Alura Store Analytics!', 'info');
        }, 1000);
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: var(--glass-bg);
            backdrop-filter: blur(20px);
            padding: 15px 25px;
            border-radius: 10px;
            border: 1px solid var(--border-elegant);
            color: var(--text-light);
            z-index: 1000;
            animation: slideInRight 0.5s ease-out;
        `;

        document.body.appendChild(notification);

        setTimeout(() => {
            notification.style.animation = 'slideOutRight 0.5s ease-out';
            setTimeout(() => notification.remove(), 500);
        }, 3000);
    }

    getRandomDate() {
        const start = new Date(2024, 0, 1);
        const end = new Date();
        return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()))
            .toISOString().split('T')[0];
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
    window.app = new AluraStoreAnalytics();
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
