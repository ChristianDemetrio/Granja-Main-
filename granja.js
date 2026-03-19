// =============================================================================
// GRANJACONTROL — granja.js
// Banco de dados: Supabase (PostgreSQL)
// Configure suas credenciais em supabase.config.js antes de usar
// =============================================================================

// ========== SUPABASE CLIENT ==========
// "supabase" já é nome da lib global — usamos "db" para o cliente
const db = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

// ========== CONSTANTES ==========
const LOT_COLORS = ['#f5a623','#2ed573','#4dabf7','#ff6b81','#a29bfe','#ffeaa7','#fd79a8'];

// ========== STATE (cache em memória) ==========
let state = { lotes: [], producao: [], saidas: [], despesas: [], mortalidade: [] };

// =============================================================================
// DB — CAMADA DE ACESSO AO SUPABASE
// =============================================================================
const DB = {

  // LOTES
  async getLotes() {
    const { data, error } = await db.from('lotes').select('*').order('created_at');
    if (error) throw error;
    return data;
  },
  async insertLote(l) {
    const { data, error } = await db.from('lotes')
      .insert([{ nome: l.nome, galinhas: l.galinhas, data: l.data, raca: l.raca }])
      .select().single();
    if (error) throw error;
    return data;
  },
  async deleteLote(id) {
    const { error } = await db.from('lotes').delete().eq('id', id);
    if (error) throw error;
  },

  // PRODUÇÃO
  async getProducao() {
    const { data, error } = await db.from('producao').select('*').order('data');
    if (error) throw error;
    return data;
  },
  async insertProducao(r) {
    const { data, error } = await db.from('producao')
      .insert([{ data: r.data, lote_id: r.lote, ovos: r.ovos, quebrados: r.quebrados }])
      .select().single();
    if (error) throw error;
    return data;
  },
  async deleteProducaoByDate(date) {
    const { error } = await db.from('producao').delete().eq('data', date);
    if (error) throw error;
  },

  // SAÍDAS
  async getSaidas() {
    const { data, error } = await db.from('saidas').select('*').order('data', { ascending: false });
    if (error) throw error;
    return data;
  },
  async insertSaida(s) {
    const { data, error } = await db.from('saidas')
      .insert([{ data: s.data, qtd: s.qtd, descricao: s.descricao }])
      .select().single();
    if (error) throw error;
    return data;
  },

  // MORTALIDADE
  async getMortalidade() {
    const { data, error } = await db.from('mortalidade').select('*').order('data', { ascending: false });
    if (error) throw error;
    return data;
  },
  async insertMortalidade(m) {
    const { data, error } = await db.from('mortalidade')
      .insert([{ lote_id: m.lote_id, data: m.data, quantidade: m.quantidade, motivo: m.motivo }])
      .select().single();
    if (error) throw error;
    return data;
  },
  async deleteMortalidade(id) {
    const { error } = await db.from('mortalidade').delete().eq('id', id);
    if (error) throw error;
  },

  // DESPESAS
  async getDespesas() {
    const { data, error } = await db.from('despesas').select('*').order('data', { ascending: false });
    if (error) throw error;
    return data;
  },
  async insertDespesa(d) {
    const { data, error } = await db.from('despesas')
      .insert([{ data: d.data, cat: d.cat, descricao: d.descricao, valor: d.valor }])
      .select().single();
    if (error) throw error;
    return data;
  }
};

// =============================================================================
// CARREGAMENTO INICIAL
// =============================================================================
async function loadAllData() {
  // Verifica se credenciais foram preenchidas
  if (!SUPABASE_URL || SUPABASE_URL.includes('SEU_PROJETO') ||
      !SUPABASE_KEY || SUPABASE_KEY.includes('SUA_ANON_KEY')) {
    showLoadingError({
      message: 'Credenciais não configuradas. Abra o arquivo supabase.config.js e substitua SUPABASE_URL e SUPABASE_KEY pelos valores do seu projeto.'
    });
    return;
  }

  showLoading(true, 'Conectando ao banco de dados...', 'Buscando lotes, produção, estoque e despesas...');
  try {
    showLoading(true, 'Carregando lotes...', '');
    const lotes = await DB.getLotes();

    showLoading(true, 'Carregando produção...', '');
    const producao = await DB.getProducao();

    showLoading(true, 'Carregando estoque, despesas e mortalidade...', '');
    const [saidas, despesas, mortalidade] = await Promise.all([DB.getSaidas(), DB.getDespesas(), DB.getMortalidade()]);

    state.lotes      = lotes;
    state.producao   = producao.map(p => ({ ...p, lote: p.lote_id }));
    state.saidas     = saidas;
    state.despesas   = despesas;
    state.mortalidade = mortalidade;

    showLoading(false);
    renderInicio();
  } catch (err) {
    showLoadingError(err);
  }
}

function showLoading(show, msg, detail) {
  const overlay  = document.getElementById('loadingOverlay');
  const msgEl    = document.getElementById('loadingMsg');
  const detailEl = document.getElementById('loadingDetail');
  const errEl    = document.getElementById('loadingError');
  const spinner  = document.getElementById('loadingSpinner');
  overlay.style.display = show ? 'flex' : 'none';
  if (msg)    msgEl.textContent    = msg;
  if (detail) detailEl.textContent = detail;
  if (!show) { errEl.style.display = 'none'; spinner.style.display = 'block'; }
}

