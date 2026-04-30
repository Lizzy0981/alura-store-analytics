
// ═══════════════════════════════════════════════════════════════
// LANGUAGE MANAGER — 11 idiomas · Traducción 100% de la página
// ═══════════════════════════════════════════════════════════════
class LanguageManager {
    constructor() {
        this.currentLang = localStorage.getItem('alura-lang') || 'es';
        this.translations = {};
        this.languages = [
            { code: 'es', flag: '🇪🇸', name: 'Español',  rtl: false },
            { code: 'en', flag: '🇺🇸', name: 'English',  rtl: false },
            { code: 'pt', flag: '🇧🇷', name: 'Português', rtl: false },
            { code: 'fr', flag: '🇫🇷', name: 'Français', rtl: false },
            { code: 'ru', flag: '🇷🇺', name: 'Русский',  rtl: false },
            { code: 'tr', flag: '🇹🇷', name: 'Türkçe',   rtl: false },
            { code: 'ar', flag: '🇸🇦', name: 'العربية',  rtl: true  },
            { code: 'he', flag: '🇮🇱', name: 'עברית',    rtl: true  },
            { code: 'zh', flag: '🇨🇳', name: '中文',      rtl: false },
            { code: 'ja', flag: '🇯🇵', name: '日本語',    rtl: false },
            { code: 'ko', flag: '🇰🇷', name: '한국어',    rtl: false }
        ];
        this.rtl = ['ar', 'he'];
    }

    async init() {
        try {
            const response = await fetch('assets/data/translations.json');
            this.translations = await response.json();
            console.log('✅ Translations loaded:', Object.keys(this.translations).length, 'languages');
        } catch(e) {
            console.warn('Translations not loaded:', e);
            this.translations = {};
        }
        this.renderSelector();
        this.apply(this.currentLang);
        console.log('✅ LanguageManager initialized successfully');
    }

    renderSelector() {
        const container = document.getElementById('lang-selector-header');
        if (!container) return;

        const currentLangObj = this.languages.find(l => l.code === this.currentLang) || this.languages[0];

        container.innerHTML = `
            <div class="language-selector" id="languageSelector">
                <button class="lang-btn" id="languageBtn">
                    <span class="flag" id="currentFlag">${currentLangObj.flag}</span>
                    <span class="lang-text" id="currentLang">${currentLangObj.code.toUpperCase()}</span>
                    <span class="arrow">▼</span>
                </button>
                <div class="lang-dropdown" id="langDropdown">
                    ${this.languages.map(l => `
                    <div class="lang-option${l.code === this.currentLang ? ' active' : ''}" data-lang="${l.code}">
                        <span class="flag">${l.flag}</span>
                        <span>${l.name}</span>
                    </div>`).join('')}
                </div>
            </div>`;

        // Toggle dropdown
        const btn = container.querySelector('#languageBtn');
        const dropdown = container.querySelector('#langDropdown');
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            dropdown.classList.toggle('active');
            btn.querySelector('.arrow').textContent = dropdown.classList.contains('active') ? '▲' : '▼';
        });
        document.addEventListener('click', () => {
            dropdown.classList.remove('active');
            btn.querySelector('.arrow').textContent = '▼';
        });

        // Opciones
        container.querySelectorAll('.lang-option').forEach(opt => {
            opt.addEventListener('click', (e) => {
                e.stopPropagation();
                this.setLanguage(opt.dataset.lang);
                dropdown.classList.remove('active');
                btn.querySelector('.arrow').textContent = '▼';
            });
        });
    }

    setLanguage(lang) {
        if (!this.translations[lang]) {
            console.warn('Language not found:', lang);
            return;
        }
        this.currentLang = lang;
        localStorage.setItem('alura-lang', lang);
        this.apply(lang);
        this.renderSelector();
    }

    t(key) {
        return this.getNestedTranslation(this.currentLang, key) || key;
    }

    getNestedTranslation(lang, key) {
        const keys = key.split('.');
        let obj = (this.translations || {})[lang] || {};
        for (const k of keys) {
            if (obj == null) return null;
            obj = obj[k];
        }
        return obj || null;
    }

    apply(lang) {
        if (!this.translations[lang]) return;
        this.currentLang = lang;
        localStorage.setItem('alura-lang', lang);

        // ── Dirección RTL ──────────────────────────────────────
        const isRTL = this.rtl.includes(lang);
        document.documentElement.setAttribute('dir', isRTL ? 'rtl' : 'ltr');
        document.documentElement.setAttribute('lang', lang);
        document.body.style.direction = isRTL ? 'rtl' : 'ltr';
        console.log(isRTL ? '↩️ RTL mode enabled' : '↔️ LTR mode enabled');

        // ── Traducir todos los elementos con data-translate ────
        const elements = document.querySelectorAll('[data-translate]');
        console.log(`📋 Found ${elements.length} elements to translate`);
        let translated = 0;
        elements.forEach(el => {
            const key = el.getAttribute('data-translate');
            const text = this.getNestedTranslation(lang, key);
            if (text) {
                el.textContent = text;
                translated++;
            }
        });
        console.log(`✅ Translated ${translated} elements`);

        // ── KPI labels dinámicos ───────────────────────────────
        const t = this.translations[lang] || {};
        const kpis = t.kpis || {};
        const safeSet = (id, val) => { const el = document.getElementById(id); if(el && val) el.textContent = val; };
        // Los valores numéricos no se tocan, solo labels
    }
}

