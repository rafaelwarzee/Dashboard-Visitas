# Samsung Analytics Dashboard - Guia do Projeto

## 📋 Visão Geral
Este dashboard foi desenvolvido para fornecer uma análise visual premium das métricas de tráfego, pedidos e performance financeira, com foco em dados anuais (2024-2026). O sistema integra dados em tempo real do Google Sheets e permite colaboração via um sistema centralizado de insights.

- **URL de Produção**: [https://dashboard-visitas.vercel.app/](https://dashboard-visitas.vercel.app/)
- **Backend (API)**: [https://dashboard-visitas-production.up.railway.app/](https://dashboard-visitas-production.up.railway.app/)

---

## 🛠️ Arquitetura Técnica

### Frontend (React + Vite)
- **Localização**: `/frontend`
- **Tecnologias**: React, Recharts, Vanilla CSS (Glass-morphism).
- **Estilo**: Identidade Visual Samsung (Fontes SS Head/Body e paleta institucional).
- **Navegação**: Sistema de 3 páginas (Geral, Pedidos, Orgânico).

### Backend (Node.js + Express)
- **Localização**: `/backend`
- **Mecanismo**: Web Scraping via exportação CSV/XLSX do Google Sheets.
- **Persistência**: Arquivo `insights.json` para anotações compartilhadas.
- **Segurança**: Exclusão de notas protegida por senha (`1234`).

---

## 🎨 Identidade Visual e Customização

Todas as variáveis de estilo estão centralizadas em `frontend/src/components/Dashboard.css`.

| Item | Valor | Descrição |
|---|---|---|
| **Fundo** | `#d4d4d4` | Cor de fundo premium clara. |
| **Texto** | `#0000FF` | Azul padrão para leitura e títulos. |
| **Fonte Títulos** | `Samsung SS Head Bold` | Tipografia institucional para impacto. |
| **Fonte Dados** | `Samsung SS Body Regular` | Tipografia para leitura de métricas. |

### Alteração de Cores de Gráficos
Para mudar as cores das linhas, barras ou eixos:
- **Páginas 1 e 3**: Edite `frontend/src/components/OverlapChart.jsx`.
- **Página 2**: Edite `frontend/src/components/ComposedChart2026.jsx`.

---

## 🚀 Guia de Manutenção e Deploy

### Como atualizar o site (Workflow GitHub)
Como o projeto está conectado ao **GitHub**, qualquer mudança salva no seu computador e enviada para a nuvem será publicada automaticamente no site segundos depois.

**Comandos no Terminal:**
```bash
git add .
git commit -m "Descricao da alteracao"
git push
```

### Configurações de Nuvem
- **Railway**: O Backend precisa do **Root Directory** definido como `backend` e a variável `PORT` exposta.
- **Vercel**: O Frontend precisa do **Root Directory** definido como `frontend` e da variável de ambiente `VITE_API_URL` apontando para o link do Railway (com o sufixo `/api`).

---

## 📅 Histórico de Evolução

- **Análise 3-Page**: Implementação das visões Geral, Pedidos e Orgânico com métricas de RPC e Ticket Médio.
- **Dashboard Samsung**: Migração completa para a identidade visual oficial da marca.
- **Sincronização de Insights**: Sistema de anotações persistentes no servidor para equipe.
- **Deploy Web**: Migração do ambiente local para infraestrutura de escala (Vercel + Railway).
- **Refinamento Final**: Ajuste de títulos de navegador, cabeçalhos e otimização de performance.

---

## 🔐 Segurança
- **Exclusão de Insights**: Requer a senha `1234`.
- **Manutenção**: Para alterar a senha de exclusão, edite `backend/src/index.js` (linha 43).

---
*Este documento serve como fonte da verdade para o projeto e deve ser atualizado em cada nova iteração técnica.*