function showLoadingError(err) {
  const overlay  = document.getElementById('loadingOverlay');
  const spinner  = document.getElementById('loadingSpinner');
  const msgEl    = document.getElementById('loadingMsg');
  const errEl    = document.getElementById('loadingError');
  const errMsgEl = document.getElementById('loadingErrorMsg');
  overlay.style.display  = 'flex';
  spinner.style.display  = 'none';
  msgEl.textContent      = 'Não foi possível carregar o sistema';
  errEl.style.display    = 'block';
  errMsgEl.innerHTML     = `<b>Mensagem:</b> ${err.message || err}<br><br>`
    + `<b>Dica:</b> Confira se a URL e a KEY no supabase.config.js estão corretas e se as tabelas foram criadas com o banco.sql`;
  console.error('GranjaControl — erro Supabase:', err);
}

// =============================================================================
// NAVEGAÇÃO
// =============================================================================
function navigate(page) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
  document.querySelectorAll('.bn-item').forEach(n => n.classList.remove('active'));
  document.getElementById('page-' + page).classList.add('active');
  const sideItem = document.querySelector(`.nav-item[onclick="navigate('${page}')"]`);
  if (sideItem) sideItem.classList.add('active');
  const bnItem = document.getElementById('bn-' + page);
  if (bnItem) bnItem.classList.add('active');
  window.scrollTo({ top: 0, behavior: 'smooth' });
  if (page === 'inicio')     renderInicio();
  if (page === 'producao')   renderProducao();
  if (page === 'lotes')      renderLotes();
  if (page === 'estoque')    renderEstoque();
  if (page === 'relatorios') renderRelatorios();
  if (page === 'despesas')   renderDespesas();
}

// =============================================================================
// HELPERS
// =============================================================================
function getTotalByDate(date)  { return state.producao.filter(p => p.data === date).reduce((s,p)=>s+p.ovos,0); }
function getQuebraByDate(date) { return state.producao.filter(p => p.data === date).reduce((s,p)=>s+p.quebrados,0); }
function getRecentDates(n) {
  return [...new Set(state.producao.map(p=>p.data))].sort().reverse().slice(0,n).reverse();
}
function totalGalinhas() { return state.lotes.reduce((s,l)=>s+l.galinhas,0); }
function formatNum(n) { return n.toLocaleString('pt-BR'); }
function fmtDate(d) { const [y,m,day]=d.split('-'); return `${day}/${m}/${y}`; }
function today() { return new Date().toISOString().split('T')[0]; }
function getColorByIdx(i) { return LOT_COLORS[i % LOT_COLORS.length]; }
function getLoteById(id) { return state.lotes.find(l=>l.id===id); }

function setBtnLoading(id, loading, label) {
  const btn = document.getElementById(id);
  if (!btn) return;
  btn.disabled     = loading;
  btn.textContent  = loading ? '⏳ Salvando...' : (label || btn.dataset.label || 'Salvar');
}

// =============================================================================
// RENDER INÍCIO
// =============================================================================
let inicioChart = null;

