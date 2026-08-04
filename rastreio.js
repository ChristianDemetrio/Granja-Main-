// =============================================================================
// rastreio.js — Página pública de rastreabilidade (QR Code da caixa de ovos)
// Não exige login. Lê apenas a view pública "rastreio_publico" no Supabase.
// =============================================================================

// ---- Identidade da granja (edite aqui se mudar de nome/local) ----
const FARM_NAME = 'Granja Ovos da Serra';
const FARM_LOC  = 'São Pedro, SP';

const dbPublic = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

function escapeHtml(str) {
  if (str === null || str === undefined) return '';
  return String(str)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}
function fmtDate(d) { if (!d) return '—'; const [y,m,day]=d.split('-'); return `${day}/${m}/${y}`; }

function getParams() {
  const p = new URLSearchParams(window.location.search);
  return { lote: p.get('lote'), data: p.get('data') };
}

function showError(msg) {
  document.getElementById('rstLoading').style.display = 'none';
  const el = document.getElementById('rstContent');
  el.style.display = 'block';
  el.innerHTML = `<div class="rst-card rst-error">
    <div class="ic">🔍</div>
    <div style="font-weight:700;margin-bottom:6px">Não encontramos essa rastreabilidade</div>
    <div style="font-size:12px;color:var(--muted)">${escapeHtml(msg)}</div>
  </div>`;
}

async function init() {
  document.getElementById('rstFarmName').textContent = FARM_NAME;
  document.getElementById('rstFarmLoc').textContent   = FARM_LOC;

  const { lote, data } = getParams();
  const loteId = parseInt(lote);

  if (!loteId) {
    showError('Link inválido — o QR Code não informa o lote de origem.');
    return;
  }

  try {
    const { data: rows, error } = await dbPublic
      .from('rastreio_publico')
      .select('*')
      .eq('lote_id', loteId);

    if (error) throw error;
    if (!rows || rows.length === 0) {
      showError('Este lote não foi encontrado. O QR Code pode estar desatualizado.');
      return;
    }

    const loteInfo = rows[0];
    let producaoRow = data ? rows.find(r => r.producao_data === data) : null;
    let dataDivergente = !!(data && !producaoRow);
    if (!producaoRow) {
      const comData = rows.filter(r => r.producao_data).sort((a, b) => b.producao_data.localeCompare(a.producao_data));
      producaoRow = comData[0] || null;
    }

    renderTimeline(loteInfo, producaoRow, dataDivergente);
  } catch (err) {
    console.error('Erro ao carregar rastreabilidade:', err);
    showError('Não foi possível carregar os dados agora. Tente novamente em instantes.');
  }
}

function renderTimeline(lote, producao, dataDivergente) {
  document.getElementById('rstLoading').style.display = 'none';
  const el = document.getElementById('rstContent');
  el.style.display = 'block';

  const infoBox = lote.informacoes
    ? `<div class="tl-info-box">ℹ️ ${escapeHtml(lote.informacoes)}</div>`
    : '';

  const avisoData = dataDivergente
    ? `<div class="tl-info-box" style="background:rgba(245,166,35,0.12)">⚠️ Não encontramos a coleta na data informada pelo QR Code — mostrando a coleta mais recente deste lote.</div>`
    : '';

  const coletaBloco = producao && producao.producao_data
    ? `<div class="rst-stats">
        <div class="rst-stat"><span style="color:var(--muted);font-size:11px">Ovos coletados</span><b style="color:var(--accent)">${producao.ovos_coletados ?? 0}</b></div>
        <div class="rst-stat"><span style="color:var(--muted);font-size:11px">Ovos quebrados</span><b style="color:var(--red)">${producao.ovos_quebrados ?? 0}</b></div>
      </div>`
    : `<div class="tl-sub">Nenhuma coleta registrada para este lote ainda.</div>`;

  el.innerHTML = `
    <div class="rst-card">
      <div class="rst-lote-nome">${escapeHtml(lote.lote_nome)}</div>
      <div class="rst-lote-raca">${escapeHtml(lote.raca || 'Raça não informada')}</div>

      <div class="timeline">
        <div class="tl-item">
          <div class="tl-dot">🐣</div>
          <div class="tl-title">Chegada do lote</div>
          <div class="tl-sub">${fmtDate(lote.lote_data_entrada)} — início da criação deste lote na granja</div>
        </div>
        <div class="tl-item">
          <div class="tl-dot">🌾</div>
          <div class="tl-title">Criação livre / caipira</div>
          <div class="tl-sub">Aves criadas soltas, com acesso a pasto e luz natural.</div>
          ${infoBox}
        </div>
        <div class="tl-item">
          <div class="tl-dot">🥚</div>
          <div class="tl-title">Coleta ${producao && producao.producao_data ? '— ' + fmtDate(producao.producao_data) : ''}</div>
          ${avisoData}
          ${coletaBloco}
        </div>
        <div class="tl-item">
          <div class="tl-dot">📦</div>
          <div class="tl-title">Embalagem</div>
          <div class="tl-sub">Ovos selecionados e embalados na própria granja.</div>
        </div>
        <div class="tl-item">
          <div class="tl-dot">🏠</div>
          <div class="tl-title">Na sua mesa</div>
          <div class="tl-sub">Direto do ninho até você, com rastreabilidade completa.</div>
        </div>
      </div>
    </div>
  `;
}

init();
