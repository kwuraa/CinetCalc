document.addEventListener('DOMContentLoaded', () => {
  const massInput = document.getElementById('mass');
  const velocityInput = document.getElementById('velocity');
  const resultContainer = document.querySelector('.result-value');
  const form = document.querySelector('.calculator-form');
  const ctx = document.getElementById('kineticChart').getContext('2d');

  const gradient = ctx.createLinearGradient(0, 0, 0, 260);
  gradient.addColorStop(0, 'rgba(56, 189, 248, 0.4)'); 
  gradient.addColorStop(1, 'rgba(56, 189, 248, 0.0)'); 

 
  const kineticChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: [], 
      datasets: [{
        label: 'Energia (J)',
        data: [], 
        borderColor: '#38bdf8', 
        borderWidth: 2,
        backgroundColor: gradient,
        fill: true,
        tension: 0.4, 
        pointBackgroundColor: '#2563eb',
        pointBorderColor: '#38bdf8',
        pointRadius: 3,
        pointHoverRadius: 6
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: '#121824',
          titleColor: '#f8fafc',
          bodyColor: '#38bdf8',
          borderColor: 'rgba(255, 255, 255, 0.1)',
          borderWidth: 1,
          displayColors: false,
          callbacks: {
            label: (context) => `Energia: ${context.raw.toLocaleString('pt-BR')} J`
          }
        }
      },
      scales: {
        x: {
          grid: { color: 'rgba(255, 255, 255, 0.05)' },
          ticks: { color: '#94a3b8', font: { size: 10 } },
          title: { display: true, text: 'Velocidade (m/s)', color: '#94a3b8', font: { size: 11 } }
        },
        y: {
          grid: { color: 'rgba(255, 255, 255, 0.05)' },
          ticks: { color: '#94a3b8', font: { size: 10 } }
        }
      }
    }
  });

  function updateCalculatorAndChart() {
    const mass = parseFloat(massInput.value) || 0;
    const currentVel = parseFloat(velocityInput.value) || 0;

    const energy = 0.5 * mass * Math.pow(currentVel, 2);
    let formattedValue = energy >= 1e6 ? energy.toExponential(2) : energy.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    resultContainer.innerHTML = `${formattedValue} <span class="unit">J</span>`;

    const maxVel = Math.max(currentVel * 1.5, 10);
    const step = maxVel / 10;
    const labels = [];
    const points = [];

    for (let v = 0; v <= maxVel; v += step) {
      labels.push(v.toFixed(1));
      points.push(0.5 * mass * Math.pow(v, 2));
    }

    kineticChart.data.labels = labels;
    kineticChart.data.datasets[0].data = points;
    kineticChart.update('none'); 
  }

  massInput.addEventListener('input', updateCalculatorAndChart);
  velocityInput.addEventListener('input', updateCalculatorAndChart);
  form.addEventListener('submit', (e) => e.preventDefault());

  updateCalculatorAndChart();
});