function renderInicio() {
  const h = new Date().getHours();
  document.getElementById('inicioBemVindo').textContent =
    h < 12 ? 'Bom dia! 🌅' : h < 18 ? 'Boa tarde! ☀️' : 'Boa noite! 🌙';

  const dates      = getRecentDates(30);
  const todayDate  = dates[dates.length-1] || today();
  const yesterDate = dates[dates.length-2] || null;
  const todayTotal = getTotalByDate(todayDate);
  const yesterTotal= yesterDate ? getTotalByDate(yesterDate) : 0;
  const todayQuebra= getQuebraByDate(todayDate);
  const totalGal   = totalGalinhas();
  const taxa       = totalGal > 0 ? ((todayTotal/totalGal)*100).toFixed(1) : '0.0';

  document.getElementById('iStatHoje').textContent   = formatNum(todayTotal);
  document.getElementById('iStatQuebra').textContent = formatNum(todayQuebra);
  document.getElementById('iStatTaxa').textContent   = taxa + '%';

  const hojeBadge = document.getElementById('iStatHojeBadge');
  if (yesterTotal > 0) {
    const diff = todayTotal - yesterTotal;
    const pct  = ((diff/yesterTotal)*100).toFixed(1);
    hojeBadge.textContent = (diff>=0?'▲ +':'▼ ') + pct + '% vs ontem';
    hojeBadge.className   = 'stat-badge '+(diff>=0?'badge-up':'badge-down');
  } else {
    hojeBadge.textContent = '— sem comparativo';
    hojeBadge.className   = 'stat-badge';
    hojeBadge.style.cssText = 'background:rgba(107,117,147,0.15);color:var(--muted)';
  }

  const sliceDates = dates.slice(-7);
  const weekTotal  = sliceDates.reduce((s,d)=>s+getTotalByDate(d),0);
  document.getElementById('iStatSemana').textContent = formatNum(weekTotal);
  const prevSlice = dates.slice(-14,-7);
  const prevTotal = prevSlice.reduce((s,d)=>s+getTotalByDate(d),0);
  const varPct    = prevTotal>0?(((weekTotal-prevTotal)/prevTotal)*100).toFixed(1):0;
  const semBadge  = document.getElementById('iStatSemanaBadge');
  semBadge.textContent = (varPct>=0?'▲ +':'▼ ')+varPct+'% vs semana anterior';
  semBadge.className   = 'stat-badge '+(varPct>=0?'badge-up':'badge-down');

  const taxaBadge = document.getElementById('iStatTaxaBadge');
  taxaBadge.textContent = parseFloat(taxa)>=85?'▲ excelente':parseFloat(taxa)>=70?'◆ normal':'▼ baixa';
  taxaBadge.className   = 'stat-badge '+(parseFloat(taxa)>=85?'badge-up':'badge-down');

  const totalProd  = state.producao.reduce((s,p)=>s+p.ovos,0);
  const totalSaida = state.saidas.reduce((s,e)=>s+e.qtd,0);
  document.getElementById('iSaldoEstoque').textContent  = formatNum(totalProd-totalSaida);
  document.getElementById('iTotalGalinhas').textContent = formatNum(totalGal);

  const mes = new Date().toISOString().slice(0,7);
  const despMes  = state.despesas.filter(d=>d.data.startsWith(mes));
  const totalDesp= despMes.reduce((s,d)=>s+d.valor,0);
  const ovosMes  = state.producao.filter(p=>p.data.startsWith(mes)).reduce((s,p)=>s+p.ovos,0);
  document.getElementById('iDespMes').textContent  = 'R$ '+totalDesp.toLocaleString('pt-BR',{minimumFractionDigits:2});
  document.getElementById('iCustoOvo').textContent = ovosMes>0?'R$ '+(totalDesp/ovosMes).toFixed(4):'R$ —';

  // Gráfico
  const chartDates  = getRecentDates(7);
  const chartData   = chartDates.map(d=>getTotalByDate(d));
  const chartLabels = chartDates.map(d=>fmtDate(d).slice(0,5));
  if (inicioChart) inicioChart.destroy();
  const ctx  = document.getElementById('inicioChart').getContext('2d');
  const grad = ctx.createLinearGradient(0,0,0,200);
  grad.addColorStop(0,'rgba(245,166,35,0.3)');
  grad.addColorStop(1,'rgba(245,166,35,0)');
  inicioChart = new Chart(ctx,{
    type:'line',
    data:{ labels:chartLabels, datasets:[{ data:chartData, borderColor:'#f5a623', backgroundColor:grad,
      fill:true, tension:0.4, pointBackgroundColor:'#f5a623', pointRadius:5, pointHoverRadius:7, borderWidth:2.5 }]},
    options:{ responsive:true, maintainAspectRatio:false, plugins:{legend:{display:false}},
      scales:{ x:{grid:{color:'#2a3048'},ticks:{color:'#6b7593',font:{size:11}}},
               y:{grid:{color:'#2a3048'},ticks:{color:'#6b7593',font:{size:11},callback:v=>formatNum(v)},beginAtZero:false}}}
  });

  // Lotes
  document.getElementById('iLoteCount').textContent = state.lotes.length+' lotes ativos';
  const iLotesDiv = document.getElementById('iLotesResume');
  if (state.lotes.length===0) {
    iLotesDiv.innerHTML='<div class="empty" style="padding:30px"><div class="empty-icon" style="font-size:32px">🐔</div><div class="empty-text">Nenhum lote cadastrado.</div></div>';
  } else {
    const maxOvos=Math.max(...state.lotes.map(l=>state.producao.filter(p=>p.lote===l.id&&p.data===todayDate).reduce((s,p)=>s+p.ovos,0)),1);
    iLotesDiv.innerHTML=state.lotes.map((l,i)=>{
      const ov=state.producao.filter(p=>p.lote===l.id&&p.data===todayDate).reduce((s,p)=>s+p.ovos,0);
      const tx=l.galinhas>0?((ov/l.galinhas)*100).toFixed(1):'0.0';
      const pct=(ov/maxOvos)*100; const c=getColorByIdx(i);
      return `<div class="lote-item"><div class="lote-dot" style="background:${c}"></div><div style="flex:1">
        <div style="display:flex;justify-content:space-between"><span class="lote-name">${l.nome}</span><span class="lote-val" style="color:${c}">${formatNum(ov)}</span></div>
        <div style="display:flex;justify-content:space-between"><span class="lote-info">${formatNum(l.galinhas)} galinhas</span><span class="lote-info">${tx}% postura</span></div>
        <div class="progress-bar"><div class="progress-fill" style="width:${pct}%;background:${c}"></div></div>
      </div></div>`;
    }).join('');
  }

  // Últimos registros
  const grouped={};
  state.producao.forEach(p=>{ if(!grouped[p.data]) grouped[p.data]={ovos:0,quebrados:0}; grouped[p.data].ovos+=p.ovos; grouped[p.data].quebrados+=p.quebrados; });
  const sortedDates=Object.keys(grouped).sort().reverse().slice(0,5);
  const tbody=document.getElementById('iRecentBody');
  const empty=document.getElementById('iEmptyRecent');
  if(sortedDates.length===0){ empty.style.display='block'; tbody.innerHTML=''; return; }
  empty.style.display='none';
  tbody.innerHTML=sortedDates.map(d=>{
    const g=grouped[d]; const t=totalGal>0?((g.ovos/totalGal)*100).toFixed(1):'0.0';
    const rc=parseFloat(t)>=85?'rate-good':parseFloat(t)>=70?'rate-warn':'rate-bad';
    return `<tr><td class="td-date" style="padding:12px 0">${fmtDate(d)}</td><td class="td-total" style="padding:12px 8px">${formatNum(g.ovos)}</td><td style="padding:12px 8px"><span class="badge-broken">${g.quebrados}</span></td><td class="td-rate ${rc}" style="padding:12px 0">${t}%</td></tr>`;
  }).join('');
}

