export async function loadProductsData(url = "products.json") {
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error("Erro ao carregar produtos:", error);
    return { categories: [], products: [] };
  }
}

export function getRecommendedProducts(productsList, effectiveEnergyJoules) {
  const requiredJoules = effectiveEnergyJoules * 1.2;
  const fitting = (productsList || [])
    .filter((p) => p.capacity_joules > 0 && p.capacity_joules >= requiredJoules)
    .sort((a, b) => a.capacity_joules - b.capacity_joules);
  return { fitting, requiredJoules, effectiveEnergy: effectiveEnergyJoules };
}

export function renderRecommendations(container, countBadge, recommendation) {
  if (!container) return;
  const { fitting, requiredJoules, effectiveEnergy } = recommendation;

  if (countBadge) {
    countBadge.textContent = fitting.length > 0
      ? `${fitting.length} produto${fitting.length > 1 ? "s" : ""} compatível${fitting.length > 1 ? "is" : ""}`
      : "Nenhum produto compatível";
  }

  if (fitting.length === 0) {
    container.innerHTML = `
      <div class="rec-card rec-card-unavailable" style="grid-column: 1 / -1;">
        <div class="rec-card-body">
          <h4>Nenhum produto compatível</h4>
          <p>A energia requerida de <strong>${(requiredJoules / 1000).toFixed(2)} kJ</strong> (efetiva + 20%) excede a capacidade de todos os produtos cadastrados. Entre em contato com a Docksteel para uma solução personalizada.</p>
        </div>
      </div>
    `;
    return;
  }

  container.innerHTML = fitting.map((prod, index) => {
    const capacity = prod.capacity_joules;
    const capacityKj = (capacity / 1000).toFixed(1);
    const usagePercent = Math.min(100, Math.max(5, Math.round((effectiveEnergy / capacity) * 100)));
    const marginPercent = Math.max(0, Math.round(((capacity - effectiveEnergy) / capacity) * 100));
    const isFirst = index === 0;
    const imageBlock = prod.image
      ? `<img src="${prod.image}" alt="Docksteel ${prod.name}" loading="lazy" />`
      : `<span class="no-image">Imagem Indisponível</span>`;

    return `
      <div class="rec-card${isFirst ? " rec-card-recommended" : ""}">
        ${isFirst ? '<span class="rec-card-hero-tag effective">Menor Dimensionamento Adequado</span>' : ""}
        <div class="rec-card-image">${imageBlock}</div>
        <div class="rec-card-body">
          <div class="rec-card-title-row">
            <h4>${prod.name}</h4>
            <span class="rec-capacity-pill">${capacityKj} kJ</span>
          </div>
          <div class="rec-capacity-meter">
            <div class="meter-header">
              <span>Uso da Capacidade (${usagePercent}%)</span>
              <strong>Margem: +${marginPercent}%</strong>
            </div>
            <div class="meter-track">
              <div class="meter-fill" style="width: ${usagePercent}%;"></div>
            </div>
          </div>
          <div class="rec-card-specs">
            <div class="rec-card-row"><span>Energia Efetiva:</span><strong>${(effectiveEnergy / 1000).toFixed(2)} kJ</strong></div>
            <div class="rec-card-row"><span>Requerido (+20%):</span><strong>${(requiredJoules / 1000).toFixed(2)} kJ</strong></div>
            <div class="rec-card-row"><span>Capacidade Homologada:</span><strong>${capacityKj} kJ</strong></div>
          </div>
          <div class="rec-card-actions">
            <a class="rec-card-link" href="${prod.url}" target="_blank" rel="noopener">
              <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>
              <span>Ver Ficha Técnica</span>
            </a>
          </div>
        </div>
      </div>
    `;
  }).join("");
}
