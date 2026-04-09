# Projeto de Dashboard Analítico (Web Scraping & Planilhas)

## Visão Geral e Arquitetura

Este projeto tem o objetivo de entregar uma aplicação web robusta para análise e visualização de dados (uma experiência de Business Intelligence como o Power BI), com foco em análise "Week-over-Week", filtros e dashboards.

A arquitetura do projeto é dividida em duas camadas principais:

- **Backend (Node.js + Express):** Responsável por buscar, extrair, tabular e consolidar dados espalhados em múltiplas fontes (duas planilhas do Google Sheets tratadas como CSVs para um web scraping ultra-rápido e robusto). 
  - Camada de Integração: Coleta o CSV das planilhas, ignorando dependências instáveis de HTML Scraping (Puppeteer).
  - Camada de Transformação: Aggrega dados, unindo Mês, Divisão, Categoria e convertendo strings numéricas para fazer os cálculos WoW (Week-over-Week) e agregados necessários para o dashboard.
- **Frontend (React.js + Vite):** Interface de visualização Single Page Application contendo Recharts e construída em cima de uma arquitetura modular (`src/components`, `src/services`, etc.).

## Tecnologias Utilizadas

- **Frontend:** React, Vite, Recharts, e Vanilla CSS.
- **Backend:** Node.js, Express, Axios (para requisições), PapaParse/csv-parser (para parser).
- **Estruturas de Dados e Cálculos:** Lógica em JS focada em performance para cruzamento de métricas YoY e WoW.

## Como a "Coleta de Dados" é Feita (Web Scraping)
A coleta é feita utilizando requisições diretas à API de exportação CSV do Google Sheets. Esse método é a variação mais resiliente do Web Scraping, pois consome os dados exatos sem o _overhead_ de um headless browser, mitigando falhas provocadas por atualizações da interface visual do Google. 

Para manutenções futuras, caso alguma coluna da planilha mude o escopo de nome (Ex.: "Visitas" virar "Visita Atual"), o Service do Backend mapeia as chaves de colunas recebidas para campos unificados em JSON, bastando alterar esse mapeamento.

## Instalação e Execução (Desenvolvimento)

### Pré-requisitos
- Node.js versão >= 18.
- Npm ou Yarn instalado.

### 1. Setup do Backend
Navegue para a pasta `backend` e instale as dependências.
```bash
cd backend
npm install
npm run dev
```
O Backend rodará na porta `3001` (padrão) e proverá as APIs REST, por exemplo: `http://localhost:3001/api/data`

### 2. Setup do Frontend
Em uma nova aba de terminal, navegue até `frontend` e instale as dependências.
```bash
cd frontend
npm install
npm run dev
```
O Frontend rodará na porta `5173` (padrão do Vite). Acesse `http://localhost:5173` no seu navegador.

---
**Nota sobre Escalabilidade e Manutenção:**
1. O backend possa virar um Container num cluster ou uma função Serverless, executando requisições em background com CRON.
2. A solução CSS crua no frontend e React evita vendor-lock, possibilitando integrações ágeis. 
3. Toda manipulação de cálculo ("Heavy Lifting") está no node, que tira o peso cognitivo e o _lag_ de memória do frontend, otimizando o parse do DOM e as microanimações.

## Histórico de Atualizações

### [2026-04-08] - Manutenção de Sincronismo e Novos Itens (Sessão Atual)
- **Análise de Inconsistências:** Identificação de divergências entre os nomes das abas esperadas pelo frontend e a estrutura real das planilhas Google Sheets.
- **Normalização de Dados (Tentativa):** Implementação de lógica no backend para normalizar nomes de colunas com acentuação e converter formatos numéricos (vírgulas para pontos).
- **Criação de Abas Virtuais:** Lógica no `dataService.js` para separar a aba consolidada `Semana` em visões anuais (`Total CE_MX 2024`, `2025`, `2026`).
- **Novos Itens de Dashboard:** 
    - Adição de cartões de KPI para tráfego **Orgânico** com comparação YTD.
    - Implementação do componente `CategoryMixChart` para análise de Mix de Categorias (Top 10 por Revenue).
- **Restauração de Sistema:** Após instabilidades no carregamento dos dados novos, o projeto foi **revertido para a versão estável anterior** para garantir que todas as funcionalidades originais permanecessem operantes e prontas para uso.
- **Limpeza de Ambiente:** Remoção de scripts de teste temporários (`final_verify.js`, `dump_data.js`, etc.) e componentes experimentais.

