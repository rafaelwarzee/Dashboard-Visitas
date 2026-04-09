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
| **Texto Geral** | `#0000FF` | Azul padrão para leitura e títulos. |
| **Texto Insights**| `#000000` | Preto para máxima legibilidade em anotações. |
| **Fonte Títulos** | `Samsung SS Head Bold` | Tipografia institucional para impacto. |
| **Fonte Dados** | `Samsung SS Body Regular` | Tipografia para leitura de métricas. |

### Alteração de Cores de Gráficos
Para mudar as cores das linhas, barras ou eixos:
- **Páginas 1 e 3**: Edite `frontend/src/components/OverlapChart.jsx`.
- **Página 2**: Edite `frontend/src/components/ComposedChart2026.jsx`.

---

## 🚀 Guia de Manutenção e Deploy

## 🚀 Guia de Manutenção e Fluxo de Trabalho

Como o projeto está automatizado via GitHub, qualquer alteração passa por um fluxo simples de três etapas: **Alterar -> Testar -> Publicar**.

### 1. Como fazer alterações
- **No Frontend**: Se quiser mudar cores, nomes ou gráficos, os arquivos principais estão em `frontend/src/components/`.
- **No Backend**: Se quiser mudar a lógica de leitura das planilhas ou a senha de exclusão, edite `backend/src/dataService.js` ou `backend/src/index.js`.

### 2. Como testar Localmente (Obrigatório antes de publicar)
Antes de enviar para a web, verifique se tudo funciona no seu computador:

1. **Abra o Backend**:
   ```bash
   cd backend
   npm run dev  # Ele rodará em http://localhost:3001
   ```
2. **Abra o Frontend**:
   ```bash
   cd frontend
   npm run dev  # Ele rodará em http://localhost:5173
   ```
3. Verifique no navegador se as mudanças ficaram como você queria.

### 3. Como PUBLICAR na Web (Vercel + Railway)
Assim que você confirmar que está tudo certo localmente, rode estes comandos na **raiz do projeto** (onde fica o arquivo README) para atualizar o site oficial:

```bash
# 1. Prepara todos os arquivos alterados
git add .

# 2. Cria uma "etiqueta" com o que foi feito
git commit -m "Explique aqui o que voce mudou"

# 3. Envia para o GitHub (Isso ativa o deploy automático)
git push
```

**O que acontece depois do `git push`?**
- O **Railway** vai detectar que o código do backend mudou e vai reiniciar o servidor sozinho.
- A **Vercel** vai detectar que o frontend mudou e vai recompilar o site.
- Em cerca de 1 minuto, seu link oficial (`dashboard-visitas.vercel.app`) estará atualizado.

---

## 🏗️ Configurações de Nuvem (Referência)
- **Railway**: O Backend precisa do **Root Directory** definido como `backend` e a variável `PORT` exposta.
- **Vercel**: O Frontend precisa do **Root Directory** definido como `frontend` e da variável de ambiente `VITE_API_URL` apontando para o link do Railway (com o sufixo `/api`).

---

## 📅 Histórico de Evolução

- **Análise 3-Page**: Implementação das visões Geral, Pedidos e Orgânico com métricas de RPC e Ticket Médio.
- **Dashboard Samsung**: Migração completa para a identidade visual oficial da marca.
- **Sincronização de Insights**: Sistema de anotações persistentes no servidor para equipe.
- **Deploy Web**: Migração do ambiente local para infraestrutura de escala (Vercel + Railway).
- **Ajuste de Insights**: Otimização do box de anotações com fundo claro, texto preto e scrollbar.
- **Refinamento Final**: Ajuste de títulos de navegador, cabeçalhos e otimização de performance.

---

## 🔐 Segurança
- **Exclusão de Insights**: Requer a senha `1234`.
- **Manutenção**: Para alterar a senha de exclusão, edite `backend/src/index.js` (linha 43).

---
*Este documento serve como fonte da verdade para o projeto e deve ser atualizado em cada nova iteração técnica.*
