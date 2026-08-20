# DOCKSTEEL DS-FLEX • CinetCalc v2.0
### Calculadora de Energia Cinética & Dimensionamento de Proteções Flexíveis

Aplicação web profissional de engenharia desenvolvida para o dimensionamento técnico de barreiras de proteção de impacto industrial da linha **DS-FLEX (Docksteel)** em parceria com a tecnologia pioneira **Boplan® (Flex Impact®)**.

---

## 🛡️ Sobre a Docksteel & Linha DS-FLEX

A **Docksteel** é referência nacional em sistemas de segurança industrial, proteção contra impactos e logística segura. 
A linha **DS-FLEX** utiliza polímeros de alta absorção de choque com **memória ativa**, que deformam elasticamente durante uma colisão e retornam ao formato original, preservando maquinários, estruturas, vidas e evitando danos ao piso de concreto.

---

## 🚀 Funcionalidades da Aplicação

### 1. Dimensionamento em Tempo Real
- **Cálculo de Energia Cinética Total ($E_k$) a 90º**:
  $$E = \frac{1}{2} \cdot m \cdot v^2$$
- **Cálculo de Energia Efetiva Perpendicular no Ângulo ($\theta$)**:
  $$E_{\text{efetiva}} = E_{\text{total}} \cdot \sin^2(\theta)$$
- **Margem de Segurança Preventiva (+20%)**: Em conformidade com as diretrizes da norma internacional **PAS 13 / EN 15512**.

### 2. Atalhos Rápidos de Veículos Industriais (Presets)
- 🛒 **Transpaleteira Elétrica**: 1.500 kg @ 6 km/h
- ⚡ **Empilhadeira Retrátil**: 3.500 kg @ 10 km/h
- 🚜 **Empilhadeira Contrabalançada (3.5t)**: 5.000 kg @ 12 km/h
- 🏗️ **Empilhadeira Pesada (8t)**: 8.500 kg @ 15 km/h
- 🚚 **Veículo Utilitário / VUC**: 3.500 kg @ 20 km/h

### 3. Controles Interativos e Simulação Vetorial 2D
- **Controles Duplos (Input + Sliders)**: Sincronização em tempo real de massa e velocidade.
- **Seletor de Ângulo (Pills + Slider)**: Seleção rápida de 90º (frontal), 60º, 45º, 30º e 15º (rasante).
- **Simulador Gráfico 2D no Canvas**: Demonstração visual do ângulo de impacto do veículo contra a barreira flexível e decomposição das forças em tempo real.

### 4. Análise Gráfica Dinâmica (Chart.js)
- Curva exponencial de energia vs. velocidade.
- Linha de corte da capacidade do produto recomendado.
- Tooltip com telemetria detalhada em Joules e kiloJoules (kJ).

### 5. Sistema Inteligente de Recomendação de Produtos
- **Opção Recomendada (Impacto Real no Ângulo + 20%)**
- **Opção Reforçada (Pior Cenário / Frontal 90º + 20%)**
- **Medidor de Capacidade**: Exibe a porcentagem exata de absorção utilizada e a margem de reserva.
- **Link Direto**: Para fichas técnicas oficiais no portal `docksteel.com.br`.
- **Cotação no WhatsApp**: Link com mensagem pré-formatada contendo todos os dados operacionais e o produto homologado.

### 6. Emissão de Laudo Técnico (Impressão / PDF)
- Geração instantânea de relatório de dimensionamento técnico com data, código de laudo, dados do veículo e soluções DS-FLEX indicadas.

---

## 🎨 Identidade Visual & Design System

- **Cores Oficiais**:
  - `DS Safety Orange`: `#FF6B00` / `#FF852E`
  - `Boplan Yellow`: `#FFB800`
  - `Industrial Slate/Navy Base`: `#070A10` / `#0E1422` / `#162034`
  - `Steel Blue Accent`: `#38BDF8`
  - `Approved Green`: `#10B981`
- **Tipografia**: `Outfit` (Headings industriais de alto impacto) + `Inter` (Dados técnicos legíveis).
- **Efeitos**: Glassmorphism, iluminação com glow suave, faixas de segurança industrial e animações fluidas.

---

## 📁 Estrutura de Arquivos

```
CinetCalc/
├── images/             # 48 Fotos técnicas de produtos DS-FLEX Docksteel
├── index.html          # Interface HTML5 semântica e responsiva
├── style.css           # Design System oficial DOCKSTEEL DS-FLEX
├── script.js           # Motor de cálculo, simulação 2D e gráficos
├── products.json       # Catálogo de produtos e capacidades em Joules
└── README.md           # Documentação completa
```

---

## 💻 Como Executar Localmente

Você pode rodar localmente com qualquer servidor estático HTTP:

```bash
# Com Node.js / npx
npx serve .

# Ou com Python
python -m http.server 8000
```

Abra o navegador em `http://localhost:3000` ou `http://localhost:8000`.

---

## 📞 Contato & Suporte Docksteel

- **Site Oficial:** [docksteel.com.br](https://www.docksteel.com.br/)
- **Linha DS-Flex:** [docksteel.com.br/ds-flex/](https://www.docksteel.com.br/ds-flex/)
- **Telefone:** +55 (15) 3346-7576
- **WhatsApp:** +55 (15) 99794-0012
- **E-mail:** contato@docksteel.com.br
- **Localização:** Sorocaba - SP, Brasil
