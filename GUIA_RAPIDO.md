# 🎯 Guia Rápido - Visualizar Ovos por Lote

## 📍 Onde Encontrar as Novas Funcionalidades?

### A. **Página INICIAL** 🏠
```
┌─────────────────────────────────────────────┐
│          🌾 GRANJA CONTROL v2.0             │
├─────────────────────────────────────────────┤
│                                             │
│  [Stats Cards: Hoje, Semana, Taxa, etc.]  │
│                                             │
│  ┌─────────────────────┬──────────────────┐
│  │ Produção 7 dias     │ Resumo dos Lotes │
│  │ (gráfico linha)     │ (hoje apenas)    │
│  │                     │ 🔷 LA: 5.000     │
│  │                     │ 🔷 LB: 3.500     │
│  └─────────────────────┴──────────────────┘
│                                             │
│  ┌──────────────────────────────────────┐  │
│  │ 📊 Total por Lote (NOVO!) ⭐        │  │
│  │ ┌────────────────────────────────┐  │  │
│  │ │ Lote A ████████████░░ 15.000  │  │  │
│  │ │ Lote B ██████░░░░░░░░░ 8.500  │  │  │
│  │ │ Lote C ██████████░░░░░ 11.200 │  │  │
│  │ └────────────────────────────────┘  │  │
│  │ Total: 34.700 ovos produzidos      │  │
│  └──────────────────────────────────────┘  │
│                                             │
│  [Últimos Registros + Estoque + Despesas] │
│                                             │
└─────────────────────────────────────────────┘
```

### B. **Página PRODUÇÃO** 🥚
```
┌─────────────────────────────────────────────┐
│         Produção de Ovos                    │
│  [＋ Registrar Produção]                    │
├─────────────────────────────────────────────┤
│                                             │
│  [Stats Cards]                              │
│                                             │
│  ┌─────────────────────┬──────────────────┐
│  │ Produção            │ Lotes Ativos     │
│  │ Últimos 7 dias      │ (Hoje)           │
│  │                     │ 🔷 LA: 5.000     │
│  │ ┌──────────────────┐│ 🔷 LB: 3.500     │
│  │ │                  ││ 🔷 LC: 6.200     │
│  │ │ [Selector ▼]     ││                  │
│  │ │ 📊 Todos ▼ (NEW!)││  [bars]          │
│  │ │                  ││                  │
│  │ │ 7d 14d 30d       ││                  │
│  │ │                  ││                  │
│  │ │ [Gráfico]        ││                  │
│  │ │                  ││                  │
│  │ │ LA───LA───LA───  ││                  │
│  │ │ LB   LB   LB     ││                  │
│  │ │ LC  LC--LC       ││                  │
│  │ │                  ││                  │
│  │ └──────────────────┘│                  │
│  └─────────────────────┴──────────────────┘
│                                             │
│  ┌─────────────────────────────────────┐   │
│  │ Histórico de Produção              │   │
│  ├─────────────────────────────────────┤   │
│  │ Data    Total Quebr Taxa  Lotes    │   │
│  │─────────────────────────────────────│   │
│  │ 10/03  25.000  150  92%  LA:8.5K   │   │
│  │        -         -    -   LB:10K   │   │
│  │        -         -    -   LC:6.5K  │   │
│  │                                    │   │
│  │ 09/03  22.000  120  84%  LA:7.5K   │   │
│  │        -         -    -   LB:9K    │   │
│  │        -         -    -   LC:5.5K  │   │
│  │                                    │   │
│  └─────────────────────────────────────┘   │
│                                             │
└─────────────────────────────────────────────┘
```

---

## 🎬 Exemplos de Uso

### Exemplo 1: Comparar Todos os Lotes
**Objetivo**: Ver qual lote produziu mais nos últimos 7 dias?

**Passos**:
1. Clique em **Produção** 🥚
2. Verifique se selector tem "📊 Todos os lotes"
3. Observe o gráfico com 3 linhas:
   - 🟠 Laranja = Lote A
   - 🟢 Verde = Lote B
   - 🔵 Azul = Lote C
4. Identifique qual linha está mais alta

**Resultado**: Você vê visualmente qual lote é mais produtivo

---

### Exemplo 2: Ver Lote Específico
**Objetivo**: Acompanhar a tendência do Lote B apenas

**Passos**:
1. Clique em **Produção** 🥚
2. Selector: escolha "🔷 Lote B"
3. Gráfico mostra apenas 1 linha (verde)
4. Mude entre **7d**, **14d**, **30d** para ver períodos

**Resultado**: Você vê a tendência individual do lote

---

### Exemplo 3: Avaliar Produtividade Geral
**Objetivo**: Qual lote é mais produtivo no total?

**Passos**:
1. Clique em **Início** 🏠
2. Procure por "📊 Total por Lote"
3. Observe as barras horizontais
4. Compare os tamanhos

**Resultado**: 
```
Lote A: ████████████░░ 15.000 [mais produtivo!]
Lote B: ██████░░░░░░░░░░░░░ 8.500
Lote C: ██████████░░░░░░░░░░ 11.200
```

---

### Exemplo 4: Registrar Produção
**Objetivo**: Registrar que Lote A produziu 5.000 ovos hoje

