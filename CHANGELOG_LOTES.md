# 🥚 Atualização: Seleção de Lotes e Gráficos por Lote

## ✨ Novas Funcionalidades Adicionadas

### 1. **Seletor de Lotes na Página de Produção**
- Na página **Produção**, agora há um seletor dropdown acima do gráfico com as opções:
  - **📊 Todos os lotes** (padrão) - mostra o gráfico com todos os lotes em linhas diferentes
  - **🔷 Nome do Lote** - mostra apenas o gráfico de um lote específico
- O gráfico atualiza automaticamente quando você muda o seletor

### 2. **Gráfico de Produção Melhorado**
- **Visualização por Lote**: Quando "Todos os lotes" está selecionado:
  - Mostra múltiplas linhas, uma para cada lote
  - Cada lote tem sua cor única e legenda
  - Permite comparar a produção entre lotes facilmente

- **Visualização Individual**: Quando um lote específico está selecionado:
  - Mostra apenas a linha de produção daquele lote
  - Fundo colorido diferenciado
  - Nível de detalhe maior

### 3. **Gráfico de Barras Horizontal na Página Inicial**
- Nova seção "**Total por Lote**" na página Início
- Mostra um gráfico de barras horizontal com:
  - Cada lote representado por uma barra
  - Cor diferente para cada lote (mesmas cores ao longo da aplicação)
  - Total de ovos produzidos (acumulado de todos os períodos)
  - Permite visualizar rapidamente qual lote é mais produtivo

### 4. **Resumo Diário de Lotes (Existente, Mantido)**
- Na página Início, seção "Resumo dos Lotes" continua mostrando:
  - Ovos coletados **hoje** por cada lote
  - Barra de progresso visual
  - Taxa de postura individual
  - Número de galinhas em cada lote

### 5. **Modal de Produção (Funcionalidade Existente)**
- O modal "Registrar Produção" já permite selecionar o lote:
  - Data
  - **Lote** (seletor com todos os lotes cadastrados)
  - Total de ovos
  - Ovos quebrados

## 📊 Como Usar

### Na Página Inicial:
1. Veja o gráfico "Produção — Últimos 7 dias" (total geral)
2. Veja "Resumo dos Lotes" para a produção de **hoje**
3. Veja "Total por Lote" para a produção **acumulada** de cada lote

### Na Página de Produção:
1. Use o seletor **"Todos os lotes"** para comparar todos os lotes
2. Use o seletor **"Nome do Lote"** para ver detalhes de um lote específico
3. Use as abas **(7d / 14d / 30d)** para alterar o período
4. Clique em **"＋ Registrar Produção"** para adicionar um novo registro

## 🎨 Cores dos Lotes

As cores são atribuídas automaticamente a cada lote conforme a ordem:
- Lote 1: 🟠 Laranja
- Lote 2: 🟢 Verde
- Lote 3: 🔵 Azul
- E assim por diante...

As mesmas cores são usadas em todos os gráficos para manter consistência.

## 📝 Exemplos de Uso

### Cenário 1: Comparar produção de dois lotes
1. Vá para a página **Produção**
2. Verifique o gráfico com "Todos os lotes" selecionado
3. Observe as linhas de cada lote para identificar tendências

### Cenário 2: Analisar um lote específico
1. Vá para a página **Produção**
2. Selecione o lote desejado no dropdown
3. Mude entre 7d, 14d, 30d para ver diferentes períodos
4. Compare com a aba de Lotes Ativos

### Cenário 3: Avaliar produtividade geral
1. Na página **Início**, verifique o gráfico "Total por Lote"
2. Identifique qual lote tem maior produção acumulada
3. Compare com "Resumo dos Lotes" (apenas hoje)

## 🔧 Trechos de Código Importantes

### Seleção de Lotes (granja.js)
```javascript
function updateProdChartByLote(days=7) {
  const selectedLoteId = document.getElementById('prodLoteFilter')?.value || 'todos';
  // ... renderiza o gráfico baseado na seleção
}
```

### Novo seletor no HTML (index.html)
```html
<select class="form-select" id="prodLoteFilter" onchange="updateProdChartByLote();"></select>
```

## ✅ Checklist de Funcionalidades

- ✅ Seletor de lotes na página de Produção
- ✅ Gráfico com múltiplos lotes (modo "Todos")
- ✅ Gráfico com lote individual (modo específico)
- ✅ Gráfico de barras na página Inicial
- ✅ Cores diferenciadas por lote
- ✅ Modal de produção com seleção de lote
- ✅ Histórico de produção por data
- ✅ Compatibilidade com Supabase

## 📱 Compatibilidade

- ✅ Desktop
- ✅ Tablet
- ✅ Mobile

---

**Versão**: 2.1 | **Data**: Março 2026 | **Status**: ✅ Em Produção