window.langManager = new LanguageManager();

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
        // languageManager disponible en window.langManager;
        
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

        (results.insights || []).forEach(insight => {
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
        const insightsTexts = (window.langManager?.translations?.[window.langManager?.currentLang]?.insights) || [
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


function loadDemoFile(filename) {
  const url = 'Datos Alura Store/' + filename;
  fetch(url).then(r => r.text()).then(txt => {
    const blob = new Blob([txt], {type:'text/csv'});
    const file = new File([blob], filename, {type:'text/csv'});
    const dt = new DataTransfer();
    dt.items.add(file);
    const fi = document.getElementById('csvFileInput');
    if(fi) fi.files = dt.files;
    if(window.app && window.app.processData) window.app.processData(file);
    const sec = document.getElementById('uploadContainer');
    if(sec) sec.scrollIntoView({behavior:'smooth'});
    console.log('Demo cargado:', filename);
  }).catch(e => {
    console.warn('Demo file not available remotely, showing placeholder data');
    if(window.app && window.app.generateDemoData) window.app.generateDemoData(filename);
  });
}


// DEMO FILE LOADER - Clean version
window.loadDemoFile = function(filename) {
    var BASE = 'https://raw.githubusercontent.com/Lizzy0981/alura-store-analytics/main/Datos%20Alura%20Store/';
    var url = BASE + encodeURIComponent(filename);
    
    fetch(url)
        .then(function(r) {
            if (!r.ok) throw new Error('HTTP ' + r.status);
            return r.text();
        })
        .then(function(csvText) {
            // Navigate to overview tab
            var overviewBtn = document.querySelector('.tab-btn[data-tab="overview"]');
            if (overviewBtn) overviewBtn.click();
            
            // Load via app processor
            if (window.app && window.app.processCSV) {
                window.app.processCSV(csvText, filename);
            } else {
                document.dispatchEvent(new CustomEvent('demo:fileLoaded', { detail: { csv: csvText, filename: filename } }));
                alert('Archivo cargado: ' + filename + '. Ve a Upload para ver los datos.');
            }
        })
        .catch(function(err) {
            console.error('Error loading demo:', err);
            alert('Error al cargar el archivo demo: ' + err.message);
        });
};

// TAB SWITCHING for Demo section
document.addEventListener('DOMContentLoaded', function() {
    // Handle demo tab in horizontal nav
    document.querySelectorAll('.tab-btn[data-tab="demo"]').forEach(function(btn) {
        btn.addEventListener('click', function() {
            document.querySelectorAll('.tab-section').forEach(function(s) { s.style.display = 'none'; });
            document.querySelectorAll('.tab-btn').forEach(function(b) { b.classList.remove('active'); });
            var demoSection = document.getElementById('demo-section');
            if (demoSection) demoSection.style.display = '';
            btn.classList.add('active');
            document.querySelectorAll('.nav-item').forEach(function(n) { n.classList.remove('active'); });
            var demoNav = document.querySelector('.nav-item[data-section="demo"]');
            if (demoNav) demoNav.classList.add('active');
        });
    });
    
    // Handle demo in sidebar
    document.querySelectorAll('.nav-item[data-section="demo"]').forEach(function(btn) {
        btn.addEventListener('click', function() {
            var demoTabBtn = document.querySelector('.tab-btn[data-tab="demo"]');
            if (demoTabBtn) demoTabBtn.click();
        });
    });
});

// TAB NAVIGATION SCROLL - smooth scrolling for tab buttons
(function() {
    function initTabNav() {
        var TAB_MAP = {
            "overview": "#kpiSection",
            "revenue": "#uploadContainer",
            "growth": "#aiInsightsContainer",
            "inventory": "#storesTableBody",
            "operations": "#reportsSection",
            "demo": "#demoSection"
        };
        var tabBtns = document.querySelectorAll(".tab-btn[data-tab]");
        tabBtns.forEach(function(btn) {
            btn.addEventListener("click", function() {
                var tabName = this.getAttribute("data-tab");
                tabBtns.forEach(function(b) { b.classList.remove("active"); });
                this.classList.add("active");
                var selector = TAB_MAP[tabName];
                if (selector) {
                    var section = document.querySelector(selector);
                    if (!section && tabName === "demo") section = document.getElementById("demoSection");
                    if (section) section.scrollIntoView({ behavior: "smooth", block: "start" });
                }
            });
        });
    }
    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", initTabNav);
    } else {
        initTabNav();
    }
})();






// =============================================================
// SPA NAVIGATION SYSTEM
// Each tab click shows ONLY its section, hides all others
// =============================================================
(function initSPA() {
  // Map: data-tab value -> array of CSS selectors to show
  const SPA_MAP = {
    'overview':   ['.gamification-panel', '.kpis-container'],
    'revenue':    ['.data-upload-area'],
    'growth':     ['.charts-container', '.ai-insights'],
    'inventory':  ['.intelligent-table'],
    'operations': ['#reportsSection'],
    'demo':       ['#demoSection']
  };

  // All sections SPA controls
  const ALL_SECTIONS = [
    '.gamification-panel',
    '.kpis-container',
    '.data-upload-area',
    '.charts-container',
    '.ai-insights',
    '.intelligent-table',
    '#reportsSection',
    '#demoSection'
  ];

  function showSection(tabKey, scroll) {
    // Hide all sections
    ALL_SECTIONS.forEach(sel => {
      const el = document.querySelector(sel);
      if (el) el.classList.remove('spa-active');
    });

    // Show only the sections for this tab
    const toShow = SPA_MAP[tabKey] || SPA_MAP['overview'];
    toShow.forEach(sel => {
      const el = document.querySelector(sel);
      if (el) el.classList.add('spa-active');
    });

    // Scroll to top only when user clicks (not on init)
    if (scroll) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    // Update active state on HORIZONTAL tab buttons (.tab-btn)
    document.querySelectorAll('.tab-btn').forEach(btn => {
      btn.classList.toggle('active', btn.getAttribute('data-tab') === tabKey);
    });

    // Update active state on SIDEBAR buttons (.nav-item with data-tab)
    document.querySelectorAll('.sidebar .nav-item[data-tab]').forEach(btn => {
      btn.classList.toggle('active', btn.getAttribute('data-tab') === tabKey);
    });

    // Save current tab
    try { sessionStorage.setItem('spa_tab', tabKey); } catch(e) {}
  }

  function initListeners() {
    // Horizontal tab nav buttons (.tab-btn)
    document.querySelectorAll('.tab-btn').forEach(btn => {
      btn.addEventListener('click', function(e) {
        e.preventDefault();
        const tabKey = this.getAttribute('data-tab');
        if (tabKey) showSection(tabKey, true);
      });
    });

    // SIDEBAR nav buttons (.nav-item with data-tab) - use data-tab directly
    document.querySelectorAll('.sidebar .nav-item[data-tab]').forEach(btn => {
      btn.addEventListener('click', function(e) {
        e.preventDefault();
        const tabKey = this.getAttribute('data-tab');
        if (tabKey) showSection(tabKey, true);
      });
    });
  }

  // Init: show default section WITHOUT scrolling
  function onReady() {
    let lastTab = 'overview';
    try { lastTab = sessionStorage.getItem('spa_tab') || 'overview'; } catch(e) {}
    showSection(lastTab, false);
    initListeners();
    console.log('SPA Navigation initialized - tab:', lastTab);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', onReady);
  } else {
    setTimeout(onReady, 50);
  }
})();