**Passos**:
1. Clique em **Produção** 🥚
2. Clique em **[＋ Registrar Produção]**
3. Preencha o modal:
   - Data: 10/03/2026
   - **Lote: Lote A** ← Escolha aqui!
   - Total de Ovos: 5000
   - Quebrados: 50
4. Clique **💾 Salvar**

**Resultado**: Sistema atualiza automaticamente todos os gráficos

---

## 🔄 Fluxo de Dados

```
┌─────────────────────────────────────────┐
│ 1. Você registra produção               │
│    (Modal → Lote A, 5.000 ovos)        │
└───────────────┬─────────────────────────┘
                │
┌───────────────▼─────────────────────────┐
│ 2. Supabase salva (BD)                  │
│    (Tabela producao com lote_id)        │
└───────────────┬─────────────────────────┘
                │
┌───────────────▼─────────────────────────┐
│ 3. Página carrega dados                 │
│    (Agrupa por lote_id)                 │
└───────────────┬─────────────────────────┘
                │
┌───────────────▼─────────────────────────┐
│ 4. Gráficos atualizam (Chart.js)        │
│    - Total por Lote (barras)            │
│    - Produção (linhas)                  │
│    - Histórico (tabela)                 │
└─────────────────────────────────────────┘
```

---

## 📊 Cores Dos Lotes

**Sempre consistentes em todo o sistema:**

| Posição | Lote | Cor | Hex |
|---------|------|-----|-----|
| 1º | Lote A | 🟠 Laranja | #f5a623 |
| 2º | Lote B | 🟢 Verde | #2ed573 |
| 3º | Lote C | 🔵 Azul | #4dabf7 |
| 4º | Lote D | ❤️ Vermelho | #ff6b81 |
| 5º | Lote E | 🟣 Roxo | #a29bfe |
| 6º | Lote F | 🟨 Amarelo | #ffeaa7 |
| 7º | Lote G | 💗 Rosa | #fd79a8 |

✨ **Dica**: Memorize as cores para reconhecer lotes rapidamente!

---

## 🛠️ Funcionalidades Detalhadas

### 1. Selector de Lotes (Novo!)
```
Localização: Página Produção, acima do gráfico
Opções:
  ├─ 📊 Todos os lotes    [mostra múltiplas linhas]
  ├─ 🔷 Lote A            [mostra apenas Lote A]
  ├─ 🔷 Lote B            [mostra apenas Lote B]
  └─ 🔷 Lote C            [mostra apenas Lote C]
```

### 2. Gráfico Múltiplo (Melhorado)
```
Modo: Todos os lotes
Tipo: Linhas
Saída: Múltiplas linhas (poli cromáticas)
Legenda: Sim (mostra cada lote)
Períodos: 7d, 14d, 30d
```

### 3. Gráfico de Barras (Novo!)
```
Localização: Página Inicial
Tipo: Barras horizontais
Eixo Y: Nomes dos lotes
Eixo X: Total de ovos
Cores: Cada lote sua cor
Dados: Total acumulado (sem limites de período)
```

### 4. Histórico Detalhado (Melhorado)
```
Localização: Página Produção, seção inferior
Coluna "Lotes": Antes mostra "3 lotes"
                Agora mostra "LA:8.5K|LB:10K|LC:6.5K"
Cores: Cada lote com sua cor
Formato: Badge colorido com números
```

---

## ✅ Checklist de Uso

- [ ] Entendi que há 2 páginas principais: Inicial e Produção
- [ ] Encontrei o selector "Todos os lotes" na Produção
- [ ] Testei selector com "Todos" e com "Lote específico"
- [ ] Vi o gráfico de barras na Inicial
- [ ] Registrei uma produção (Lote + Ovos)
- [ ] Vi os dados atualizados nos gráficos
- [ ] Identifiquei as cores dos lotes
- [ ] Mudei entre períodos (7d, 14d, 30d)

---

## 🚨 Possíveis Dúvidas

**P: Por que não vejo dados no gráfico?**
R: Você precisa registrar produção primeiro! Clique em "＋ Registrar Produção"

**P: Qual é a diferença entre "Resumo dos Lotes" e "Total por Lote"?**
R: 
- Resumo (Hoje): Apenas de hoje, com % de postura
- Total por Lote: Acumulado total, comparação geral

**P: Como lanço produção de múltiplos lotes no mesmo dia?**  
R: Clique "＋ Registrar Produção" múltiplas vezes (uma por lote)

**P: As cores sempre são as mesmas?**
R: Sim! A cor 1 é laranja, cor 2 é verde, etc. (ordem de cadastro)

---

## 📱 Navegação Rápida

```
🏠 Início (Home)
  ├─ 📊 Total por Lote          ← NOVO! Barras horizontais
  ├─ Resumo dos Lotes            ← Existente (hoje)
  └─ Últimos Registros           ← Existente

🥚 Produção
  ├─ 📊 Selector Todos/Individual ← NOVO!
  ├─ Gráfico Linhas               ← MELHORADO!
  ├─ Lotes Ativos                 ← Existente (hoje)
  └─ Histórico Detalhado          ← MELHORADO! Com lotes

🐔 Lotes (Gerenciar)
  └─ Novo Lote / Remover Lote

💰 Despesas
📦 Estoque
📈 Relatórios
```

---

**Pronto para usar! Boa sorte com sua granja! 🐓🥚**