### [2026-04-08] - Evolução para Dashboard de 3 Páginas (Atualização Concluída)
- **Migração Modular:** Refatoração completa do `Dashboard.jsx` para suportar um sistema de 3 páginas navegáveis.
- **Novas Métricas de Negócio:** Integração das colunas `Order` (Pedidos) e `Receita / Visitas` (RPC/Revenue per Click) em todos os níveis do sistema.
- **Estruturação de Páginas:**
    - **Página 1 (Geral):** Foco em Visitas, Conversão e Revenue Total com KPIs de YTD e Tendência 2026.
    - **Página 2 (Pedidos e Médias):** Foco em Pedidos e Ticket Médio com gráficos compostos de correlação.
    - **Página 3 (Orgânico):** Vista dedicada para tráfego Orgânico com 7 gráficos analíticos e correlações.
- **Melhorias Visuais:** Atualização do `Dashboard.css` para um novo menu de navegação e layout flexível para diferentes densidades de gráficos.
- **Backend Robusto:** Atualização do `dataService.js` para normalização automática de todas as novas métricas e suporte a múltiplas abas dinâmicas.

### [2026-04-08] - Refinamentos e Persistência (Sessão Atual)
- **Ajuste de Formatação**: Alterada a métrica `Receita / Visitas` de Moeda para Valor Absoluto Decimal (Ex: de R$ 14,98 para 14,98).
- **Padronização de Siglas**: Substituição global de "Revenue" por "Receita" e "RPC" por "Receita/Visitas".
- **Novas Análises de Correlação**: Adicionado gráfico composto de **Visitas vs Order** nas páginas 2 e 3.
- **Sistema de Anotações**: Implementação de um box de anotações ("Sticky Notes") com persistência via `localStorage`, permitindo salvar observações por sessão.
- **Expansão de Gráficos**: Dashboard agora conta com 4 gráficos na Pág 1, 4 gráficos na Pág 2 e 8 gráficos na Pág 3.

### [2026-04-08] - Otimização de Layout e Fluxo (Conclusão)
- **Padronização Visual**: Centralização dos slicers de filtragem e renomeação de `Anotações` para **Insights** para melhor semântica.
- **Nomenclatura de Vendas**: Alteração global do termo "Order" para **Pedidos**.
- **Consolidação de Moeda**: Reversão da unidade de `Receita / Visitas` para **R$**, garantindo leitura financeira precisa.
- **Reestruturação da Página 3 (Orgânico)**: 
    - Remoção do gráfico de Ticket Médio.
    - Nova sequência lógica com 4 gráficos de Sobreposição (Visitas, CR, Receita, RPC) seguidos de 4 gráficos Compostos de correlação YoY 2026.
    - Implementação do gráfico específico de **Receita/Visitas (ORGÂNICOS CE+MX)**.

### [2026-04-08] - Polimento Final e Guia de Estilo (Conclusão)
- **Indicadores de Tendência**: Adição de setas de performance (↑/↓) e rótulo `(W-1)` no card de Tendência 2026, comparando a previsão da próxima semana com a última semana de dados reais.
- **Layout de Precisão**: Centralização vertical e horizontal dos boxes de Slicers e Insights para um design mais equilibrado.
- **Arquitetura de Temas**: Migração de cores e fontes para **Variáveis CSS** no `:root`, facilitando a troca rápida para a paleta do cliente.

### [2026-04-08] - Refinamento Visual de Indicadores (Ajuste Final)
- **Indicadores de Performance**: Evolução das setas de texto para bullets visuais estilizados (▲/▼).
- **Esquema de Cores**: Aplicação de cores semânticas (Verde para crescimento, Vermelho para queda) nos indicadores de tendência.
- **Hierarquia Visual**: Reposicionamento dos indicadores e do rótulo `(W-1)` abaixo dos valores principais para uma leitura mais limpa e profissional.

### [2026-04-08] - Insights Compartilhados (Sincronização Server-Side)
- **Persistência Centralizada**: Migração do bloco de Insights de `localStorage` para o servidor backend (`src/insights.json`).
- **Sincronização Real-time**: Agora, anotações feitas por um usuário são visíveis para todos os outros que acessarem o link (via ngrok ou publicação), garantindo uma base de conhecimento única.

### [2026-04-08] - Segurança na Exclusão (Proteção por Senha)
- **Validação de Exclusão**: Implementação de uma camada de segurança que solicita senha de autorização antes de apagar insights compartilhados.
- **Segurança Server-Side**: A validação ocorre no backend, impedindo bypass pelo console do navegador.
- **Segurança**: Senha padrão `1234` para exclusão de insights.

