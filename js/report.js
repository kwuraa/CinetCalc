/**
 * Popula as opções do select de categorias de produtos no modal do laudo
 * @param {HTMLSelectElement} selectEl
 * @param {Array} categories
 */
export function populateReportCategoryFilter(selectEl, categories) {
  if (!selectEl || !categories || categories.length === 0) return;
  const currentVal = selectEl.value;
  selectEl.innerHTML =
    '<option value="all">Todos os Tipos de Produtos</option>' +
    categories
      .map((c) => `<option value="${c.id}">${c.name}</option>`)
      .join("");
  if (currentVal) selectEl.value = currentVal;
}

/**
 * Renderiza a lista de produtos compatíveis com checkboxes no modal do laudo
 * @param {HTMLElement} listContainer
 * @param {Array} categories
 * @param {{ fitting: Array }} recommendation
 * @param {string} [selectedCategory="all"]
 */

export function renderReportProductsList(
  listContainer,
  categories,
  recommendation,
  selectedCategory = "all",
) {
  if (!listContainer || !recommendation) return;
  const { fitting } = recommendation;
  let filtered = fitting || [];
  if (selectedCategory !== "all") {
    filtered = filtered.filter((p) => p.category_id === selectedCategory);
  }

  if (filtered.length > 0) {
    listContainer.innerHTML = filtered
      .map((prod, i) => {
        const cat = (categories || []).find((c) => c.id === prod.category_id);
        const catName = cat ? cat.name : "DS-FLEX";
        const isIdeal = i === 0 && selectedCategory === "all";
        return `
        <label class="report-prod-item" data-id="${prod.id}">
          <div class="report-prod-check-info">
            <input type="checkbox" class="report-prod-checkbox no-print" data-id="${prod.id}" checked />
            <img 
              src="${prod.image}" 
              alt="${prod.name}" 
              class="report-prod-thumb" 
              style="width: 50px; height: 50px; object-fit: contain; border-radius: 4px; margin: 0 10px; background: #fff; padding: 2px; border: 1px solid #e2e8f0;" 
            />
            <div class="report-prod-text">
              <strong>${prod.name}${isIdeal ? " (Menor dimensionamento adequado)" : ""}</strong>
              <span class="report-prod-category">${catName} • Flex Impact®</span>
            </div>
          </div>
          <span class="report-prod-cap">${(prod.capacity_joules / 1000).toFixed(1)} kJ</span>
        </label>
      `;
      })
      .join("");

    listContainer.querySelectorAll(".report-prod-checkbox").forEach((cb) => {
      cb.addEventListener("change", () => {
        cb.closest(".report-prod-item")?.classList.toggle(
          "is-excluded",
          !cb.checked,
        );
      });
    });
  } else {
    listContainer.innerHTML = `
      <p style="color: #ef4444; font-size: 0.85rem; padding: 12px 0;">
        Nenhum produto deste tipo compatível com a energia calculada.
      </p>
    `;
  }
}

/**
 * Preenche os dados operacionais e de energia no laudo técnico
 * @param {Object} domElements
 * @param {Object} reportData
 * @param {Array} categories
 * @param {Object} recommendation
 */
export function populateReportModal(
  domElements,
  reportData,
  categories,
  recommendation,
) {
  const {
    repVehicle,
    repMass,
    repVel,
    repAngle,
    repTotalEnergy,
    repEffectiveEnergy,
    repReqEnergy,
    reportProductsList,
    reportCategoryFilter,
  } = domElements;
  const {
    vehicleName,
    mass,
    velKmh,
    velMs,
    angle,
    totalEnergy,
    effectiveEnergy,
    reqEnergy,
  } = reportData;

  if (repVehicle) repVehicle.textContent = vehicleName;
  if (repMass) repMass.textContent = `${mass.toLocaleString("pt-BR")} kg`;
  if (repVel)
    repVel.textContent = `${velKmh.toFixed(1)} km/h (${velMs.toFixed(2)} m/s)`;
  if (repAngle)
    repAngle.textContent = `${angle}º ${angle === 90 ? "(Frontal)" : ""}`;
  if (repTotalEnergy)
    repTotalEnergy.textContent = `${(totalEnergy / 1000).toFixed(2)} kJ`;
  if (repEffectiveEnergy)
    repEffectiveEnergy.textContent = `${(effectiveEnergy / 1000).toFixed(2)} kJ`;
  if (repReqEnergy)
    repReqEnergy.textContent = `${(reqEnergy / 1000).toFixed(2)} kJ`;

  const selectedCategory = reportCategoryFilter
    ? reportCategoryFilter.value
    : "all";
  renderReportProductsList(
    reportProductsList,
    categories,
    recommendation,
    selectedCategory,
  );
}

