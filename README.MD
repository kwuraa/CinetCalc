# DOCKSTEEL DS-FLEX • Calculadora de Impacto

Aplicação web de engenharia para dimensionamento técnico de barreiras de proteção industrial da linha **DS-FLEX (Docksteel)**, utilizando a tecnologia **Boplan® Flex Impact®**.

---

## Sobre

A **Docksteel** é referência nacional em sistemas de segurança industrial e proteção contra impactos.  
A linha **DS-FLEX** utiliza polímeros de alta absorção de choque com **memória ativa**: deformam elasticamente durante a colisão e retornam ao formato original, preservando maquinários, estruturas e pessoas.

---

## Funcionalidades

### Cálculo em Tempo Real
- Energia Cinética Total (90°): `E = ½ · m · v²`
- Energia Efetiva no Ângulo: `E_efetiva = E_total · sin²(θ)`
- Margem de Segurança Preventiva de +20% (Norma **PAS 13 / EN 15512**)

### Controles Interativos
- Sliders e inputs numéricos sincronizados para massa e velocidade
- Seletor de ângulo em pills rápidas: 90°, 60°, 45°, 30°, 15°
- Simulação gráfica vetorial 2D no Canvas com animação em tempo real

### Análise Gráfica (Chart.js)
- Curva de energia vs. velocidade com dois datasets (efetiva + frontal 90°)
- Tema adaptável (Dark / Light) com atualização dinâmica do gráfico

### Recomendação de Produtos
- Filtragem automática do catálogo por energia requerida com margem de +20%
- Cards de produto com medidor de capacidade de absorção e link para ficha técnica

### Laudo Técnico (PDF / Impressão)
- Modal com dados operacionais, resultados físicos e produtos homologados
- Filtro de categoria e seleção individual por checkbox
- Ações rápidas: Marcar Todos / Apenas Recomendado
- Impressão limpa: controles ocultos via `@media print`

### Tema Dark / Light
- Alternância persistida no `localStorage`

---

## Arquitetura

O projeto utiliza **ES Modules nativos** sem bundler, com separação por responsabilidade:

```
CinetCalc/
├── index.html              # Estrutura principal da aplicação
├── style.css               # Design system completo (tokens, componentes, responsivo)
├── products.json           # Catálogo de produtos e categorias DS-FLEX
├── script.js               # Ponto de entrada legado (delega para js/app.js)
└── js/
    ├── app.js              # Orquestrador principal (DOMContentLoaded, eventos)
    ├── physics.js          # Fórmulas puras de física (sem dependência de DOM)
    ├── chart.js            # Inicialização e atualização do Chart.js
    ├── vector-canvas.js    # Simulação vetorial 2D no <canvas>
    ├── products.js         # Carga, filtragem e renderização de produtos
    ├── report.js           # Modal de laudo técnico, filtros e impressão
    └── theme.js            # Gerenciamento de tema Dark/Light
```

### Módulos

| Arquivo | Responsabilidade |
|---|---|
| `physics.js` | `calculateTotalEnergy`, `calculateEffectiveEnergy`, `calculateRequiredEnergy`, `getSeverityClassification` |
| `theme.js` | `initTheme`, `applyTheme`, `toggleTheme`, `getStoredTheme` |
| `chart.js` | `initKineticChart`, `updateKineticChart`, `updateChartTheme` |
| `vector-canvas.js` | `drawVectorSimulation` |
| `products.js` | `loadProductsData`, `getRecommendedProducts`, `renderRecommendations` |
| `report.js` | `initReportModal`, `populateReportModal`, `renderReportProductsList`, `populateReportCategoryFilter` |
| `app.js` | Bootstrap, referências DOM, listeners, integração dos módulos |

---

## Identidade Visual

| Token | Valor |
|---|---|
| DS Safety Orange | `#FF6B00` |
| Boplan Yellow | `#FFB800` |
| Industrial Navy Base | `#070A10` / `#0E1422` |
| Steel Blue Accent | `#38BDF8` |
| Approved Green | `#10B981` |

- **Tipografia**: `Outfit` (headings) + `Inter` (dados técnicos)
- **Efeitos**: glassmorphism, glow suave, faixa de segurança, scrollbar personalizada

---

## Executar Localmente

Qualquer servidor HTTP estático funciona. Exemplos:

```bash
# Python 3
python -m http.server 8000

# Node.js (npx)
npx serve .

# VS Code
# Extensão Live Server → clique em "Go Live"
```

Acesse `http://localhost:8000` no navegador.

> **Importante**: a aplicação usa ES Modules (`type="module"`), por isso **não abre corretamente via `file://`** — um servidor local é necessário.

---