# CinetCalc - Calculadora de Energia Cinética

## Sobre o Projeto

O **CinetCalc** é uma aplicação web desenvolvida para auxiliar no dimensionamento de sistemas de proteção contra impacto utilizados em ambientes industriais.

A aplicação calcula a **energia cinética** de um equipamento ou veículo com base na massa, velocidade e ângulo de impacto, exibindo os resultados em tempo real, um gráfico da variação da energia e recomendações automáticas de produtos compatíveis com o impacto calculado.

---

# Tecnologias Utilizadas

- HTML5
- CSS3
- JavaScript (ES6+)
- Chart.js

---

# Estrutura do Projeto

```
/
├── images
├── index.html
├── style.css
├── script.js
├── products.json
└── README.md
```

---

# Funcionalidades

## Cálculo da Energia Cinética

O sistema calcula automaticamente a energia cinética utilizando a fórmula:

> E = ½ · m · v²

Onde:

- **m** = massa (kg)
- **v** = velocidade (m/s)

A velocidade informada em km/h é convertida automaticamente para m/s.

---

## Cálculo da Energia Efetiva

Além da energia total (impacto a 90°), o sistema calcula a energia considerando o ângulo informado.

A fórmula utilizada é:

> Energia Efetiva = Energia Total × sen²(θ)

Onde:

- θ = ângulo de impacto

---

## Atualização em Tempo Real

Sempre que o usuário altera:

- Massa
- Velocidade
- Ângulo
- Categoria

os resultados são recalculados automaticamente, sem necessidade de clicar em um botão.

---

## Gráfico Dinâmico

A aplicação gera um gráfico utilizando **Chart.js** que demonstra como a energia varia conforme a velocidade aumenta.

O gráfico possui:

- preenchimento em gradiente
- animação suave
- tooltip personalizado
- atualização automática

---

## Sistema de Recomendação

Após o cálculo, o sistema procura automaticamente produtos compatíveis.

O processo consiste em:

1. Filtrar produtos da categoria selecionada
2. Remover produtos sem capacidade cadastrada
3. Ordenar pela capacidade de impacto
4. Aplicar margem de segurança de 20%
5. Encontrar o produto mais adequado

São apresentadas duas recomendações:

- Produto recomendado para a energia efetiva
- Produto reforçado para o pior cenário (impacto frontal)

Caso não exista nenhum produto disponível, o sistema informa ao usuário.

---

# Interface

A interface foi desenvolvida seguindo um estilo industrial inspirado na identidade visual da Docksteel.

Características:

- tema escuro
- layout responsivo
- efeito Glassmorphism
- gradientes em laranja
- cartões interativos
- animações suaves
- tipografia Inter

---

# Responsividade

A aplicação adapta automaticamente o layout para diferentes dispositivos.

### Desktop

- calculadora e gráfico lado a lado

### Tablet

- ajuste automático do grid

### Smartphone

- componentes organizados em coluna

---

# Estrutura da Página

A interface é composta por três áreas principais.

## Calculadora

Responsável pela entrada dos dados.

Campos:

- Categoria
- Massa
- Velocidade
- Ângulo

Resultados:

- Energia Cinética
- Energia Efetiva

---

## Gráfico

Exibe a curva de crescimento da energia em função da velocidade.

---

## Recomendações

Exibe cartões contendo:

- imagem
- nome do produto
- energia considerada
- capacidade do produto
- link para ficha técnica

---

# Fluxo da Aplicação

```
Usuário informa os dados

        ↓

Conversão da velocidade

        ↓

Cálculo da energia cinética

        ↓

Cálculo da energia efetiva

        ↓

Atualização do gráfico

        ↓

Busca por produtos

        ↓

Exibição das recomendações
```

---

# Arquivos

## index.html

Responsável pela estrutura da aplicação.

Contém:

- formulário
- gráfico
- área de recomendações

---

## style.css

Responsável por toda a estilização da interface.

Inclui:

- variáveis CSS
- responsividade
- layout
- componentes
- animações
- tema escuro

---

## script.js

Responsável por toda a lógica da aplicação.

Principais funções:

### populateCategorySelect()

Carrega as categorias disponíveis no seletor.

---

### formatEnergy()

Formata os valores de energia para exibição.

---

### getRecommendedProducts()

Seleciona automaticamente os produtos mais adequados conforme a energia calculada.

---

### renderRecommendations()

Cria dinamicamente os cartões de recomendação.

---

### updateCalculatorAndChart()

Função principal da aplicação.

Responsável por:

- calcular as energias
- atualizar os resultados
- atualizar o gráfico
- atualizar as recomendações

---

# Fonte de Dados

Os produtos são carregados dinamicamente a partir do arquivo:

```
products.json
```

Cada produto possui informações como:

- categoria
- nome
- capacidade de impacto
- imagem
- link para ficha técnica

---

# Como Executar

1. Clone o projeto.

```bash
git clone <repositorio>
```

2. Entre na pasta.

```bash
cd projeto
```

3. Execute um servidor local.

Exemplo utilizando VS Code:

- Live Server

ou

```bash
python -m http.server
```

Depois acesse:

```
http://localhost:8000
```

---

# Possíveis Melhorias

- Exportação dos resultados em PDF
- Histórico de cálculos
- Comparação entre diferentes produtos
- Cadastro de novos produtos
- Integração com API
- Persistência em banco de dados
- Autenticação de usuários
- Dashboard administrativo

---

# Autor

Desenvolvido como uma calculadora de dimensionamento de impacto para apoio na seleção de soluções de proteção industrial.
