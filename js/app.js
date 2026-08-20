import { calculateTotalEnergy, calculateEffectiveEnergy, calculateRequiredEnergy, getSeverityClassification } from "./physics.js";
import { initTheme } from "./theme.js";
import { initKineticChart, updateKineticChart, updateChartTheme } from "./chart.js";
import { drawVectorSimulation } from "./vector-canvas.js";
import { loadProductsData, getRecommendedProducts, renderRecommendations } from "./products.js";
import { initReportModal, populateReportCategoryFilter } from "./report.js";

document.addEventListener("DOMContentLoaded", async () => {
  const massInput = document.getElementById("mass");
  const massRange = document.getElementById("massRange");
  const velocityInput = document.getElementById("velocity");
  const velocityRange = document.getElementById("velocityRange");
  const angleInput = document.getElementById("angle");
  const angleRange = document.getElementById("angleRange");
  const angleDisplayBadge = document.getElementById("angleDisplayBadge");
  const anglePills = document.querySelectorAll(".angle-pill");
  const form = document.querySelector(".calculator-form");

  const resultContainer = document.querySelector("#value");
  const resultEffectiveContainer = document.querySelector("#effectiveValue");
  const severityText = document.getElementById("severityText");
  const severityBarFill = document.getElementById("severityBarFill");
  const recommendationsContainer = document.querySelector("#recommendations");
  const recCountBadge = document.getElementById("recCountBadge");

  const chartCanvas = document.getElementById("kineticChart");
  const chartCurrentPoint = document.getElementById("chartCurrentPoint");
  const chartCapacityReq = document.getElementById("chartCapacityReq");
  const vectorCanvas = document.getElementById("vectorCanvas");
  const vectorFormula = document.getElementById("vectorFormula");

  const themeToggle = document.getElementById("themeToggle");
  const reportModal = document.getElementById("reportModal");
  const btnExportReport = document.getElementById("btnExportReport");
  const btnCloseModal = document.getElementById("btnCloseModal");
  const btnCancelModal = document.getElementById("btnCancelModal");
  const btnPrintModal = document.getElementById("btnPrintModal");
  const repVehicle = document.getElementById("repVehicle");
  const repMass = document.getElementById("repMass");
  const repVel = document.getElementById("repVel");
  const repAngle = document.getElementById("repAngle");
  const repTotalEnergy = document.getElementById("repTotalEnergy");
  const repEffectiveEnergy = document.getElementById("repEffectiveEnergy");
  const repReqEnergy = document.getElementById("repReqEnergy");
  const reportProductsList = document.getElementById("reportProductsList");
  const reportCategoryFilter = document.getElementById("reportCategoryFilter");
  const btnSelectAllProducts = document.getElementById("btnSelectAllProducts");
  const btnSelectIdealProduct = document.getElementById("btnSelectIdealProduct");
  const reportDate = document.getElementById("reportDate");
  const reportCode = document.getElementById("reportCode");

  let productsData = { categories: [], products: [] };
  let currentRecommendation = null;
  const currentSelectedVehicleName = "Veículo / Carga Operacional";

  const kineticChart = initKineticChart(chartCanvas);

  initTheme(themeToggle, (theme) => {
    updateChartTheme(kineticChart, theme);
    drawVectorSimulation(vectorCanvas, parseFloat(angleInput?.value || 90), vectorFormula);
  });

  function updateSeverityUI(effectiveJoules) {
    if (!severityText || !severityBarFill) return;
    const severity = getSeverityClassification(effectiveJoules);
    severityText.textContent = severity.label;
    severityText.className = severity.className;
    severityBarFill.style.width = severity.fillPercentage;
  }

  function updateCalculatorAndChart() {
    const mass = parseFloat(massInput?.value) || 0;
    const currentVelKmh = parseFloat(velocityInput?.value) || 0;
    const angle = parseFloat(angleInput?.value) || 90;

    const totalEnergy = calculateTotalEnergy(mass, currentVelKmh);
    const effectiveEnergy = calculateEffectiveEnergy(totalEnergy, angle);
    const requiredEnergy = calculateRequiredEnergy(effectiveEnergy);

    if (resultContainer) resultContainer.innerHTML = `${(totalEnergy / 1000).toFixed(2)} <span class="unit">kJ</span>`;
    if (resultEffectiveContainer) resultEffectiveContainer.innerHTML = `${(effectiveEnergy / 1000).toFixed(2)} <span class="unit">kJ</span>`;

    updateSeverityUI(effectiveEnergy);
    drawVectorSimulation(vectorCanvas, angle, vectorFormula);

    if (chartCurrentPoint) chartCurrentPoint.textContent = `${mass.toLocaleString("pt-BR")} kg @ ${currentVelKmh.toFixed(1)} km/h`;
    if (chartCapacityReq) chartCapacityReq.textContent = `${(requiredEnergy / 1000).toFixed(2)} kJ`;

    updateKineticChart(kineticChart, mass, currentVelKmh, angle);

    if (productsData.products?.length > 0) {
      currentRecommendation = getRecommendedProducts(productsData.products, effectiveEnergy);
      renderRecommendations(recommendationsContainer, recCountBadge, currentRecommendation);
    }
  }

  if (massInput && massRange) {
    massInput.addEventListener("input", () => { massRange.value = massInput.value; updateCalculatorAndChart(); });
    massRange.addEventListener("input", () => { massInput.value = massRange.value; updateCalculatorAndChart(); });
  }

  if (velocityInput && velocityRange) {
    velocityInput.addEventListener("input", () => { velocityRange.value = velocityInput.value; updateCalculatorAndChart(); });
    velocityRange.addEventListener("input", () => { velocityInput.value = velocityRange.value; updateCalculatorAndChart(); });
  }

  function setAngle(newAngle) {
    if (angleInput) angleInput.value = newAngle;
    if (angleRange) angleRange.value = newAngle;
    if (angleDisplayBadge) {
      angleDisplayBadge.textContent = newAngle === 90 ? "90º (Frontal)" : newAngle === 15 ? "15º (Rasante)" : `${newAngle}º`;
    }
    anglePills.forEach((btn) => {
      btn.classList.toggle("active", parseInt(btn.getAttribute("data-angle"), 10) === parseInt(newAngle, 10));
    });
    updateCalculatorAndChart();
  }

  anglePills.forEach((btn) => btn.addEventListener("click", () => setAngle(parseInt(btn.getAttribute("data-angle"), 10))));
  if (angleRange) angleRange.addEventListener("input", () => setAngle(parseInt(angleRange.value, 10)));
  if (form) form.addEventListener("submit", (e) => e.preventDefault());
  window.addEventListener("resize", () => drawVectorSimulation(vectorCanvas, parseFloat(angleInput?.value || 90), vectorFormula));

  initReportModal({
    modal: reportModal,
    btnOpen: btnExportReport,
    btnClose: btnCloseModal,
    btnCancel: btnCancelModal,
    btnPrint: btnPrintModal,
    categoryFilter: reportCategoryFilter,
    btnSelectAll: btnSelectAllProducts,
    btnSelectIdeal: btnSelectIdealProduct,
    productsList: reportProductsList,
    reportDateEl: reportDate,
    reportCodeEl: reportCode,
    repVehicle, repMass, repVel, repAngle, repTotalEnergy, repEffectiveEnergy, repReqEnergy,
    reportProductsList,
    reportCategoryFilter,
    getReportData: () => {
      const mass = parseFloat(massInput?.value) || 0;
      const velKmh = parseFloat(velocityInput?.value) || 0;
      const angle = parseFloat(angleInput?.value) || 90;
      const velMs = velKmh / 3.6;
      const totalEnergy = calculateTotalEnergy(mass, velKmh);
      const effectiveEnergy = calculateEffectiveEnergy(totalEnergy, angle);
      return { vehicleName: currentSelectedVehicleName, mass, velKmh, velMs, angle, totalEnergy, effectiveEnergy, reqEnergy: calculateRequiredEnergy(effectiveEnergy) };
    },
    getCategories: () => productsData.categories,
    getRecommendation: () => currentRecommendation,
  });

  productsData = await loadProductsData("products.json");
  populateReportCategoryFilter(reportCategoryFilter, productsData.categories);
  updateCalculatorAndChart();
});