// =============================================================================
// RENDER PRODUÇÃO
// =============================================================================
let chartInstance=null;

function renderProducao(days=7) {
  const dates=getRecentDates(30); const todayDate=dates[dates.length-1]||today();
  const todayTotal=getTotalByDate(todayDate); const todayQuebra=getQuebraByDate(todayDate);
  const totalGal=totalGalinhas(); const taxa=totalGal>0?((todayTotal/totalGal)*100).toFixed(1):'0.0';

  document.getElementById('statHoje').textContent      = formatNum(todayTotal);
  document.getElementById('statQuebrados').textContent = formatNum(todayQuebra);
  document.getElementById('statTaxa').textContent      = taxa+'%';
  const taxaBadge=document.getElementById('statTaxaBadge');
  taxaBadge.textContent=parseFloat(taxa)>=85?'▲ excelente':parseFloat(taxa)>=70?'◆ normal':'▼ baixa';
  taxaBadge.className='stat-badge '+(parseFloat(taxa)>=85?'badge-up':'badge-down');

  const sliceDates=dates.slice(-days); const weekTotal=sliceDates.reduce((s,d)=>s+getTotalByDate(d),0);
  document.getElementById('statSemana').textContent=formatNum(weekTotal);
  const prevSlice=dates.slice(-(days*2),-days); const prevTotal=prevSlice.reduce((s,d)=>s+getTotalByDate(d),0);
  const varPct=prevTotal>0?(((weekTotal-prevTotal)/prevTotal)*100).toFixed(1):0;
  const semVar=document.getElementById('statVarSemana');
  semVar.textContent=(varPct>=0?'▲ +':'▼ ')+varPct+'% vs anterior';
  semVar.className='stat-badge '+(varPct>=0?'badge-up':'badge-down');

  const chartDates=getRecentDates(days); const chartData=chartDates.map(d=>getTotalByDate(d));
  const chartLabels=chartDates.map(d=>fmtDate(d).slice(0,5));
  if (chartInstance) chartInstance.destroy();
  const ctx=document.getElementById('prodChart').getContext('2d');
  const gradient=ctx.createLinearGradient(0,0,0,200);
  gradient.addColorStop(0,'rgba(245,166,35,0.3)'); gradient.addColorStop(1,'rgba(245,166,35,0)');
  chartInstance=new Chart(ctx,{
    type:'line',
    data:{labels:chartLabels,datasets:[{data:chartData,borderColor:'#f5a623',backgroundColor:gradient,fill:true,tension:0.4,pointBackgroundColor:'#f5a623',pointRadius:4,pointHoverRadius:6,borderWidth:2.5}]},
    options:{responsive:true,maintainAspectRatio:false,plugins:{legend:{display:false}},
      scales:{x:{grid:{color:'#2a3048'},ticks:{color:'#6b7593',font:{size:11}}},y:{grid:{color:'#2a3048'},ticks:{color:'#6b7593',font:{size:11},callback:v=>formatNum(v)},beginAtZero:false}}}
  });

  const lotesDiv=document.getElementById('lotesResume');
  if(state.lotes.length===0){
    lotesDiv.innerHTML='<div class="empty"><div class="empty-icon">🐔</div><div class="empty-text">Nenhum lote cadastrado.</div></div>';
  } else {
    const maxOvos=Math.max(...state.lotes.map(l=>state.producao.filter(p=>p.lote===l.id&&p.data===todayDate).reduce((s,p)=>s+p.ovos,0)),1);
    lotesDiv.innerHTML=state.lotes.map((l,i)=>{
      const ov=state.producao.filter(p=>p.lote===l.id&&p.data===todayDate).reduce((s,p)=>s+p.ovos,0);
      const tx=l.galinhas>0?((ov/l.galinhas)*100).toFixed(1):'0.0';
      const pct=(ov/maxOvos)*100; const c=getColorByIdx(i);
      return `<div class="lote-item"><div class="lote-dot" style="background:${c}"></div><div style="flex:1">
        <div style="display:flex;justify-content:space-between"><span class="lote-name">${l.nome}</span><span class="lote-val" style="color:${c}">${formatNum(ov)}</span></div>
        <div style="display:flex;justify-content:space-between"><span class="lote-info">${formatNum(l.galinhas)} galinhas · ${tx}%</span><span class="lote-info">${l.raca}</span></div>
        <div class="progress-bar"><div class="progress-fill" style="width:${pct}%;background:${c}"></div></div>
      </div></div>`;
    }).join('');
  }

  const grouped={};
  state.producao.forEach(p=>{ if(!grouped[p.data]) grouped[p.data]=[]; grouped[p.data].push(p); });
  const sortedDates=Object.keys(grouped).sort().reverse();
  const tbody=document.getElementById('historyBody');
  document.getElementById('histCount').textContent=sortedDates.length+' registros';
  if(sortedDates.length===0){ document.getElementById('emptyHistory').style.display='block'; tbody.innerHTML=''; return; }
  document.getElementById('emptyHistory').style.display='none';
  tbody.innerHTML=sortedDates.map(d=>{
    const total=grouped[d].reduce((s,p)=>s+p.ovos,0);
    const quebrados=grouped[d].reduce((s,p)=>s+p.quebrados,0);
    const loteCount=[...new Set(grouped[d].map(p=>p.lote))].length;
    const taxa2=totalGalinhas()>0?((total/totalGalinhas())*100).toFixed(1):'0.0';
    const rateClass=parseFloat(taxa2)>=85?'rate-good':parseFloat(taxa2)>=70?'rate-warn':'rate-bad';
    return `<tr><td class="td-date">${fmtDate(d)}</td><td class="td-total">${formatNum(total)}</td><td><span class="badge-broken">${quebrados}</span></td><td class="td-rate ${rateClass}">${taxa2}%</td><td><span class="badge-lotes">${loteCount} lotes</span></td><td><button class="btn btn-ghost" style="padding:6px 12px;font-size:11px" onclick="deleteDate('${d}')">🗑</button></td></tr>`;
  }).join('');
}

