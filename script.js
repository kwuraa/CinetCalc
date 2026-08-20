document.addEventListener("DOMContentLoaded", async () => {
  const themeToggle = document.getElementById("themeToggle");
  const htmlRoot = document.documentElement;

  const massInput = document.getElementById("mass");
  const massRange = document.getElementById("massRange");
  const velocityInput = document.getElementById("velocity");
  const velocityRange = document.getElementById("velocityRange");
  const angleInput = document.getElementById("angle");
  const angleRange = document.getElementById("angleRange");
  const angleDisplayBadge = document.getElementById("angleDisplayBadge");
  const categorySelect = document.getElementById("category");

  const resultContainer = document.querySelector("#value");
  const resultKjContainer = document.querySelector("#valueKj");
  const resultEffectiveContainer = document.querySelector("#effectiveValue");
  const resultEffectiveKjContainer = document.querySelector("#effectiveValueKj");
  const severityText = document.getElementById("severityText");
  const severityBarFill = document.getElementById("severityBarFill");
  const recommendationsContainer = document.querySelector("#recommendations");
  const recCountBadge = document.getElementById("recCountBadge");
  const form = document.querySelector(".calculator-form");

  const chartCurrentPoint = document.getElementById("chartCurrentPoint");
  const chartCapacityReq = document.getElementById("chartCapacityReq");

  const vectorCanvas = document.getElementById("vectorCanvas");
  const vectorFormula = document.getElementById("vectorFormula");

  const btnExportReport = document.getElementById("btnExportReport");
  const reportModal = document.getElementById("reportModal");
  const btnCloseModal = document.getElementById("btnCloseModal");
  const btnCancelModal = document.getElementById("btnCancelModal");
  const btnPrintModal = document.getElementById("btnPrintModal");

  const repVehicle = document.getElementById("repVehicle");
  const repCategory = document.getElementById("repCategory");
  const repMass = document.getElementById("repMass");
  const repVel = document.getElementById("repVel");
  const repAngle = document.getElementById("repAngle");
  const repTotalEnergy = document.getElementById("repTotalEnergy");
  const repEffectiveEnergy = document.getElementById("repEffectiveEnergy");
  const repReqEnergy = document.getElementById("repReqEnergy");
  const reportProductsList = document.getElementById("reportProductsList");
  const reportDate = document.getElementById("reportDate");
  const reportCode = document.getElementById("reportCode");

  if (reportDate) {
    const today = new Date();
    reportDate.textContent = today.toLocaleDateString("pt-BR");
    if (reportCode) {
      const codeDate = today.toISOString().slice(0, 10).replace(/-/g, "");
      reportCode.textContent = `DS-FLEX-${codeDate}-${Math.floor(1000 + Math.random() * 9000)}`;
    }
  }

  let currentSelectedVehicleName = "Empilhadeira Retrátil";
  let productsData = { categories: [], products: [] };
  let currentRecommendation = null;

  function getStoredTheme() {
    return localStorage.getItem("docksteel_cinetcalc_theme") || "dark";
  }

  function applyTheme(theme) {
    if (theme === "light") {
      htmlRoot.setAttribute("data-theme", "light");
    } else {
      htmlRoot.removeAttribute("data-theme");
    }
    localStorage.setItem("docksteel_cinetcalc_theme", theme);
    updateChartTheme(theme);
    drawVectorSimulation(parseFloat(angleInput?.value || 90));
  }

  if (themeToggle) {
    themeToggle.addEventListener("click", () => {
      const isLight = htmlRoot.getAttribute("data-theme") === "light";
      applyTheme(isLight ? "dark" : "light");
    });
  }

  try {
    const response = await fetch("products.json");
    productsData = await response.json();
    populateCategorySelect(productsData.categories);
  } catch (err) {
    console.error("Erro ao carregar produtos:", err);
  }

  function populateCategorySelect(categories) {
    if (!categorySelect) return;
    categorySelect.innerHTML = categories
      .map((cat) => `<option value="${cat.id}">${cat.name}</option>`)
      .join("");
  }

  const ctx = document.getElementById("kineticChart").getContext("2d");

  const kineticChart = new Chart(ctx, {
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
      interaction: {
        mode: "index",
        intersect: false,
      },
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
          grid: {
            color: "rgba(255, 255, 255, 0.05)",
            drawBorder: false,
          },
          ticks: {
            color: "#94a3b8",
            font: { size: 10, family: "'Inter', sans-serif" },
          },
          title: {
            display: true,
            text: "Velocidade (km/h)",
            color: "#64748b",
            font: { size: 10, weight: "600" },
          },
        },
        y: {
          grid: {
            color: "rgba(255, 255, 255, 0.05)",
            drawBorder: false,
          },
          ticks: {
            color: "#94a3b8",
            font: { size: 10, family: "'Inter', sans-serif" },
            callback: (value) =>
              value >= 1000 ? `${(value / 1000).toFixed(0)}k J` : `${value} J`,
          },
          title: {
            display: true,
            text: "Energia (Joules)",
            color: "#64748b",
            font: { size: 10, weight: "600" },
          },
        },
      },
    },
  });

  function updateChartTheme(theme) {
    const isLight = theme === "light";
    const gridColor = isLight ? "rgba(0, 0, 0, 0.06)" : "rgba(255, 255, 255, 0.05)";
    const tickColor = isLight ? "#475569" : "#94a3b8";
    const titleColor = isLight ? "#64748b" : "#64748b";

    if (kineticChart.options.scales) {
      kineticChart.options.scales.x.grid.color = gridColor;
      kineticChart.options.scales.x.ticks.color = tickColor;
      kineticChart.options.scales.x.title.color = titleColor;

      kineticChart.options.scales.y.grid.color = gridColor;
      kineticChart.options.scales.y.ticks.color = tickColor;
      kineticChart.options.scales.y.title.color = titleColor;
    }

    if (kineticChart.options.plugins?.legend?.labels) {
      kineticChart.options.plugins.legend.labels.color = tickColor;
    }

    if (kineticChart.options.plugins?.tooltip) {
      kineticChart.options.plugins.tooltip.backgroundColor = isLight
        ? "rgba(255, 255, 255, 0.98)"
        : "rgba(10, 15, 26, 0.95)";
      kineticChart.options.plugins.tooltip.titleColor = isLight ? "#0f172a" : "#ffffff";
      kineticChart.options.plugins.tooltip.borderColor = isLight
        ? "rgba(234, 88, 12, 0.3)"
        : "rgba(255, 107, 0, 0.3)";
    }

    kineticChart.update("none");
  }

  function drawVectorSimulation(angleDeg) {
    if (!vectorCanvas) return;
    const ctx2 = vectorCanvas.getContext("2d");
    
    const rect = vectorCanvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    const width = rect.width > 0 ? rect.width : 360;
    const height = rect.height > 0 ? rect.height : 130;

    if (vectorCanvas.width !== Math.floor(width * dpr) || vectorCanvas.height !== Math.floor(height * dpr)) {
      vectorCanvas.width = Math.floor(width * dpr);
      vectorCanvas.height = Math.floor(height * dpr);
    }
    
    ctx2.save();
    ctx2.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx2.clearRect(0, 0, width, height);

    const isLight = htmlRoot.getAttribute("data-theme") === "light";

    ctx2.strokeStyle = isLight ? "rgba(0, 0, 0, 0.04)" : "rgba(255, 255, 255, 0.035)";
    ctx2.lineWidth = 1;
    for (let x = 16; x < width; x += 20) {
      ctx2.beginPath();
      ctx2.moveTo(x, 0);
      ctx2.lineTo(x, height);
      ctx2.stroke();
    }
    for (let y = 16; y < height; y += 20) {
      ctx2.beginPath();
      ctx2.moveTo(0, y);
      ctx2.lineTo(width, y);
      ctx2.stroke();
    }

    const barrierY = height - 26;
    const barrierHeight = 12;
    const barrierStartX = 24;
    const barrierEndX = width - 24;
    const barrierWidth = barrierEndX - barrierStartX;

    ctx2.fillStyle = isLight ? "rgba(0, 0, 0, 0.06)" : "rgba(0, 0, 0, 0.4)";
    ctx2.beginPath();
    ctx2.roundRect(barrierStartX, barrierY + 2, barrierWidth, barrierHeight + 2, 4);
    ctx2.fill();

    ctx2.fillStyle = "#ffb800";
    ctx2.beginPath();
    ctx2.roundRect(barrierStartX, barrierY, barrierWidth, barrierHeight, 4);
    ctx2.fill();

    ctx2.save();
    ctx2.beginPath();
    ctx2.roundRect(barrierStartX, barrierY, barrierWidth, barrierHeight, 4);
    ctx2.clip();

    ctx2.fillStyle = "#111827";
    for (let bx = barrierStartX - 10; bx < barrierEndX + 20; bx += 22) {
      ctx2.beginPath();
      ctx2.moveTo(bx, barrierY);
      ctx2.lineTo(bx + 10, barrierY + barrierHeight);
      ctx2.lineTo(bx + 4, barrierY + barrierHeight);
      ctx2.lineTo(bx - 6, barrierY);
      ctx2.closePath();
      ctx2.fill();
    }
    ctx2.restore();

    ctx2.fillStyle = "#ff6b00";
    ctx2.beginPath();
    ctx2.arc(barrierStartX + 4, barrierY + barrierHeight / 2, 7, 0, Math.PI * 2);
    ctx2.arc(barrierEndX - 4, barrierY + barrierHeight / 2, 7, 0, Math.PI * 2);
    ctx2.fill();

    ctx2.fillStyle = "#ffffff";
    ctx2.beginPath();
    ctx2.arc(barrierStartX + 4, barrierY + barrierHeight / 2, 2.5, 0, Math.PI * 2);
    ctx2.arc(barrierEndX - 4, barrierY + barrierHeight / 2, 2.5, 0, Math.PI * 2);
    ctx2.fill();

    ctx2.fillStyle = isLight ? "#64748b" : "#94a3b8";
    ctx2.font = "600 10px 'Inter', sans-serif";
    ctx2.textAlign = "left";
    ctx2.fillText("BARREIRA DS-FLEX", barrierStartX + 16, barrierY + barrierHeight + 16);

    const targetX = Math.round(width * 0.54);
    const targetY = barrierY;

    const rad = (angleDeg * Math.PI) / 180;
    const vectorLength = Math.min(height - 48, 68);

    const startX = targetX - Math.cos(rad) * vectorLength;
    const startY = targetY - Math.sin(rad) * vectorLength;

    ctx2.setLineDash([3, 3]);
    ctx2.strokeStyle = isLight ? "rgba(100, 116, 139, 0.4)" : "rgba(148, 163, 184, 0.35)";
    ctx2.lineWidth = 1.2;
    ctx2.beginPath();
    ctx2.moveTo(targetX, targetY - (vectorLength + 6));
    ctx2.lineTo(targetX, targetY);
    ctx2.stroke();
    ctx2.setLineDash([]);

    if (angleDeg < 90) {
      ctx2.fillStyle = isLight ? "#94a3b8" : "#64748b";
      ctx2.font = "500 8.5px 'Inter', sans-serif";
      ctx2.textAlign = "center";
      ctx2.fillText("90º ref", targetX, targetY - (vectorLength + 10));
    }

    if (angleDeg < 90) {
      ctx2.strokeStyle = "#ffb800";
      ctx2.lineWidth = 1.8;
      ctx2.beginPath();
      ctx2.arc(targetX, targetY, 26, Math.PI, Math.PI + (90 - angleDeg) * (Math.PI / 180), false);
      ctx2.stroke();
    }

    ctx2.strokeStyle = "#ff6b00";
    ctx2.lineWidth = 3.5;
    ctx2.beginPath();
    ctx2.moveTo(startX, startY);
    ctx2.lineTo(targetX, targetY);
    ctx2.stroke();

    const headLength = 10;
    const arrowAngle = Math.atan2(targetY - startY, targetX - startX);
    ctx2.fillStyle = "#ff6b00";
    ctx2.beginPath();
    ctx2.moveTo(targetX, targetY);
    ctx2.lineTo(
      targetX - headLength * Math.cos(arrowAngle - Math.PI / 7),
      targetY - headLength * Math.sin(arrowAngle - Math.PI / 7)
    );
    ctx2.lineTo(
      targetX - headLength * 0.5 * Math.cos(arrowAngle),
      targetY - headLength * 0.5 * Math.sin(arrowAngle)
    );
    ctx2.lineTo(
      targetX - headLength * Math.cos(arrowAngle + Math.PI / 7),
      targetY - headLength * Math.sin(arrowAngle + Math.PI / 7)
    );
    ctx2.closePath();
    ctx2.fill();

    ctx2.strokeStyle = "#ff6b00";
    ctx2.lineWidth = 2;
    ctx2.beginPath();
    ctx2.arc(targetX, targetY, 4, 0, Math.PI * 2);
    ctx2.stroke();

    ctx2.save();
    ctx2.translate(startX, startY);
    ctx2.rotate(arrowAngle);

    ctx2.fillStyle = "#0284c7";
    ctx2.beginPath();
    ctx2.roundRect(-16, -9, 20, 18, 3);
    ctx2.fill();

    ctx2.fillStyle = "#0f172a";
    ctx2.fillRect(-11, -6, 10, 12);
    ctx2.strokeStyle = "#38bdf8";
    ctx2.lineWidth = 1;
    ctx2.strokeRect(-11, -6, 10, 12);

    ctx2.fillStyle = "#f59e0b";
    ctx2.fillRect(-16, -7, 3, 14);

    ctx2.fillStyle = "#94a3b8";
    ctx2.fillRect(4, -7, 8, 3);
    ctx2.fillRect(4, 4, 8, 3);

    ctx2.restore();

    const badgeText = `Vetor: ${angleDeg}º`;
    ctx2.font = "bold 10px 'Inter', sans-serif";
    const textWidth = ctx2.measureText(badgeText).width;
    const badgePadX = 6;
    const badgeH = 18;
    const badgeW = textWidth + badgePadX * 2;

    let badgeX, badgeY;
    if (angleDeg === 90) {
      badgeX = targetX - badgeW / 2;
      badgeY = Math.max(6, startY - 26);
    } else {
      badgeX = Math.max(10, Math.min(width - badgeW - 10, startX - badgeW / 2));
      badgeY = Math.max(6, startY - 26);
    }

    ctx2.fillStyle = isLight ? "#ffffff" : "#0f172a";
    ctx2.strokeStyle = "#ff6b00";
    ctx2.lineWidth = 1.2;
    ctx2.beginPath();
    ctx2.roundRect(badgeX, badgeY, badgeW, badgeH, 4);
    ctx2.fill();
    ctx2.stroke();

    ctx2.fillStyle = isLight ? "#0f172a" : "#f8fafc";
    ctx2.textAlign = "center";
    ctx2.textBaseline = "middle";
    ctx2.fillText(badgeText, badgeX + badgeW / 2, badgeY + badgeH / 2);

    ctx2.restore();

    if (vectorFormula) {
      if (angleDeg === 90) {
        vectorFormula.textContent = "E_efetiva = E_total × 1.00 (100% da Força Frontal)";
      } else {
        const factor = Math.pow(Math.sin(rad), 2).toFixed(2);
        vectorFormula.textContent = `E_efetiva = E_total × sen²(${angleDeg}º) [× ${factor}]`;
      }
    }
  }

  function formatEnergy(value) {
    if (value >= 1e6) {
      return value.toExponential(2);
    }
    return value.toLocaleString("pt-BR", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  }

  function updateSeverity(effectiveJoules) {
    if (!severityText || !severityBarFill) return;

    if (effectiveJoules < 5000) {
      severityText.textContent = "Leve Impacto (< 5 kJ)";
      severityText.className = "severity-badge low";
      severityBarFill.style.width = "22%";
    } else if (effectiveJoules < 20000) {
      severityText.textContent = "Médio Impacto (5 - 20 kJ)";
      severityText.className = "severity-badge medium";
      severityBarFill.style.width = "50%";
    } else if (effectiveJoules < 45000) {
      severityText.textContent = "Alto Impacto (20 - 45 kJ)";
      severityText.className = "severity-badge high";
      severityBarFill.style.width = "80%";
    } else {
      severityText.textContent = "Severo / Extremo (> 45 kJ)";
      severityText.className = "severity-badge extreme";
      severityBarFill.style.width = "100%";
    }
  }

  function getRecommendedProducts(productsList, selectedCategory, totalEnergy, effectiveEnergy) {
    const categoryProducts = productsList
      .filter((p) => p.category_id === selectedCategory && p.capacity_joules > 0)
      .sort((a, b) => a.capacity_joules - b.capacity_joules);

    if (categoryProducts.length === 0) {
      return {
        error: "Nenhum produto cadastrado com capacidade de teste de impacto para esta categoria.",
      };
    }

    const targetTotal = totalEnergy * 1.2;
    const targetEffective = effectiveEnergy * 1.2;

    const effectiveMatch = categoryProducts.find((p) => p.capacity_joules >= targetEffective);
    const totalMatch = categoryProducts.find((p) => p.capacity_joules >= targetTotal);

    return {
      effectiveProduct: effectiveMatch
        ? {
            title: "Recomendação Ideal (Ângulo Real +20%)",
            energyConsidered: effectiveEnergy,
            targetRequired: targetEffective,
            product: effectiveMatch,
          }
        : null,
      totalProduct: totalMatch
        ? {
            title: "Opção Reforçada (Pior Cenário 90º)",
            energyConsidered: totalEnergy,
            targetRequired: targetTotal,
            product: totalMatch,
          }
        : null,
      allCategoryProducts: categoryProducts,
    };
  }

  function renderRecommendations(recommendation) {
    if (!recommendationsContainer) return;
    currentRecommendation = recommendation;

    if (recommendation.error) {
      if (recCountBadge) recCountBadge.textContent = "0 Soluções Disponíveis";
      recommendationsContainer.innerHTML = `
        <div class="rec-card rec-card-unavailable" style="grid-column: 1 / -1;">
          <h4>Atenção</h4>
          <p>${recommendation.error}</p>
        </div>
      `;
      return;
    }

    const { effectiveProduct, totalProduct, allCategoryProducts } = recommendation;
    if (recCountBadge) {
      recCountBadge.textContent = `${allCategoryProducts.length} Produtos na Categoria`;
    }

    function renderCard(rec, type) {
      if (!rec) {
        const title =
          type === "effective"
            ? "Recomendação Ideal (Ângulo Real)"
            : "Opção Reforçada (Pior Cenário 90º)";

        return `
          <div class="rec-card rec-card-unavailable">
            <span class="rec-card-hero-tag ${type}">
              ${title}
            </span>
            <div class="rec-card-body">
              <h4>Sobrecarga Extrema</h4>
              <p>A energia calculada (${formatEnergy(type === "effective" ? effectiveProduct?.energyConsidered || 0 : totalProduct?.energyConsidered || 0)} J) excede a capacidade padrão dos produtos cadastrados nesta categoria com +20% de margem preventiva.</p>
            </div>
          </div>
        `;
      }

      const prod = rec.product;
      const capacity = prod.capacity_joules;
      const usagePercent = Math.min(100, Math.max(5, Math.round((rec.energyConsidered / capacity) * 100)));
      const marginPercent = Math.max(0, Math.round(((capacity - rec.energyConsidered) / capacity) * 100));

      const imageBlock = prod.image
        ? `<img src="${prod.image}" alt="Docksteel ${prod.name}" loading="lazy" />`
        : `<span class="no-image">Imagem Técnica Indisponível</span>`;

      return `
        <div class="rec-card">
          <span class="rec-card-hero-tag ${type}">
            ${rec.title}
          </span>

          <div class="rec-card-image">
            ${imageBlock}
          </div>

          <div class="rec-card-body">
            <div class="rec-card-title-row">
              <h4>${prod.name}</h4>
              <span class="rec-capacity-pill">${formatEnergy(capacity)} J</span>
            </div>

            <div class="rec-capacity-meter">
              <div class="meter-header">
                <span>Uso da Capacidade (${usagePercent}%)</span>
                <strong>🛡️ Margem Segura: ${marginPercent}%</strong>
              </div>
              <div class="meter-track">
                <div class="meter-fill" style="width: ${usagePercent}%;"></div>
              </div>
            </div>

            <div class="rec-card-specs">
              <div class="rec-card-row">
                <span>Impacto Considerado:</span>
                <strong>${formatEnergy(rec.energyConsidered)} J (${(rec.energyConsidered / 1000).toFixed(2)} kJ)</strong>
              </div>
              <div class="rec-card-row">
                <span>Capacidade Homologada:</span>
                <strong>${formatEnergy(capacity)} J (${(capacity / 1000).toFixed(1)} kJ)</strong>
              </div>
              <div class="rec-card-row">
                <span>Tecnologia:</span>
                <strong style="color: var(--ds-yellow);">Boplan® Flex Impact®</strong>
              </div>
            </div>

            <div class="rec-card-actions">
              <a class="rec-card-link" href="${prod.url}" target="_blank" rel="noopener">
                <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>
                Ver Ficha Técnica
              </a>
            </div>

          </div>
        </div>
      `;
    }

    recommendationsContainer.innerHTML =
      renderCard(effectiveProduct, "effective") +
      renderCard(totalProduct, "total");
  }

  function updateCalculatorAndChart() {
    const mass = parseFloat(massInput.value) || 0;
    const currentVelKmh = parseFloat(velocityInput.value) || 0;
    const angle = parseFloat(angleInput.value) || 90;

    const velMs = currentVelKmh / 3.6;
    const totalEnergy = 0.5 * mass * Math.pow(velMs, 2);
    const rad = (angle * Math.PI) / 180;
    const effectiveEnergy = totalEnergy * Math.pow(Math.sin(rad), 2);

    if (resultContainer) {
      resultContainer.innerHTML = `${formatEnergy(totalEnergy)} <span class="unit">J</span>`;
    }
    if (resultKjContainer) {
      resultKjContainer.textContent = `≈ ${(totalEnergy / 1000).toFixed(2)} kJ`;
    }

    if (resultEffectiveContainer) {
      resultEffectiveContainer.innerHTML = `${formatEnergy(effectiveEnergy)} <span class="unit">J</span>`;
    }
    if (resultEffectiveKjContainer) {
      resultEffectiveKjContainer.textContent = `≈ ${(effectiveEnergy / 1000).toFixed(2)} kJ`;
    }

    updateSeverity(effectiveEnergy);
    drawVectorSimulation(angle);

    if (chartCurrentPoint) {
      chartCurrentPoint.textContent = `${mass.toLocaleString("pt-BR")} kg @ ${currentVelKmh.toFixed(1)} km/h`;
    }
    if (chartCapacityReq) {
      const req = effectiveEnergy * 1.2;
      chartCapacityReq.textContent = `${formatEnergy(req)} J (${(req / 1000).toFixed(2)} kJ)`;
    }

    const maxVelKmh = Math.max(currentVelKmh * 1.6, 25);
    const stepKmh = maxVelKmh / 12;

    const labels = [];
    const pointsEffective = [];
    const pointsTotal = [];

    for (let v = 0; v <= maxVelKmh; v += stepKmh) {
      const vMsStep = v / 3.6;
      const stepTotal = 0.5 * mass * Math.pow(vMsStep, 2);
      const stepEffective = stepTotal * Math.pow(Math.sin(rad), 2);

      labels.push(v.toFixed(0));
      pointsEffective.push(stepEffective);
      pointsTotal.push(stepTotal);
    }

    kineticChart.data.labels = labels;
    kineticChart.data.datasets[0].data = pointsEffective;
    kineticChart.data.datasets[1].data = pointsTotal;
    kineticChart.update("none");

    if (categorySelect && productsData.products && productsData.products.length > 0) {
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

  if (massInput && massRange) {
    massInput.addEventListener("input", () => {
      massRange.value = massInput.value;
      updateCalculatorAndChart();
    });
    massRange.addEventListener("input", () => {
      massInput.value = massRange.value;
      updateCalculatorAndChart();
    });
  }

  if (velocityInput && velocityRange) {
    velocityInput.addEventListener("input", () => {
      velocityRange.value = velocityInput.value;
      updateCalculatorAndChart();
    });
    velocityRange.addEventListener("input", () => {
      velocityInput.value = velocityRange.value;
      updateCalculatorAndChart();
    });
  }

  const anglePills = document.querySelectorAll(".angle-pill");

  function setAngle(newAngle) {
    angleInput.value = newAngle;
    if (angleRange) angleRange.value = newAngle;

    if (angleDisplayBadge) {
      if (newAngle === 90) {
        angleDisplayBadge.textContent = "90º (Frontal)";
      } else if (newAngle === 15) {
        angleDisplayBadge.textContent = "15º (Rasante)";
      } else {
        angleDisplayBadge.textContent = `${newAngle}º`;
      }
    }

    anglePills.forEach((btn) => {
      if (parseInt(btn.getAttribute("data-angle"), 10) === parseInt(newAngle, 10)) {
        btn.classList.add("active");
      } else {
        btn.classList.remove("active");
      }
    });

    updateCalculatorAndChart();
  }

  anglePills.forEach((btn) => {
    btn.addEventListener("click", () => {
      const val = parseInt(btn.getAttribute("data-angle"), 10);
      setAngle(val);
    });
  });

  if (angleRange) {
    angleRange.addEventListener("input", () => {
      setAngle(parseInt(angleRange.value, 10));
    });
  }

  if (categorySelect) {
    categorySelect.addEventListener("change", updateCalculatorAndChart);
  }

  if (form) {
    form.addEventListener("submit", (e) => e.preventDefault());
  }

  const presetButtons = document.querySelectorAll(".preset-btn");
  presetButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      presetButtons.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");

      const m = btn.getAttribute("data-mass");
      const v = btn.getAttribute("data-vel");
      const a = btn.getAttribute("data-angle") || 90;
      currentSelectedVehicleName = btn.getAttribute("data-name") || "Veículo Industrial";

      if (massInput) massInput.value = m;
      if (massRange) massRange.value = m;
      if (velocityInput) velocityInput.value = v;
      if (velocityRange) velocityRange.value = v;

      setAngle(parseInt(a, 10));
    });
  });

  function populateReportModal() {
    const mass = parseFloat(massInput.value) || 0;
    const currentVelKmh = parseFloat(velocityInput.value) || 0;
    const angle = parseFloat(angleInput.value) || 90;
    const velMs = currentVelKmh / 3.6;
    const totalEnergy = 0.5 * mass * Math.pow(velMs, 2);
    const rad = (angle * Math.PI) / 180;
    const effectiveEnergy = totalEnergy * Math.pow(Math.sin(rad), 2);
    const reqEnergy = effectiveEnergy * 1.2;

    if (repVehicle) repVehicle.textContent = currentSelectedVehicleName;
    if (repCategory && categorySelect) {
      const selectedOption = categorySelect.options[categorySelect.selectedIndex];
      repCategory.textContent = selectedOption ? selectedOption.textContent : "Geral";
    }
    if (repMass) repMass.textContent = `${mass.toLocaleString("pt-BR")} kg`;
    if (repVel) repVel.textContent = `${currentVelKmh.toFixed(1)} km/h (${velMs.toFixed(2)} m/s)`;
    if (repAngle) repAngle.textContent = `${angle}º ${angle === 90 ? "(Frontal)" : ""}`;
    if (repTotalEnergy) repTotalEnergy.textContent = `${formatEnergy(totalEnergy)} J`;
    if (repEffectiveEnergy) repEffectiveEnergy.textContent = `${formatEnergy(effectiveEnergy)} J`;
    if (repReqEnergy) repReqEnergy.textContent = `${formatEnergy(reqEnergy)} J`;

    if (reportProductsList && currentRecommendation) {
      const { effectiveProduct, totalProduct } = currentRecommendation;
      let html = "";
      if (effectiveProduct && effectiveProduct.product) {
        html += `
          <div class="report-prod-item">
            <div>
              <strong>${effectiveProduct.product.name} (Opção Recomendada - Ângulo Real)</strong>
              <div style="font-size: 0.75rem; color: #64748b;">Tecnologia Flex Impact® Boplan</div>
            </div>
            <span>${formatEnergy(effectiveProduct.product.capacity_joules)} Joules</span>
          </div>
        `;
      }
      if (totalProduct && totalProduct.product && (!effectiveProduct || totalProduct.product.id !== effectiveProduct.product.id)) {
        html += `
          <div class="report-prod-item">
            <div>
              <strong>${totalProduct.product.name} (Opção Reforçada - Impacto Frontal 90º)</strong>
              <div style="font-size: 0.75rem; color: #64748b;">Máxima absorção de choque</div>
            </div>
            <span>${formatEnergy(totalProduct.product.capacity_joules)} Joules</span>
          </div>
        `;
      }
      if (!html) {
        html = `<p style="color: #ef4444; font-size: 0.85rem;">Nenhum produto cadastrado com capacidade suficiente para a energia calculada.</p>`;
      }
      reportProductsList.innerHTML = html;
    }
  }

  if (btnExportReport && reportModal) {
    btnExportReport.addEventListener("click", () => {
      populateReportModal();
      reportModal.classList.add("active");
    });
  }

  if (btnCloseModal && reportModal) {
    btnCloseModal.addEventListener("click", () => {
      reportModal.classList.remove("active");
    });
  }

  if (btnCancelModal && reportModal) {
    btnCancelModal.addEventListener("click", () => {
      reportModal.classList.remove("active");
    });
  }

  if (reportModal) {
    reportModal.addEventListener("click", (e) => {
      if (e.target === reportModal) {
        reportModal.classList.remove("active");
      }
    });
  }

  if (btnPrintModal) {
    btnPrintModal.addEventListener("click", () => {
      window.print();
    });
  }

  window.addEventListener("resize", () => {
    drawVectorSimulation(parseFloat(angleInput?.value || 90));
  });

  const initialTheme = getStoredTheme();
  applyTheme(initialTheme);

  updateCalculatorAndChart();
});
