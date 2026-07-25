document.addEventListener('DOMContentLoaded', async () => {
  const massInput = document.getElementById('mass');
  const velocityInput = document.getElementById('velocity');
  const angleInput = document.getElementById('angle');
  const categorySelect = document.getElementById('category');

  const resultContainer = document.querySelector('#value');
  const resultContainerAngle = document.querySelector('.result-angle');
  const recommendationsContainer = document.querySelector('#recommendations');
  const form = document.querySelector('.calculator-form');
  const ctx = document.getElementById('kineticChart').getContext('2d');

  let productsData = { categories: [], products: [] };

  try {
    const response = await fetch('products.json');
    productsData = await response.json();
    populateCategorySelect(productsData.categories);
  } catch (err) {
    console.error('Erro ao carregar produtos:', err);
  }

  function populateCategorySelect(categories) {
    if (!categorySelect) return;
    categorySelect.innerHTML = categories
      .map(cat => `<option value="${cat.id}">${cat.name}</option>`)
      .join('');
  }

  const gradient = ctx.createLinearGradient(0, 0, 0, 260);
  gradient.addColorStop(0, 'rgba(243, 108, 33, 0.35)');
  gradient.addColorStop(1, 'rgba(243, 108, 33, 0.0)');

  const kineticChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: [],
      datasets: [{
        label: 'Energia Perpendicular (J)',
        data: [],
        borderColor: '#f36c21',
        borderWidth: 2.5,
        backgroundColor: gradient,
        fill: true,
        tension: 0.35,
        pointBackgroundColor: '#080b11',
        pointBorderColor: '#f36c21',
        pointBorderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 7,
        pointHoverBackgroundColor: '#f36c21',
        pointHoverBorderColor: '#ffffff',
        pointHoverBorderWidth: 2
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      interaction: {
        mode: 'index',
        intersect: false
      },
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: '#121824',
          titleColor: '#f8fafc',
          titleFont: { weight: '600', size: 12 },
          bodyColor: '#f36c21',
          bodyFont: { weight: 'bold', size: 13 },
          borderColor: 'rgba(243, 108, 33, 0.3)',
          borderWidth: 1,
          padding: 10,
          cornerRadius: 8,
          displayColors: false,
          callbacks: {
            title: (items) => `Velocidade: ${items[0].label} km/h`,
            label: (context) => `Energia: ${context.raw.toLocaleString('pt-BR', { maximumFractionDigits: 2 })} J`
          }
        }
      },
      scales: {
        x: {
          grid: {
            color: 'rgba(255, 255, 255, 0.04)',
            drawBorder: false
          },
          ticks: {
            color: '#94a3b8',
            font: { size: 11, family: 'sans-serif' }
          },
          title: {
            display: true,
            text: 'Velocidade (km/h)',
            color: '#64748b',
            font: { size: 11, weight: '500' }
          }
        },
        y: {
          grid: {
            color: 'rgba(255, 255, 255, 0.04)',
            drawBorder: false
          },
          ticks: {
            color: '#94a3b8',
            font: { size: 11, family: 'sans-serif' },
            callback: (value) => value >= 1000 ? `${(value / 1000).toFixed(0)}k J` : `${value} J`
          }
        }
      }
    }
  });

  function formatEnergy(value) {
    if (value >= 1e6) {
      return value.toExponential(2);
    }
    return value.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }

  function getRecommendedProducts(productsList, selectedCategory, totalEnergy, effectiveEnergy) {
    const categoryProducts = productsList.filter(p =>
      p.category_id === selectedCategory && p.capacity_joules > 0
    );

    categoryProducts.sort((a, b) => a.capacity_joules - b.capacity_joules);

    if (categoryProducts.length === 0) {
      return { error: "Nenhum produto com teste de impacto disponível para esta categoria." };
    }

    const targetTotal = totalEnergy * 1.2;
    const targetEffective = effectiveEnergy * 1.2;

    let totalMatch = categoryProducts.find(p => p.capacity_joules >= targetTotal)
      || categoryProducts[categoryProducts.length - 1];

    let effectiveMatch = categoryProducts.find(p => p.capacity_joules >= targetEffective)
      || categoryProducts[categoryProducts.length - 1];

    if (totalMatch.id === effectiveMatch.id && categoryProducts.length > 1) {
      const currentIndex = categoryProducts.findIndex(p => p.id === effectiveMatch.id);
      if (currentIndex < categoryProducts.length - 1) {
        totalMatch = categoryProducts[currentIndex + 1];
      }
    }

    return {
      effectiveProduct: {
        title: "Opção Recomendada (Impacto Real no Ângulo)",
        energyConsidered: effectiveEnergy,
        product: effectiveMatch
      },
      totalProduct: {
        title: "Opção Reforçada (Pior Cenário - Impacto Frontal)",
        energyConsidered: totalEnergy,
        product: totalMatch
      }
    };
  }

  function renderRecommendations(recommendation) {
    if (!recommendationsContainer) return;

    if (recommendation.error) {
      recommendationsContainer.innerHTML = `<p class="rec-error">${recommendation.error}</p>`;
      return;
    }

    const { effectiveProduct, totalProduct } = recommendation;

    const renderCard = (rec) => {
      const imageBlock = rec.product.image
        ? `<img src="${rec.product.image}" alt="${rec.product.name}" />`
        : `<span class="no-image">Sem imagem disponível</span>`;

      return `
        <div class="rec-card">
          <div class="rec-card-image">
            ${imageBlock}
          </div>
          <div class="rec-card-body">
            <span class="rec-card-tag">${rec.title}</span>
            <h4>${rec.product.name}</h4>
            <div class="rec-card-row">
              <span>Energia considerada</span>
              <strong>${formatEnergy(rec.energyConsidered)} J</strong>
            </div>
            <div class="rec-card-row">
              <span>Capacidade do produto</span>
              <strong>${formatEnergy(rec.product.capacity_joules)} J</strong>
            </div>
            <a class="rec-card-link" href="${rec.product.url}" target="_blank" rel="noopener">Ver ficha técnica</a>
          </div>
        </div>
      `;
    };

    recommendationsContainer.innerHTML =
      renderCard(effectiveProduct) + renderCard(totalProduct);
  }

  function updateCalculatorAndChart() {
    const mass = parseFloat(massInput.value) || 0;
    const currentVelKmh = parseFloat(velocityInput.value) || 0;
    const angle = parseFloat(angleInput.value) || 0;

    const velMs = currentVelKmh / 3.6;

    const totalEnergy = 0.5 * mass * Math.pow(velMs, 2);

    if (resultContainer) {
      resultContainer.innerHTML = `${formatEnergy(totalEnergy)} <span class="unit">J</span>`;
    }

    const rad = (angle * Math.PI) / 180;
    const effectiveEnergy = totalEnergy * Math.pow(Math.sin(rad), 2);

    if (resultContainerAngle) {
      resultContainerAngle.innerHTML = `${formatEnergy(effectiveEnergy)} <span class="unit">J</span>`;
    }

    const maxVelKmh = Math.max(currentVelKmh * 1.5, 20);
    const stepKmh = maxVelKmh / 10;
    const labels = [];
    const points = [];

    for (let vKmh = 0; vKmh <= maxVelKmh; vKmh += stepKmh) {
      const vMs = vKmh / 3.6;
      const stepTotalEnergy = 0.5 * mass * Math.pow(vMs, 2);
      const stepEffectiveEnergy = stepTotalEnergy * Math.pow(Math.sin(rad), 2);

      labels.push(vKmh.toFixed(0));
      points.push(stepEffectiveEnergy);
    }

    kineticChart.data.labels = labels;
    kineticChart.data.datasets[0].data = points;
    kineticChart.update('none');

    if (categorySelect && productsData.products.length > 0) {
      const selectedCategory = categorySelect.value;
      const recommendation = getRecommendedProducts(
        productsData.products,
        selectedCategory,
        totalEnergy,
        effectiveEnergy
      );
      renderRecommendations(recommendation);
    }
  }

  massInput.addEventListener('input', updateCalculatorAndChart);
  velocityInput.addEventListener('input', updateCalculatorAndChart);
  angleInput.addEventListener('input', updateCalculatorAndChart);

  if (categorySelect) {
    categorySelect.addEventListener('change', updateCalculatorAndChart);
  }

  if (form) {
    form.addEventListener('submit', (e) => e.preventDefault());
  }

  updateCalculatorAndChart();
});