function switchTab(el,days){ el.parentElement.querySelectorAll('.tab').forEach(t=>t.classList.remove('active')); el.classList.add('active'); renderProducao(parseInt(days)); }

function openModal() {
  if(state.lotes.length===0){ showToast('error','Cadastre um lote primeiro!'); return; }
  document.getElementById('fData').value=today();
  document.getElementById('fLote').innerHTML=state.lotes.map(l=>`<option value="${l.id}">${l.nome} (${formatNum(l.galinhas)} galinhas)</option>`).join('');
  document.getElementById('fOvos').value=''; document.getElementById('fQuebrados').value=''; document.getElementById('fObs').value='';
  document.getElementById('modalOverlay').classList.add('open');
}
function closeModal(){ document.getElementById('modalOverlay').classList.remove('open'); }

async function salvarProducao() {
  const data=document.getElementById('fData').value;
  const lote=parseInt(document.getElementById('fLote').value);
  const ovos=parseInt(document.getElementById('fOvos').value);
  const quebrados=parseInt(document.getElementById('fQuebrados').value)||0;
  if(!data||!lote||!ovos||ovos<=0){ showToast('error','Preencha todos os campos!'); return; }
  if(quebrados>ovos){ showToast('error','Quebrados não pode ser maior que total!'); return; }
  setBtnLoading('btnSalvarProducao',true,'💾 Salvar');
  try {
    const novo=await DB.insertProducao({data,lote,ovos,quebrados});
    state.producao.push({...novo,lote:novo.lote_id});
    closeModal(); renderProducao(); showToast('success',`✅ ${formatNum(ovos)} ovos registrados!`);
  } catch(err){ showToast('error','❌ Erro: '+err.message); }
  finally{ setBtnLoading('btnSalvarProducao',false,'💾 Salvar'); }
}

async function deleteDate(date) {
  if(!confirm(`Remover todos os registros de ${fmtDate(date)}?`)) return;
  try {
    await DB.deleteProducaoByDate(date);
    state.producao=state.producao.filter(p=>p.data!==date);
    renderProducao(); showToast('success','🗑 Registros removidos');
  } catch(err){ showToast('error','❌ Erro: '+err.message); }
}

// =============================================================================
// RENDER / CRUD LOTES
// =============================================================================
function renderLotes() {
  const div=document.getElementById('lotesList'); const empty=document.getElementById('emptyLotes');
  if(state.lotes.length===0){ div.innerHTML=''; empty.style.display='block'; return; }
  empty.style.display='none';
  div.innerHTML=state.lotes.map((l,i)=>{
    const color=getColorByIdx(i);
    const totalOvosLote=state.producao.filter(p=>p.lote===l.id).reduce((s,p)=>s+p.ovos,0);
    const totalMortalidade=state.mortalidade.filter(m=>m.lote_id===l.id).reduce((s,m)=>s+m.quantidade,0);
    return `<div class="stat-card">
      <div style="position:absolute;top:0;left:0;right:0;height:3px;background:${color};border-radius:16px 16px 0 0"></div>
      <div style="font-size:28px;margin-bottom:10px">🐔</div>
      <div style="font-size:16px;font-weight:800;margin-bottom:4px">${l.nome}</div>
      <div style="font-size:12px;color:var(--muted);margin-bottom:12px">${l.raca}</div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;font-size:12px">
        <div><span style="color:var(--muted)">Galinhas</span><br><b>${formatNum(l.galinhas)}</b></div>
        <div><span style="color:var(--muted)">Entrada</span><br><b>${fmtDate(l.data)}</b></div>
        <div style="grid-column:span 2"><span style="color:var(--muted)">Total produzido</span><br><b style="color:${color}">${formatNum(totalOvosLote)} ovos</b></div>
        <div style="grid-column:span 2"><span style="color:var(--muted)">Mortalidade</span><br><b style="color:#ff6b81">${formatNum(totalMortalidade)} aves</b></div>
      </div>
      <div style="margin-top:14px;display:flex;gap:8px">
        <button class="btn btn-ghost" style="flex:1;padding:8px;font-size:12px" onclick="openMortalidadeModal(${l.id},'${l.nome}')">✏️ Editar Mortalidade</button>
        <button class="btn btn-ghost" style="flex:1;padding:8px;font-size:12px" onclick="deleteLote(${l.id})">🗑 Remover</button>
      </div>
    </div>`;
  }).join('');
}

