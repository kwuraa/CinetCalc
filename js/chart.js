
/**
 * Inicializa a instância do Chart.js
 * @param {HTMLCanvasElement} canvasElement
 * @returns {Chart}
 */
export function initKineticChart(canvasElement) {
  if (!canvasElement) return null;
  const ctx = canvasElement.getContext("2d");

  return new Chart(ctx, {
    type: "line",
    data: {
      labels: [],
      datasets: [
        {
          label: "Energia Efetiva no Ângulo (J)",
          data: [],
          borderColor: "#ff6b00",
          borderWidth: 2.5,
          backgroundColor: "rgba(255, 107, 0, 0.15)",
          fill: true,
          tension: 0.35,
          pointBackgroundColor: "#ff6b00",
          pointBorderColor: "#ffffff",
          pointBorderWidth: 2,
          pointRadius: 3.5,
          pointHoverRadius: 6,
        },
        {
          label: "Energia Total Frontal 90º (J)",
          data: [],
          borderColor: "rgba(148, 163, 184, 0.4)",
          borderWidth: 1.5,
          borderDash: [4, 4],
          backgroundColor: "transparent",
          fill: false,
          tension: 0.35,
          pointRadius: 0,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      interaction: { mode: "index", intersect: false },
      plugins: {
        legend: {
          display: true,
          position: "top",
          align: "end",
          labels: {
            color: "#94a3b8",
            font: { size: 10, family: "'Inter', sans-serif" },
            boxWidth: 10,
            boxHeight: 4,
          },
        },
        tooltip: {
          backgroundColor: "rgba(10, 15, 26, 0.95)",
          titleColor: "#ffffff",
          titleFont: { weight: "700", size: 11, family: "'Outfit', sans-serif" },
          bodyColor: "#ffb800",
          bodyFont: { weight: "600", size: 12, family: "'Inter', sans-serif" },
          borderColor: "rgba(255, 107, 0, 0.3)",
          borderWidth: 1,
          padding: 10,
          cornerRadius: 6,
          callbacks: {
            title: (items) => `Velocidade: ${items[0].label} km/h`,
            label: (context) => {
              const val = context.raw || 0;
              const formatted = val.toLocaleString("pt-BR", { maximumFractionDigits: 1 });
              return ` ${context.dataset.label}: ${formatted} J (${(val / 1000).toFixed(2)} kJ)`;
            },
          },
        },
      },
      scales: {
        x: {
          grid: { color: "rgba(255, 255, 255, 0.05)", drawBorder: false },
          ticks: { color: "#94a3b8", font: { size: 10, family: "'Inter', sans-serif" } },
          title: { display: true, text: "Velocidade (km/h)", color: "#64748b", font: { size: 10, weight: "600" } },
        },
        y: {
          grid: { color: "rgba(255, 255, 255, 0.05)", drawBorder: false },
          ticks: {
            color: "#94a3b8",
            font: { size: 10, family: "'Inter', sans-serif" },
            callback: (value) => value >= 1000 ? `${(value / 1000).toFixed(0)}k J` : `${value} J`,
          },
          title: { display: true, text: "Energia (Joules)", color: "#64748b", font: { size: 10, weight: "600" } },
        },
      },
    },
  });
}

/**
 * Atualiza os dados da curva de energia no gráfico
 * @param {Chart} chart
 * @param {number} massKg
 * @param {number} currentVelKmh
 * @param {number} angleDeg
 */
export function updateKineticChart(chart, massKg, currentVelKmh, angleDeg) {
  if (!chart) return;

  const rad = (angleDeg * Math.PI) / 180;
  const maxVelKmh = Math.max(currentVelKmh * 1.6, 25);
  const stepKmh = maxVelKmh / 12;
  const labels = [], pointsEffective = [], pointsTotal = [];

  for (let v = 0; v <= maxVelKmh; v += stepKmh) {
    const vMsStep = v / 3.6;
    const stepTotal = 0.5 * massKg * Math.pow(vMsStep, 2);
    labels.push(v.toFixed(0));
    pointsEffective.push(stepTotal * Math.pow(Math.sin(rad), 2));
    pointsTotal.push(stepTotal);
  }

  chart.data.labels = labels;
  chart.data.datasets[0].data = pointsEffective;
  chart.data.datasets[1].data = pointsTotal;
  chart.update("none");
}

/**
 * Ajusta as cores de grade e textos do gráfico de acordo com o tema
 * @param {Chart} chart
 * @param {'dark' | 'light'} theme
 */
export function updateChartTheme(chart, theme) {
  if (!chart) return;
  const isLight = theme === "light";
  const gridColor = isLight ? "rgba(0, 0, 0, 0.06)" : "rgba(255, 255, 255, 0.05)";
  const tickColor = isLight ? "#475569" : "#94a3b8";
  const titleColor = "#64748b";

  if (chart.options.scales) {
    chart.options.scales.x.grid.color = gridColor;
    chart.options.scales.x.ticks.color = tickColor;
    chart.options.scales.x.title.color = titleColor;
    chart.options.scales.y.grid.color = gridColor;
    chart.options.scales.y.ticks.color = tickColor;
    chart.options.scales.y.title.color = titleColor;
  }

  if (chart.options.plugins?.legend?.labels) {
    chart.options.plugins.legend.labels.color = tickColor;
  }

  if (chart.options.plugins?.tooltip) {
    chart.options.plugins.tooltip.backgroundColor = isLight ? "rgba(255, 255, 255, 0.98)" : "rgba(10, 15, 26, 0.95)";
    chart.options.plugins.tooltip.titleColor = isLight ? "#0f172a" : "#ffffff";
    chart.options.plugins.tooltip.borderColor = isLight ? "rgba(234, 88, 12, 0.3)" : "rgba(255, 107, 0, 0.3)";
  }

  chart.update("none");
}
