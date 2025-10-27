// ========================================
// CHART MANAGER - GESTOR DE GRÁFICOS
// ========================================

class ChartManager {
    constructor() {
        this.charts = {};
        this.chartConfigs = this.initializeChartConfigs();
        this.colorPalette = this.initializeColorPalette();
        this.animationDuration = 1500;
        
        console.log('📊 Chart Manager Inicializado');
    }

    initializeColorPalette() {
        return {
            primary: '#F39C12',
            secondary: '#6366F1',
            success: '#10B981',
            danger: '#EF4444',
            warning: '#F59E0B',
            info: '#1E3A8A',
            gradient: {
                gold: ['#F39C12', '#F1C40F'],
                purple: ['#6366F1', '#8B5CF6'],
                emerald: ['#10B981', '#34D399'],
                blue: ['#1E3A8A', '#3B82F6']
            }
        };
    }

    initializeChartConfigs() {
        return {
            defaultOptions: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        labels: {
                            color: '#F8FAFC',
                            font: {
                                family: 'SF Pro Display',
                                size: 12
                            }
                        }
                    },
                    tooltip: {
                        backgroundColor: 'rgba(15, 23, 42, 0.9)',
                        titleColor: '#F39C12',
                        bodyColor: '#F8FAFC',
                        borderColor: '#F39C12',
                        borderWidth: 1,
                        cornerRadius: 8,
                        padding: 12
                    }
                },
                scales: {
                    x: {
                        grid: { color: 'rgba(243, 156, 18, 0.2)' },
                        ticks: { color: '#F8FAFC' }
                    },
                    y: {
                        grid: { color: 'rgba(243, 156, 18, 0.2)' },
                        ticks: { color: '#F8FAFC' }
                    }
                },
                animation: {
                    duration: this.animationDuration,
                    easing: 'easeInOutQuart'
                }
            }
        };
    }

    createAllCharts(storeData) {
        if (!storeData || storeData.length === 0) {
            this.createEmptyCharts();
            return;
        }

        this.createRevenueChart(storeData);
        this.createCategoryChart(storeData);
        this.createTrendChart(storeData);
        this.createScatterChart(storeData);
    }

    createRevenueChart(storeData) {
        const ctx = document.getElementById('revenueChart');
        if (!ctx) return;

        // Destruir gráfico existente
        if (this.charts.revenue) {
            this.charts.revenue.destroy();
        }

        const sortedData = [...storeData].sort((a, b) => (b.revenue || 0) - (a.revenue || 0));
        const labels = sortedData.map(store => store.store || 'Store');
        const revenues = sortedData.map(store => store.revenue || 0);

        this.charts.revenue = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Ingresos',
                    data: revenues,
                    backgroundColor: this.createGradientBackground(ctx, this.colorPalette.gradient.gold),
                    borderColor: this.colorPalette.primary,
                    borderWidth: 2,
                    borderRadius: 8,
                    borderSkipped: false
                }]
            },
            options: {
                ...this.chartConfigs.defaultOptions,
                plugins: {
                    ...this.chartConfigs.defaultOptions.plugins,
                    tooltip: {
                        ...this.chartConfigs.defaultOptions.plugins.tooltip,
                        callbacks: {
                            label: (context) => {
                                return `Ingresos: ${this.formatCurrency(context.raw)}`;
                            }
                        }
                    }
                },
                scales: {
                    ...this.chartConfigs.defaultOptions.scales,
                    y: {
                        ...this.chartConfigs.defaultOptions.scales.y,
                        ticks: {
                            ...this.chartConfigs.defaultOptions.scales.y.ticks,
                            callback: (value) => this.formatCurrency(value)
                        }
                    }
                },
                animation: {
                    ...this.chartConfigs.defaultOptions.animation,
                    onComplete: () => this.addSparkleEffect('revenueChart')
                }
            }
        });
    }

    createCategoryChart(storeData) {
        const ctx = document.getElementById('categoryChart');
        if (!ctx) return;

        if (this.charts.category) {
            this.charts.category.destroy();
        }

        // Agrupar por categoría
        const categoryData = this.groupByCategory(storeData);
        const labels = Object.keys(categoryData);
        const values = Object.values(categoryData);

        this.charts.category = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: labels,
                datasets: [{
                    data: values,
                    backgroundColor: this.generateCategoryColors(labels.length),
                    borderColor: '#0F172A',
                    borderWidth: 3,
                    hoverBorderWidth: 5,
                    hoverOffset: 15
                }]
            },
            options: {
                ...this.chartConfigs.defaultOptions,
                plugins: {
                    ...this.chartConfigs.defaultOptions.plugins,
                    legend: {
                        ...this.chartConfigs.defaultOptions.plugins.legend,
                        position: 'bottom'
                    },
                    tooltip: {
                        ...this.chartConfigs.defaultOptions.plugins.tooltip,
                        callbacks: {
                            label: (context) => {
                                const total = context.dataset.data.reduce((a, b) => a + b, 0);
                                const percentage = ((context.raw / total) * 100).toFixed(1);
                                return `${context.label}: ${this.formatCurrency(context.raw)} (${percentage}%)`;
                            }
                        }
                    }
                },
                animation: {
                    ...this.chartConfigs.defaultOptions.animation,
                    animateRotate: true,
                    animateScale: true,
                    onComplete: () => this.addPulseEffect('categoryChart')
                }
            }
        });
    }

    createTrendChart(storeData) {
        const ctx = document.getElementById('trendChart');
        if (!ctx) return;

        if (this.charts.trend) {
            this.charts.trend.destroy();
        }

        // Simular datos temporales
        const timeData = this.generateTimeSeriesData(storeData);

        this.charts.trend = new Chart(ctx, {
            type: 'line',
            data: {
                labels: timeData.labels,
                datasets: [{
                    label: 'Tendencia de Ingresos',
                    data: timeData.values,
                    borderColor: this.colorPalette.primary,
                    backgroundColor: this.createGradientBackground(ctx, [this.colorPalette.primary + '20', 'transparent']),
                    borderWidth: 3,
                    fill: true,
                    tension: 0.4,
                    pointBackgroundColor: this.colorPalette.primary,
                    pointBorderColor: '#F8FAFC',
                    pointBorderWidth: 2,
                    pointRadius: 6,
                    pointHoverRadius: 8
                }]
            },
            options: {
                ...this.chartConfigs.defaultOptions,
                plugins: {
                    ...this.chartConfigs.defaultOptions.plugins,
                    tooltip: {
                        ...this.chartConfigs.defaultOptions.plugins.tooltip,
                        mode: 'index',
                        intersect: false,
                        callbacks: {
                            label: (context) => {
                                return `Ingresos: ${this.formatCurrency(context.raw)}`;
                            }
                        }
                    }
                },
                scales: {
                    ...this.chartConfigs.defaultOptions.scales,
                    y: {
                        ...this.chartConfigs.defaultOptions.scales.y,
                        ticks: {
                            ...this.chartConfigs.defaultOptions.scales.y.ticks,
                            callback: (value) => this.formatCurrency(value)
                        }
                    }
                },
                interaction: {
                    intersect: false,
                    mode: 'index'
                },
                animation: {
                    ...this.chartConfigs.defaultOptions.animation,
                    onComplete: () => this.addGlowEffect('trendChart')
                }
            }
        });
    }

    createScatterChart(storeData) {
        const ctx = document.getElementById('scatterChart');
        if (!ctx) return;

        if (this.charts.scatter) {
            this.charts.scatter.destroy();
        }

        const scatterData = storeData.map(store => ({
            x: store.efficiency || 50,
            y: store.revenue || 0,
            label: store.store || 'Store',
            category: store.category || 'Unknown'
        }));

        // Agrupar por categoría para diferentes colores
        const categoryGroups = this.groupScatterByCategory(scatterData);

        this.charts.scatter = new Chart(ctx, {
            type: 'scatter',
            data: {
                datasets: categoryGroups.map((group, index) => ({
                    label: group.category,
                    data: group.data,
                    backgroundColor: this.generateCategoryColors(categoryGroups.length)[index],
                    borderColor: this.generateCategoryColors(categoryGroups.length)[index],
                    pointRadius: 8,
                    pointHoverRadius: 12,
                    borderWidth: 2
                }))
            },
            options: {
                ...this.chartConfigs.defaultOptions,
                plugins: {
                    ...this.chartConfigs.defaultOptions.plugins,
                    tooltip: {
                        ...this.chartConfigs.defaultOptions.plugins.tooltip,
                        callbacks: {
                            title: (context) => {
                                return context[0].raw.label || 'Store';
                            },
                            label: (context) => {
                                return [
                                    `Eficiencia: ${context.raw.x}%`,
                                    `Ingresos: ${this.formatCurrency(context.raw.y)}`
                                ];
                            }
                        }
                    }
                },
                scales: {
                    x: {
                        ...this.chartConfigs.defaultOptions.scales.x,
                        title: {
                            display: true,
                            text: 'Eficiencia (%)',
                            color: '#F8FAFC'
                        },
                        min: 0,
                        max: 100
                    },
                    y: {
                        ...this.chartConfigs.defaultOptions.scales.y,
                        title: {
                            display: true,
                            text: 'Ingresos',
                            color: '#F8FAFC'
                        },
                        ticks: {
                            ...this.chartConfigs.defaultOptions.scales.y.ticks,
                            callback: (value) => this.formatCurrency(value)
                        }
                    }
                },
                animation: {
                    ...this.chartConfigs.defaultOptions.animation,
                    onComplete: () => this.addBubbleEffect('scatterChart')
                }
            }
        });
    }

    createEmptyCharts() {
        const chartIds = ['revenueChart', 'categoryChart', 'trendChart', 'scatterChart'];
        
        chartIds.forEach(chartId => {
            const ctx = document.getElementById(chartId);
            if (!ctx) return;

            if (this.charts[chartId.replace('Chart', '')]) {
                this.charts[chartId.replace('Chart', '')].destroy();
            }

            this.charts[chartId.replace('Chart', '')] = new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: ['Sin Datos'],
                    datasets: [{
                        label: 'Sin Datos',
                        data: [0],
                        backgroundColor: 'rgba(243, 156, 18, 0.3)',
                        borderColor: 'rgba(243, 156, 18, 0.8)',
                        borderWidth: 1
                    }]
                },
                options: {
                    ...this.chartConfigs.defaultOptions,
                    plugins: {
                        ...this.chartConfigs.defaultOptions.plugins,
                        legend: { display: false }
                    }
                }
            });
        });
    }

    // Métodos de utilidad para procesamiento de datos
    groupByCategory(storeData) {
        const grouped = {};
        storeData.forEach(store => {
            const category = store.category || 'Sin Categoría';
            grouped[category] = (grouped[category] || 0) + (store.revenue || 0);
        });
        return grouped;
    }

    groupScatterByCategory(scatterData) {
        const grouped = {};
        scatterData.forEach(point => {
            const category = point.category || 'Sin Categoría';
            if (!grouped[category]) {
                grouped[category] = [];
            }
            grouped[category].push(point);
        });

        return Object.keys(grouped).map(category => ({
            category,
            data: grouped[category]
        }));
    }

    generateTimeSeriesData(storeData) {
        const months = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun'];
        const totalRevenue = storeData.reduce((sum, store) => sum + (store.revenue || 0), 0);
        
        // Simular tendencia temporal con variación
        const baseValue = totalRevenue / 6;
        const values = months.map((_, index) => {
            const trend = baseValue * (1 + index * 0.1);
            const variation = trend * (0.8 + Math.random() * 0.4);
            return Math.round(variation);
        });

        return { labels: months, values };
    }

    // Métodos de utilidad para colores y gradientes
    generateCategoryColors(count) {
        const colors = [
            '#F39C12', '#6366F1', '#10B981', '#EF4444', 
            '#F59E0B', '#1E3A8A', '#8B5CF6', '#34D399'
        ];
        
        return Array(count).fill(0).map((_, index) => 
            colors[index % colors.length]
        );
    }

    createGradientBackground(ctx, colors) {
        const gradient = ctx.getContext('2d').createLinearGradient(0, 0, 0, 400);
        if (Array.isArray(colors)) {
            colors.forEach((color, index) => {
                gradient.addColorStop(index / (colors.length - 1), color);
            });
        }
        return gradient;
    }

    // Efectos visuales especiales
    addSparkleEffect(chartId) {
        const canvas = document.getElementById(chartId);
        if (!canvas) return;

        // Agregar clase para efectos CSS
        canvas.classList.add('chart-sparkle');
        setTimeout(() => {
            canvas.classList.remove('chart-sparkle');
        }, 2000);
    }

    addPulseEffect(chartId) {
        const canvas = document.getElementById(chartId);
        if (!canvas) return;

        canvas.classList.add('chart-pulse');
        setTimeout(() => {
            canvas.classList.remove('chart-pulse');
        }, 1500);
    }

    addGlowEffect(chartId) {
        const canvas = document.getElementById(chartId);
        if (!canvas) return;

        canvas.classList.add('chart-glow');
        setTimeout(() => {
            canvas.classList.remove('chart-glow');
        }, 2000);
    }

    addBubbleEffect(chartId) {
        const canvas = document.getElementById(chartId);
        if (!canvas) return;

        canvas.classList.add('chart-bubble');
        setTimeout(() => {
            canvas.classList.remove('chart-bubble');
        }, 1800);
    }

    // Métodos de utilidad
    formatCurrency(amount) {
        return new Intl.NumberFormat('es-DO', {
            style: 'currency',
            currency: 'DOP',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(amount);
    }

    updateChartTheme(theme = 'dark') {
        // Actualizar tema de todos los gráficos
        const textColor = theme === 'dark' ? '#F8FAFC' : '#1F2937';
        const gridColor = theme === 'dark' ? 'rgba(243, 156, 18, 0.2)' : 'rgba(75, 85, 99, 0.2)';

        Object.values(this.charts).forEach(chart => {
            if (chart && chart.options) {
                chart.options.plugins.legend.labels.color = textColor;
                chart.options.scales.x.grid.color = gridColor;
                chart.options.scales.x.ticks.color = textColor;
                chart.options.scales.y.grid.color = gridColor;
                chart.options.scales.y.ticks.color = textColor;
                chart.update();
            }
        });
    }

    exportChart(chartId, format = 'png') {
        const chart = this.charts[chartId];
        if (!chart) return null;

        try {
            const canvas = chart.canvas;
            const dataURL = canvas.toDataURL(`image/${format}`, 1.0);
            
            // Crear link de descarga
            const link = document.createElement('a');
            link.download = `${chartId}_${new Date().getTime()}.${format}`;
            link.href = dataURL;
            link.click();
            
            return dataURL;
        } catch (error) {
            console.error('Error exportando gráfico:', error);
            return null;
        }
    }

    resizeCharts() {
        // Redimensionar todos los gráficos
        Object.values(this.charts).forEach(chart => {
            if (chart && typeof chart.resize === 'function') {
                chart.resize();
            }
        });
    }

    destroyAllCharts() {
        Object.values(this.charts).forEach(chart => {
            if (chart && typeof chart.destroy === 'function') {
                chart.destroy();
            }
        });
        this.charts = {};
    }

    getChartData(chartId) {
        const chart = this.charts[chartId];
        return chart ? chart.data : null;
    }

    updateChartData(chartId, newData) {
        const chart = this.charts[chartId];
        if (chart) {
            chart.data = newData;
            chart.update();
        }
    }
}

// Exportar para uso en otros módulos
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { ChartManager };
}