function openLoteModal(){ document.getElementById('lNome').value=''; document.getElementById('lGalinhas').value=''; document.getElementById('lData').value=today(); document.getElementById('lRaca').value=''; document.getElementById('loteModalOverlay').classList.add('open'); }
function closeLoteModal(){ document.getElementById('loteModalOverlay').classList.remove('open'); }

async function salvarLote() {
  const nome=document.getElementById('lNome').value.trim();
  const galinhas=parseInt(document.getElementById('lGalinhas').value);
  const data=document.getElementById('lData').value;
  const raca=document.getElementById('lRaca').value.trim()||'Não informada';
  if(!nome||!galinhas||galinhas<=0||!data){ showToast('error','Preencha todos os campos!'); return; }
  setBtnLoading('btnSalvarLote',true,'💾 Salvar');
  try {
    const novo=await DB.insertLote({nome,galinhas,data,raca});
    state.lotes.push(novo); closeLoteModal(); renderLotes(); showToast('success',`✅ Lote "${nome}" cadastrado!`);
  } catch(err){ showToast('error','❌ Erro: '+err.message); }
  finally{ setBtnLoading('btnSalvarLote',false,'💾 Salvar'); }
}

async function deleteLote(id) {
  const l=getLoteById(id);
  if(!confirm(`Remover lote "${l.nome}"?`)) return;
  try {
    await DB.deleteLote(id); state.lotes=state.lotes.filter(l=>l.id!==id); renderLotes(); showToast('success','🗑 Lote removido');
  } catch(err){ showToast('error','❌ Erro: '+err.message); }
}

// =============================================================================
// RENDER / CRUD MORTALIDADE
// =============================================================================
let mortalidadeEditandoLoteId=null;

function openMortalidadeModal(loteId,loteName){
  mortalidadeEditandoLoteId=loteId;
  document.getElementById('mLoteNome').textContent=loteName;
  document.getElementById('mData').value=today();
  document.getElementById('mQuantidade').value='';
  document.getElementById('mMotivo').value='';
  document.getElementById('mortalidadeModalOverlay').classList.add('open');
  renderMortalidadeList(loteId);
}

function closeMortalidadeModal(){
  document.getElementById('mortalidadeModalOverlay').classList.remove('open');
  mortalidadeEditandoLoteId=null;
}

function renderMortalidadeList(loteId){
  const mortalidadeLote=state.mortalidade.filter(m=>m.lote_id===loteId).sort((a,b)=>b.data.localeCompare(a.data));
  const tbody=document.getElementById('mortalidadeBody');
  const empty=document.getElementById('emptyMortalidade');
  if(mortalidadeLote.length===0){
    tbody.innerHTML='';
    empty.style.display='block';
    return;
  }
  empty.style.display='none';
  tbody.innerHTML=mortalidadeLote.map(m=>`
    <tr>
      <td class="td-date">${fmtDate(m.data)}</td>
      <td style="color:#ff6b81"><b>${formatNum(m.quantidade)}</b></td>
      <td style="font-size:12px;color:var(--muted)">${m.motivo}</td>
      <td><button class="btn btn-ghost" style="padding:4px 8px;font-size:11px" onclick="deletarMortalidade(${m.id})">🗑</button></td>
    </tr>
  `).join('');
}

async function salvarMortalidade(){
  if(!mortalidadeEditandoLoteId){ showToast('error','Erro: lote não selecionado'); return; }
  const data=document.getElementById('mData').value;
  const quantidade=parseInt(document.getElementById('mQuantidade').value);
  const motivo=document.getElementById('mMotivo').value.trim();
  if(!data||!quantidade||quantidade<=0||!motivo){ showToast('error','Preencha todos os campos!'); return; }
  setBtnLoading('btnSalvarMortalidade',true,'💾 Salvar');
  try {
    const novo=await DB.insertMortalidade({lote_id:mortalidadeEditandoLoteId,data,quantidade,motivo});
    state.mortalidade.push(novo);
    renderMortalidadeList(mortalidadeEditandoLoteId);
    renderLotes();
    document.getElementById('mData').value=today();
    document.getElementById('mQuantidade').value='';
    document.getElementById('mMotivo').value='';
    showToast('success',`✅ Mortalidade registrada!`);
  } catch(err){ showToast('error','❌ Erro: '+err.message); }
  finally{ setBtnLoading('btnSalvarMortalidade',false,'💾 Salvar'); }
}

async function deletarMortalidade(id){
  if(!confirm('Remover este registro de mortalidade?')) return;
  try {
    await DB.deleteMortalidade(id);
    state.mortalidade=state.mortalidade.filter(m=>m.id!==id);
    if(mortalidadeEditandoLoteId) renderMortalidadeList(mortalidadeEditandoLoteId);
    renderLotes();
    showToast('success','🗑 Registro removido');
  } catch(err){ showToast('error','❌ Erro: '+err.message); }
}