/**
 * Inicializa os ouvintes de eventos e controles do Modal do Laudo
 * @param {Object} config
 */
export function initReportModal(config) {
  const {
    modal,
    btnOpen,
    btnClose,
    btnCancel,
    btnPrint,
    categoryFilter,
    btnSelectAll,
    btnSelectIdeal,
    productsList,
    reportDateEl,
    reportCodeEl,
    getReportData,
    getCategories,
    getRecommendation,
  } = config;

  if (reportDateEl) {
    const today = new Date();
    reportDateEl.textContent = today.toLocaleDateString("pt-BR");
    if (reportCodeEl) {
      const codeDate = today.toISOString().slice(0, 10).replace(/-/g, "");
      reportCodeEl.textContent = `DS-FLEX-${codeDate}-${Math.floor(1000 + Math.random() * 9000)}`;
    }
  }

  const openModal = () => {
    if (!modal) return;
    populateReportModal(
      config,
      getReportData(),
      getCategories(),
      getRecommendation(),
    );
    modal.classList.add("active");
  };

  const closeModal = () => {
    if (modal) modal.classList.remove("active");
  };

  if (btnOpen) btnOpen.addEventListener("click", openModal);
  if (btnClose) btnClose.addEventListener("click", closeModal);
  if (btnCancel) btnCancel.addEventListener("click", closeModal);
  if (modal)
    modal.addEventListener("click", (e) => {
      if (e.target === modal) closeModal();
    });

  if (btnPrint) {
    btnPrint.addEventListener("click", () => {
      const reportContent = modal.querySelector(".modal-content") || modal;


      const iframe = document.createElement("iframe");
      iframe.style.position = "absolute";
      iframe.style.top = "-9999px";
      iframe.style.left = "0";
      iframe.style.width = "100%";
      iframe.style.height = "100%";
      iframe.style.border = "none";
      document.body.appendChild(iframe);

      const iframeDoc = iframe.contentWindow.document;
      iframeDoc.open();

      let estilos = "";
      document.querySelectorAll("style, link[rel='stylesheet']").forEach((tag) => {
        estilos += tag.outerHTML;
      });

      iframeDoc.write(`
        <html>
          <head>
            <title>Laudo de Impacto - Docksteel</title>
            ${estilos}
            <style>
              /* Define as margens nativas da folha A4 */
              @page {
                margin: 15mm; 
              }
              
              /* Garante que o corpo tenha altura infinita */
              html, body { 
                background: white !important; 
                margin: 0 !important; 
                padding: 0 !important;
                height: auto !important; 
                overflow: visible !important;
              }

              /* A regra de ouro: mata qualquer posição fixa ou absoluta que trava o papel */
              body * {
                position: static !important; 
                overflow: visible !important;
                max-height: none !important;
              }

              .modal-content, .modal-body {
                display: block !important; 
                height: auto !important; 
                width: 100% !important;
              }

              .no-print, .btn-print, .btn-cancel, .close-button { 
                display: none !important; 
              }

              .report-prod-item { 
                page-break-inside: avoid !important; 
                break-inside: avoid !important; 
                margin-bottom: 20px !important; /* Espaçamento entre os produtos */
              }
            </style>
          </head>
          <body>
            ${reportContent.outerHTML}
          </body>
        </html>
      `);
      iframeDoc.close();
      setTimeout(() => {
        iframe.contentWindow.focus();
        iframe.contentWindow.print();

        setTimeout(() => document.body.removeChild(iframe), 2000);
      }, 800);
    });
  }

  if (categoryFilter) {
    categoryFilter.addEventListener("change", () => {
      renderReportProductsList(
        productsList,
        getCategories(),
        getRecommendation(),
        categoryFilter.value,
      );
    });
  }

  if (btnSelectAll && productsList) {
    btnSelectAll.addEventListener("click", () => {
      productsList.querySelectorAll(".report-prod-checkbox").forEach((cb) => {
        cb.checked = true;
        cb.closest(".report-prod-item")?.classList.remove("is-excluded");
      });
    });
  }

  if (btnSelectIdeal && productsList) {
    btnSelectIdeal.addEventListener("click", () => {
      productsList
        .querySelectorAll(".report-prod-checkbox")
        .forEach((cb, idx) => {
          cb.checked = idx === 0;
          cb.closest(".report-prod-item")?.classList.toggle(
            "is-excluded",
            idx !== 0,
          );
        });
    });
  }
}