### [2026-04-09] - Ambiente de Teste com Identidade Visual Samsung
- **Novo Componente**: Criado `DashboardTest.jsx` + `DashboardTest.css` como ambiente isolado de experimentação visual.
- **Branding**: Integração das fontes `Samsung SS Head Bold` (títulos/labels) e `Samsung SS Body Regular` (números/textos).
- **Paleta**: Tema escuro Premium (`#0f172a`) com `accent` azul Samsung (`#38bdf8`) e glass-morphism nos cards.
- **Toggle**: Botão fixo no rodapé permite alternar entre a versão original e o ambiente de teste sem recarregar a página.
- **Labels**: Alteração de "Soma Visitas" para "Total Visitas" nas páginas 1 e 3.
- **Restauração**: CSS do ambiente de teste revertido ao estilo escuro correto após tentativa frustrada de aplicar o estilo claro da loja Samsung.

### [2026-04-09] - Promoção para Versão Definitiva
- **Paleta Final Aplicada**: Estilo Samsung promovido como versão de produção (`Dashboard.css` e `Dashboard.jsx`).
- **Toggle Removido**: Botão de alternância entre estilos removido da produção.
- **App.jsx simplificado**: Renderiza diretamente o `Dashboard` principal.

---

## 🎨 Paleta de Cores Definitiva (Versão Final)

Todas as configurações visuais ficam em `frontend/src/components/Dashboard.css`:

| Variável CSS | Valor | Uso |
|---|---|---|
| `--bg` | `#d4d4d4` | Fundo da página |
| `--card-bg` | `rgba(142,155,175,0.7)` | Fundo dos cards (glass) |
| `--border` | `rgba(255,255,255,0.1)` | Bordas dos painéis |
| `--accent` | `#080808` | Botões ativos, títulos |
| `--text` | `#0000FF` | Texto principal |
| `--text-muted` | `#080b0f` | Labels e subtítulos |
| `--positive` | `#10b981` | Indicadores positivos ▲ |
| `--negative` | `#f43f5e` | Indicadores negativos ▼ |
| `--font-head` | `Samsung SS Head Bold` | Títulos e cabeçalhos |
| `--font-body` | `Samsung SS Body Regular` | Números, textos, campos |

### Cores dos Gráficos

**Eixos X e Y** — alterar em `OverlapChart.jsx` e `ComposedChart2026.jsx`:
```jsx
<XAxis stroke="#000000" tick={{ fontSize: 12 }} />
<YAxis stroke="#000000" tick={{ fontSize: 11 }} />
```

**Linhas (Páginas 1 e 3)** — `OverlapChart.jsx`:
```jsx
<Line name="2024" stroke="#f43f5e" />   /* vermelho */
<Line name="2025" stroke="#118DFF" />   /* azul claro */
<Line name="2026" stroke="#12239E" />   /* azul escuro */
```

**Barras e Linha (Página 2)** — `ComposedChart2026.jsx`:
```jsx
<Bar fill="#12239E" />                 /* barras de visitas */
<Line stroke="#ff0037" />              /* linha da métrica */
```

**Tooltip** — presente nos dois arquivos acima:
```jsx
<Tooltip contentStyle={{ backgroundColor: '#96D653', ... }} />
```

**Slicer de Range (fundo e cor da fonte)** — `Dashboard.css`:
```css
.custom-select { background: rgba(255,255,255,0.05); color: var(--text); }
.custom-select option { background-color: #d4d4d4; color: var(--text); }
```

---

## 🚀 Guia de Publicação

O dashboard tem **dois componentes** que precisam estar acessíveis para que tudo funcione:

| Componente | Tecnologia | Porta padrão |
|---|---|---|
| **Frontend** | React (Vite) | 5173 |
| **Backend** | Node.js (Express) | 3001 |

> [!IMPORTANT]
> Os **insights** (bloco de anotações compartilhadas) dependem do backend rodando. Se só o frontend for publicado, os dados do Google Sheets continuam funcionando — pois vêm de uma API pública. Mas os insights não.

---

### Opção 1 — ngrok (Acesso Rápido, sem Deploy)

**Como funciona:** O ngrok cria um túnel HTTPS temporário que expõe seu servidor local para qualquer pessoa na internet. A URL muda a cada reinicialização (na versão gratuita).

**Resposta à sua pergunta:**
> ✅ Sim, qualquer pessoa poderá acessar a URL gerada.  
> ✅ Todas as funcionalidades (inclusive insights compartilhados) funcionam normalmente.  
> ✅ Os dados do Google Sheets são atualizados automaticamente (a leitura já é em tempo real).  
> ⚠️ A URL **muda** toda vez que o ngrok for reiniciado (versão gratuita).  
> ⚠️ Seu computador precisa estar **ligado e com o servidor rodando** para que o link funcione.

**Passo a passo:**

**1. Instalar o ngrok:**
```bash
# Baixe em https://ngrok.com/download e descompacte
# OU instale via npm:
npm install -g ngrok
```