// =============================================================================
// RENDER / CRUD ESTOQUE
// =============================================================================
function renderEstoque() {
  const totalProd=state.producao.reduce((s,p)=>s+p.ovos,0);
  const totalSaida=state.saidas.reduce((s,e)=>s+e.qtd,0);
  document.getElementById('estProduzido').textContent=formatNum(totalProd);
  document.getElementById('estSaida').textContent=formatNum(totalSaida);
  document.getElementById('estSaldo').textContent=formatNum(totalProd-totalSaida);
  const tbody=document.getElementById('estMovBody'); const empty=document.getElementById('emptyEstoque');
  const entradas=Object.values(state.producao.reduce((acc,p)=>{
    if(!acc[p.data]) acc[p.data]={data:p.data,tipo:'entrada',qtd:0,descricao:'Coleta de ovos'};
    acc[p.data].qtd+=p.ovos; return acc;
  },{}));
  const movs=[...entradas,...state.saidas.map(s=>({...s,tipo:'saida'}))].sort((a,b)=>b.data.localeCompare(a.data));
  if(movs.length===0){ empty.style.display='block'; tbody.innerHTML=''; return; }
  empty.style.display='none';
  tbody.innerHTML=movs.map(m=>`<tr>
    <td class="td-date">${fmtDate(m.data)}</td>
    <td><span class="stat-badge ${m.tipo==='entrada'?'badge-up':'badge-down'}">${m.tipo==='entrada'?'▲ Entrada':'▼ Saída'}</span></td>
    <td class="td-total" style="color:${m.tipo==='entrada'?'var(--green)':'var(--red)'}">${m.tipo==='entrada'?'+':'-'}${formatNum(m.qtd)}</td>
    <td style="font-size:12px;color:var(--muted)">${m.descricao}</td>
  </tr>`).join('');
}

function openEstoqueModal(){ document.getElementById('eSData').value=today(); document.getElementById('eSQtd').value=''; document.getElementById('eSCliente').value=''; document.getElementById('eSValor').value=''; document.getElementById('estModalOverlay').classList.add('open'); }
function closeEstModal(){ document.getElementById('estModalOverlay').classList.remove('open'); }

async function salvarSaida() {
  const data=document.getElementById('eSData').value;
  const qtd=parseInt(document.getElementById('eSQtd').value);
  const cliente=document.getElementById('eSCliente').value.trim()||'Venda';
  const valor=parseFloat(document.getElementById('eSValor').value)||0;
  if(!data||!qtd||qtd<=0){ showToast('error','Preencha os campos corretamente!'); return; }
  const saldo=state.producao.reduce((s,p)=>s+p.ovos,0)-state.saidas.reduce((s,e)=>s+e.qtd,0);
  if(qtd>saldo){ showToast('error',`Saldo insuficiente! Atual: ${formatNum(saldo)}`); return; }
  setBtnLoading('btnSalvarSaida',true,'💾 Salvar');
  try {
    const nova=await DB.insertSaida({data,qtd,descricao:cliente});
    state.saidas.push(nova);
    // Se houver valor de venda, registra como receita em despesas
    if(valor>0){
      const receita=await DB.insertDespesa({data,cat:'Vendas',descricao:`Receita: Venda para ${cliente}`,valor});
      state.despesas.push(receita);
    }
    closeEstModal(); renderEstoque(); showToast('success',`✅ Saída de ${formatNum(qtd)} ovos registrada!`);
  } catch(err){ showToast('error','❌ Erro: '+err.message); }
  finally{ setBtnLoading('btnSalvarSaida',false,'💾 Salvar'); }
}

// =============================================================================
// RENDER RELATÓRIOS
// =============================================================================
let relChart=null;

function renderRelatorios() {
  if(state.producao.length===0){
    ['relMelhorDia','relMelhorData','relMedia','relQuebra'].forEach(id=>document.getElementById(id).textContent='—'); return;
  }
  const grouped={};
  state.producao.forEach(p=>{ if(!grouped[p.data]) grouped[p.data]={ovos:0,quebrados:0}; grouped[p.data].ovos+=p.ovos; grouped[p.data].quebrados+=p.quebrados; });
  const dates=Object.keys(grouped).sort(); const totals=dates.map(d=>grouped[d].ovos);
  const maxTotal=Math.max(...totals); const maxDate=dates[totals.indexOf(maxTotal)];
  const avg=Math.round(totals.reduce((s,v)=>s+v,0)/totals.length);
  const totalOvos=totals.reduce((s,v)=>s+v,0);
  const totalQbr=dates.reduce((s,d)=>s+grouped[d].quebrados,0);
  const quebraPct=totalOvos>0?((totalQbr/totalOvos)*100).toFixed(2):'0.00';
  document.getElementById('relMelhorDia').textContent=formatNum(maxTotal);
  document.getElementById('relMelhorData').textContent=fmtDate(maxDate);
  document.getElementById('relMedia').textContent=formatNum(avg);
  document.getElementById('relQuebra').textContent=quebraPct+'%';
  if(relChart) relChart.destroy();
  const ctx=document.getElementById('relChart').getContext('2d');
  const grad=ctx.createLinearGradient(0,0,0,220);
  grad.addColorStop(0,'rgba(77,171,247,0.3)'); grad.addColorStop(1,'rgba(77,171,247,0)');
  relChart=new Chart(ctx,{
    type:'bar',
    data:{labels:dates.map(d=>fmtDate(d).slice(0,5)),datasets:[{label:'Ovos',data:totals,backgroundColor:'rgba(77,171,247,0.5)',borderColor:'#4dabf7',borderWidth:1.5,borderRadius:4}]},
    options:{responsive:true,maintainAspectRatio:false,plugins:{legend:{display:false}},
      scales:{x:{grid:{color:'#2a3048'},ticks:{color:'#6b7593',font:{size:10},maxTicksLimit:15}},y:{grid:{color:'#2a3048'},ticks:{color:'#6b7593',font:{size:11},callback:v=>formatNum(v)}}}}
  });
}