**2. Criar conta e autenticar (apenas 1 vez):**
```bash
ngrok config add-authtoken SEU_TOKEN_AQUI
# Pegue o token em: https://dashboard.ngrok.com/auth/tokens
```

**3. Iniciar os servidores locais:**
```bash
# Terminal 1 — Backend
cd "d:\Analise Simulador\backend"
node src/index.js

# Terminal 2 — Frontend
cd "d:\Analise Simulador\frontend"
npm run dev
```

**4. Criar o túnel para o BACKEND (porta 3001):**
```bash
# Terminal 3
ngrok http 3001
# Anote a URL gerada, ex: https://abc123.ngrok-free.app
```

**5. Atualizar a URL da API no frontend:**

Abra `frontend/src/services/api.js` e troque a URL base:
```js
const BASE_URL = 'https://abc123.ngrok-free.app'; // URL do ngrok
```

**6. Criar o túnel para o FRONTEND (porta 5173):**
```bash
# Terminal 4
ngrok http 5173
```

Compartilhe a URL do passo 6 com seus usuários. ✅

---

### Opção 2 — Vercel/Netlify + Railway/Render (Deploy Permanente)

**Como funciona:** O código é hospedado em servidores na nuvem. A URL é fixa e permanente, o dashboard fica online 24h sem depender do seu computador.

**Resposta à sua pergunta:**
> ✅ URL fixa e permanente (não muda).  
> ✅ Dados do Google Sheets atualizados em tempo real.  
> ✅ Insights compartilhados funcionam se o backend estiver também hospedado.  
> ✅ Seu computador **não precisa** ficar ligado.  
> ✅ Acesso simultâneo de múltiplos usuários sem degradação.  

**Arquitetura:**
- **Frontend** → Vercel ou Netlify (gratuito)
- **Backend** → Railway ou Render (gratuito com limitações)

---

#### Passo a passo — Deploy do Backend no Railway

**1. Criar conta em [railway.app](https://railway.app)**

**2. Em `backend/`, criar o arquivo `Procfile`:**
```
web: node src/index.js
```

**3. Confirmar que o `backend/package.json` tem o campo `start`:**
```json
"scripts": {
  "start": "node src/index.js"
}
```

**4. Garantir que o backend escuta na porta fornecida pelo Railway:**
Editar `backend/src/index.js` — porta deve ser dinâmica:
```js
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
```

**5. Fazer upload do backend no Railway:**
- Conecte seu repositório GitHub com a pasta `backend`
- O Railway detecta automaticamente e faz o deploy
- Copie a URL pública gerada, ex: `https://meu-backend.up.railway.app`

---

#### Passo a passo — Deploy do Frontend na Vercel

**1. Criar conta em [vercel.com](https://vercel.com)**

**2. Atualizar a URL da API para apontar para o backend no Railway:**

Em `frontend/src/services/api.js`:
```js
const BASE_URL = 'https://meu-backend.up.railway.app';
```

**3. Em `frontend/`, criar o arquivo `vercel.json`:**
```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```

**4. Fazer o build do frontend:**
```bash
cd "d:\Analise Simulador\frontend"
npm run build
```

**5. Fazer upload na Vercel:**
```bash
npm install -g vercel
vercel
# Siga as instruções interativas
```
Ou conecte diretamente seu repositório GitHub na interface da Vercel.

**6. Copiar e compartilhar a URL final**, ex: `https://ssg-analytics.vercel.app` ✅

---

### Qual opção escolher?

| Critério | ngrok | Vercel + Railway |
|---|---|---|
| Velocidade para começar | ⚡ Imediato | 🔧 ~30 min de configuração |
| URL fixa e permanente | ❌ Muda a cada reinício | ✅ Permanente |
| Computador precisa ficar ligado | ✅ Sim | ❌ Não |
| Custo | Gratuito | Gratuito (com limites) |
| Recomendado para | Apresentações rápidas | Uso contínuo e colaborativo |

> [!TIP]
> **Recomendação:** Use o **ngrok para apresentações imediatas** e o **Vercel + Railway para uso contínuo** com a equipe.

---

## Funcionamento do Bloco de Insights

O bloco de **Insights** permite anotações compartilhadas e análise qualitativa colaborativa.

### Persistência dos Dados
- **Onde é salvo?** No servidor backend (`backend/src/insights.json`).
- **Duração:** Permanente enquanto o servidor estiver rodando.
- **Compartilhamento:** Todos os usuários que acessam o mesmo link veem e editam o mesmo conteúdo.

### Segurança
- **Adicionar/Editar**: Livre para todos os usuários.
- **Excluir**: Protegido por senha (`1234` por padrão).
  - A senha é validada **no servidor** — não pode ser burlada pelo console do navegador.
  - Para alterar a senha, edite `backend/src/index.js`, linha que contém `if (password !== '1234')`.