// =============================================================================
// RENDER / CRUD DESPESAS
// =============================================================================
function renderDespesas() {
  const mes=new Date().toISOString().slice(0,7);
  const despMes=state.despesas.filter(d=>d.data.startsWith(mes));
  const total=despMes.reduce((s,d)=>s+d.valor,0);
  const receitas=despMes.filter(d=>d.descricao.startsWith('Receita:')).reduce((s,d)=>s+d.valor,0);
  document.getElementById('despTotal').textContent='R$ '+total.toLocaleString('pt-BR',{minimumFractionDigits:2});
  document.getElementById('despCustoOvo').textContent='R$ '+receitas.toLocaleString('pt-BR',{minimumFractionDigits:2});
  document.getElementById('despItens').textContent=despMes.length;
  const tbody=document.getElementById('despBody'); const empty=document.getElementById('emptyDesp');
  const sorted=[...state.despesas].sort((a,b)=>b.data.localeCompare(a.data));
  if(sorted.length===0){ empty.style.display='block'; tbody.innerHTML=''; return; }
  empty.style.display='none';
  tbody.innerHTML=sorted.map(d=>{
    const isReceita=d.descricao.startsWith('Receita:');
    const corValor=isReceita?'var(--green)':'var(--red)';
    return `<tr>
      <td class="td-date">${fmtDate(d.data)}</td>
      <td><span class="badge-lotes">${d.cat}</span></td>
      <td style="font-size:13px">${d.descricao}</td>
      <td class="td-total" style="color:${corValor}">R$ ${d.valor.toLocaleString('pt-BR',{minimumFractionDigits:2})}</td>
    </tr>`;
  }).join('');
}

function openDespesaModal(){ document.getElementById('dData').value=today(); document.getElementById('dDesc').value=''; document.getElementById('dValor').value=''; document.getElementById('despModalOverlay').classList.add('open'); }
function closeDespModal(){ document.getElementById('despModalOverlay').classList.remove('open'); }

async function salvarDespesa() {
  const data=document.getElementById('dData').value;
  const cat=document.getElementById('dCat').value;
  const descricao=document.getElementById('dDesc').value.trim()||cat;
  const valor=parseFloat(document.getElementById('dValor').value);
  if(!data||!valor||valor<=0){ showToast('error','Preencha os campos corretamente!'); return; }
  setBtnLoading('btnSalvarDespesa',true,'💾 Salvar');
  try {
    const nova=await DB.insertDespesa({data,cat,descricao,valor});
    state.despesas.push(nova); closeDespModal(); renderDespesas(); showToast('success',`✅ Despesa de R$ ${valor.toFixed(2)} registrada!`);
  } catch(err){ showToast('error','❌ Erro: '+err.message); }
  finally{ setBtnLoading('btnSalvarDespesa',false,'💾 Salvar'); }
}

// =============================================================================
// CSV EXPORT
// =============================================================================
function exportCSV() {
  const grouped={};
  state.producao.forEach(p=>{ if(!grouped[p.data]) grouped[p.data]={ovos:0,quebrados:0,lotes:new Set()}; grouped[p.data].ovos+=p.ovos; grouped[p.data].quebrados+=p.quebrados; grouped[p.data].lotes.add(p.lote); });
  const header='Data,Total de Ovos,Quebrados,Lotes\n';
  const rows=Object.keys(grouped).sort().reverse().map(d=>{ const g=grouped[d]; return `${fmtDate(d)},${g.ovos},${g.quebrados},${g.lotes.size}`; }).join('\n');
  const blob=new Blob([header+rows],{type:'text/csv;charset=utf-8;'});
  const url=URL.createObjectURL(blob); const a=document.createElement('a');
  a.href=url; a.download='producao_ovos.csv'; a.click();
  showToast('success','⬇ CSV exportado!');
}

// =============================================================================
// UI HELPERS
// =============================================================================
function showToast(type,msg) {
  const t=document.getElementById('toast');
  t.textContent=msg; t.className='toast '+type; t.classList.add('show');
  setTimeout(()=>t.classList.remove('show'),3500);
}
function setBtnLoading(id,loading,label) {
  const btn=document.getElementById(id); if(!btn) return;
  btn.disabled=loading; btn.textContent=loading?'⏳ Salvando...':(label||'Salvar');
}

['modalOverlay','loteModalOverlay','estModalOverlay','despModalOverlay'].forEach(id=>{
  document.getElementById(id).addEventListener('click',function(e){ if(e.target===this) this.classList.remove('open'); });
});


// Funções globais — acessíveis diretamente pelo HTML (script normal, sem module)

// =============================================================================
// INICIALIZAÇÃO
// =============================================================================
loadAllData();
