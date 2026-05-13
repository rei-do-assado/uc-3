const estadoPadrao = {
  jogos: {},
  totalTentativas: 0,
  atualizadoEm: null
};

const jogosRanking = [
  ["tipo-armazem", "Tipos de armazém"],
  ["capacidade", "Capacidade"],
  ["pallets", "Pallets e segurança"]
];

const PLAYER_KEY = "reiSaborJogador";
const CLASS_KEY = "reiSaborTurma";
const SESSION_KEY = "reiSaborSessaoId";

function obterEstado() {
  return JSON.parse(localStorage.getItem("reiSaborRanking") || JSON.stringify(estadoPadrao));
}

function normalizarNomeJogador(nome) {
  return String(nome || "").trim().replace(/\s+/g, " ").slice(0, 40);
}

function obterJogadorAtual() {
  return normalizarNomeJogador(localStorage.getItem(PLAYER_KEY));
}

function obterTurmaAtual() {
  return String(localStorage.getItem(CLASS_KEY) || "").trim().slice(0, 40);
}

function definirJogadorAtual(nome, turma = null) {
  const jogador = normalizarNomeJogador(nome);
  if (jogador.length < 2) return "";
  localStorage.setItem(PLAYER_KEY, jogador);
  if (turma !== null) localStorage.setItem(CLASS_KEY, String(turma || "").trim().slice(0, 40));
  obterSessaoRanking();
  atualizarJogadorUI();
  return jogador;
}

function criarIdSessao() {
  if (window.crypto?.randomUUID) return window.crypto.randomUUID();
  return `sessao-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function obterSessaoRanking() {
  let sessao = localStorage.getItem(SESSION_KEY);
  if (!sessao) {
    sessao = criarIdSessao();
    localStorage.setItem(SESSION_KEY, sessao);
  }
  return sessao;
}

function reiniciarSessaoRanking() {
  localStorage.setItem(SESSION_KEY, criarIdSessao());
}

function salvarEstado(estado) {
  estado.atualizadoEm = new Date().toISOString();
  localStorage.setItem("reiSaborRanking", JSON.stringify(estado));
}

function salvarPontuacao(slug, resultado) {
  const estado = obterEstado();
  estado.jogos[slug] = resultado;
  estado.totalTentativas = Object.values(estado.jogos).reduce((soma, jogo) => soma + jogo.tentativas, 0);
  const concluidos = ["tipo-armazem", "capacidade", "pallets"].every((jogo) => estado.jogos[jogo]?.concluido);
  estado.bonusTodosJogos = concluidos ? 200 : 0;
  salvarEstado(estado);
  publicarPontuacaoAtual({ silencioso: true });
}

function calcularClassificacaoPercentual(percentual) {
  return classificacoesDesempenho.find((item) => percentual >= item.min && percentual <= item.max) || classificacoesDesempenho.at(-1);
}

function calcularClassificacaoFinal(pontos) {
  if (pontos >= 2700) return "Mestre da Armazenagem 🏆";
  if (pontos >= 2200) return "Estrategista Logístico 🚚";
  if (pontos >= 1700) return "Analista de Armazém 📦";
  if (pontos >= 1000) return "Operador em Treinamento 🧰";
  return "Revisar fundamentos 📘";
}

function criarNavbar(prefixo = ".") {
  const nav = document.querySelector("[data-navbar]");
  if (!nav) return;
  nav.innerHTML = `
    <nav class="navbar navbar-expand-lg navbar-dark fixed-top nav-arcade">
      <div class="container">
        <a class="navbar-brand d-flex align-items-center gap-2" href="${prefixo}/index.html">
          <img src="${prefixo}/assets/logo-rei-do-sabor.png" onerror="this.replaceWith(Object.assign(document.createElement('span'),{className:'logo-fallback-mini',textContent:'O Rei do Sabor'}))" alt="Logo O Rei do Sabor">
          <span>Arcade Logístico</span>
        </a>
        <button class="navbar-toggler" type="button" data-bs-toggle="offcanvas" data-bs-target="#menuMobile" aria-label="Abrir menu">
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="offcanvas offcanvas-end text-bg-dark" id="menuMobile">
          <div class="offcanvas-header">
            <h5 class="offcanvas-title">O Rei do Sabor</h5>
            <button type="button" class="btn-close btn-close-white" data-bs-dismiss="offcanvas"></button>
          </div>
          <div class="offcanvas-body">
            <ul class="navbar-nav ms-auto align-items-lg-center gap-lg-2">
              <li class="nav-item"><a class="nav-link" href="${prefixo}/index.html">Início</a></li>
              <li class="nav-item"><a class="nav-link" href="${prefixo}/pages/tipo-armazem.html">Armazém</a></li>
              <li class="nav-item"><a class="nav-link" href="${prefixo}/pages/capacidade-armazenagem.html">Ocupação</a></li>
              <li class="nav-item"><a class="nav-link" href="${prefixo}/pages/pallets-estruturas.html">Pallets</a></li>
              <li class="nav-item"><a class="nav-link" href="${prefixo}/pages/ranking.html">Ranking</a></li>
              <li class="nav-item"><span class="badge text-bg-light text-dark" data-player-name>Jogador não identificado</span></li>
              <li class="nav-item"><button class="btn btn-sm btn-warning" data-audio-toggle>🎵 Ativar trilha</button></li>
            </ul>
          </div>
        </div>
      </div>
    </nav>`;
}

function configurarImagensFallback() {
  document.querySelectorAll("img[data-fallback]").forEach((img) => {
    img.addEventListener("error", () => {
      const fallback = document.createElement("div");
      fallback.className = "image-fallback";
      fallback.innerHTML = `<span>${img.dataset.fallback || "📦"}</span><strong>Imagem logística</strong>`;
      img.replaceWith(fallback);
    });
  });
}

function animarContadores() {
  document.querySelectorAll("[data-count]").forEach((el) => {
    const alvo = Number(el.dataset.count);
    let atual = 0;
    const passo = Math.max(1, Math.ceil(alvo / 40));
    const timer = setInterval(() => {
      atual += passo;
      if (atual >= alvo) {
        atual = alvo;
        clearInterval(timer);
      }
      el.textContent = atual;
    }, 25);
  });
}

function criarModalJogador() {
  if (document.getElementById("modalJogador")) return;
  document.body.insertAdjacentHTML("beforeend", `
    <div class="modal fade player-modal" id="modalJogador" tabindex="-1" aria-labelledby="modalJogadorLabel" aria-hidden="true" data-bs-backdrop="static" data-bs-keyboard="false">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <form data-player-form>
            <div class="modal-header">
              <h2 class="modal-title fs-4" id="modalJogadorLabel">Identificação do jogador</h2>
            </div>
            <div class="modal-body">
              <p>Informe seu nome ou equipe para iniciar o jogo, tocar a trilha e salvar a pontuação no ranking online.</p>
              <label class="form-label" for="nomeJogadorObrigatorio">Nome ou equipe</label>
              <input class="form-control form-control-lg" id="nomeJogadorObrigatorio" maxlength="40" required data-player-required placeholder="Ex.: Equipe A">
              <label class="form-label mt-3" for="turmaJogadorObrigatoria">Turma</label>
              <input class="form-control" id="turmaJogadorObrigatoria" maxlength="40" data-player-class placeholder="Ex.: UC3">
              <div class="invalid-feedback d-block mt-2 d-none" data-player-error>Informe pelo menos 2 caracteres.</div>
            </div>
            <div class="modal-footer">
              <button class="btn btn-warning btn-lg w-100" type="submit">Continuar</button>
            </div>
          </form>
        </div>
      </div>
    </div>`);
}

function solicitarNomeJogador() {
  const atual = obterJogadorAtual();
  if (atual) return Promise.resolve(atual);

  criarModalJogador();
  const modalEl = document.getElementById("modalJogador");
  const form = modalEl.querySelector("[data-player-form]");
  const inputNome = modalEl.querySelector("[data-player-required]");
  const inputTurma = modalEl.querySelector("[data-player-class]");
  const erro = modalEl.querySelector("[data-player-error]");
  const modal = bootstrap.Modal.getOrCreateInstance(modalEl);

  inputNome.value = obterJogadorAtual();
  inputTurma.value = obterTurmaAtual();
  erro.classList.add("d-none");
  modal.show();
  setTimeout(() => inputNome.focus(), 180);

  return new Promise((resolve) => {
    const aoEnviar = (event) => {
      event.preventDefault();
      const jogador = definirJogadorAtual(inputNome.value, inputTurma.value);
      if (!jogador) {
        erro.classList.remove("d-none");
        inputNome.focus();
        return;
      }
      form.removeEventListener("submit", aoEnviar);
      modal.hide();
      resolve(jogador);
    };
    form.addEventListener("submit", aoEnviar);
  });
}

function exigirNomeJogador(callback) {
  return solicitarNomeJogador().then((jogador) => {
    if (typeof callback === "function") callback(jogador);
    return jogador;
  });
}

function atualizarJogadorUI() {
  const jogador = obterJogadorAtual();
  document.querySelectorAll("[data-player-name]").forEach((el) => {
    el.textContent = jogador ? `Jogador: ${jogador}` : "Jogador não identificado";
  });
  document.querySelectorAll("[data-ranking-player]").forEach((input) => {
    if (jogador && !input.value) input.value = jogador;
  });
  document.querySelectorAll("[data-ranking-class]").forEach((input) => {
    const turma = obterTurmaAtual();
    if (turma && !input.value) input.value = turma;
  });
}

function carregarResumoHome() {
  const el = document.querySelector("[data-home-score]");
  if (!el) return;
  const estado = obterEstado();
  const total = Object.values(estado.jogos).reduce((soma, jogo) => soma + jogo.pontos, 0) + (estado.bonusTodosJogos || 0);
  el.textContent = `${total} pontos acumulados`;
}

let clienteSupabaseRanking;

function obterResultadosRanking(estado) {
  return jogosRanking.map(([slug, nome]) => ({ slug, nome, ...(estado.jogos[slug] || { pontos: 0, acertos: 0, erros: 0, tentativas: 0, percentual: 0, tempoMedio: 0 }) }));
}

function obterResumoRanking(estado) {
  const resultados = obterResultadosRanking(estado);
  const total = resultados.reduce((soma, item) => soma + item.pontos, 0) + (estado.bonusTodosJogos || 0);
  const media = resultados.length ? Math.round(resultados.reduce((soma, item) => soma + item.percentual, 0) / resultados.length) : 0;
  const totalErros = resultados.reduce((soma, item) => soma + (item.erros || 0), 0);
  return { resultados, total, media, totalErros };
}

function escaparHtml(valor) {
  return String(valor ?? "").replace(/[&<>"']/g, (char) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;"
  })[char]);
}

function formatarDataRanking(valor) {
  if (!valor) return "-";
  return new Intl.DateTimeFormat("pt-BR", { dateStyle: "short", timeStyle: "short" }).format(new Date(valor));
}

function obterConfigSupabase() {
  return window.REI_SABOR_SUPABASE || {};
}

function supabaseConfigurado() {
  const config = obterConfigSupabase();
  return Boolean(config.url && config.anonKey && !config.url.includes("COLE_") && !config.anonKey.includes("COLE_"));
}

function obterClienteSupabaseRanking() {
  if (!supabaseConfigurado() || !window.supabase?.createClient) return null;
  if (!clienteSupabaseRanking) {
    const config = obterConfigSupabase();
    clienteSupabaseRanking = window.supabase.createClient(config.url, config.anonKey);
  }
  return clienteSupabaseRanking;
}

function obterTabelaRanking() {
  return obterConfigSupabase().tableName || "ranking_rei_sabor";
}

function obterMapaJogos(resultados) {
  return resultados.reduce((mapa, item) => ({ ...mapa, [item.slug]: item }), {});
}

function obterPontosPorJogo(mapaJogos, slug) {
  return Number(mapaJogos[slug]?.pontos || 0);
}

function obterPontosLinhaRanking(item, slug) {
  const coluna = {
    "tipo-armazem": "tipo_armazem_pontos",
    capacidade: "capacidade_pontos",
    pallets: "pallets_pontos"
  }[slug];
  return Number(item[coluna] ?? item.jogos?.[slug]?.pontos ?? 0);
}

function obterLinhasRankingUnicas(data) {
  const vistos = new Set();
  return (data || []).filter((item) => {
    const chave = item.sessao_id || item.id;
    if (vistos.has(chave)) return false;
    vistos.add(chave);
    return true;
  });
}

function criarPainelRankingOnline(total, media, totalErros) {
  const jogador = escaparHtml(obterJogadorAtual());
  const turma = escaparHtml(obterTurmaAtual());
  return `
    <div class="panel mt-4" data-ranking-online>
      <div class="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-3">
        <div>
          <h2>Ranking online</h2>
          <p class="mb-0">A pontuação é salva no Supabase ao final de cada jogo e pode ser sincronizada manualmente aqui.</p>
        </div>
        <span class="badge text-bg-secondary" data-ranking-online-status>Verificando conexão</span>
      </div>
      <form class="row g-2 align-items-end" data-ranking-online-form>
        <div class="col-md-5">
          <label class="form-label" for="jogadorRanking">Jogador ou equipe</label>
          <input class="form-control" id="jogadorRanking" maxlength="40" required data-ranking-player value="${jogador}" placeholder="Ex.: Equipe A">
        </div>
        <div class="col-md-3">
          <label class="form-label" for="turmaRanking">Turma</label>
          <input class="form-control" id="turmaRanking" maxlength="40" data-ranking-class value="${turma}" placeholder="Ex.: UC3">
        </div>
        <div class="col-md-2">
          <div class="small text-muted">Envio atual</div>
          <strong>${total} pts | ${media}% | ${totalErros} erros</strong>
        </div>
        <div class="col-md-2 d-grid">
          <button class="btn btn-warning" type="submit">Sincronizar</button>
        </div>
      </form>
      <div class="mt-3" data-ranking-online-feedback></div>
      <div class="mt-3" data-ranking-online-list></div>
    </div>`;
}

function exibirFeedbackRankingOnline(mensagem, tipo = "info") {
  const el = document.querySelector("[data-ranking-online-feedback]");
  if (!el) return;
  el.innerHTML = mensagem ? `<div class="alert alert-${tipo} mb-0">${mensagem}</div>` : "";
}

async function buscarRankingOnlineCompleto(cliente) {
  const pagina = 1000;
  let inicio = 0;
  const todos = [];

  while (true) {
    const { data, error } = await cliente
      .from(obterTabelaRanking())
      .select("id,sessao_id,jogador,turma,total_pontos,percentual_medio,total_tentativas,total_erros,bonus_todos_jogos,tipo_armazem_pontos,capacidade_pontos,pallets_pontos,jogos,criado_em")
      .order("total_pontos", { ascending: false })
      .order("percentual_medio", { ascending: false })
      .order("criado_em", { ascending: false })
      .range(inicio, inicio + pagina - 1);

    if (error) return { data: null, error };
    todos.push(...(data || []));
    if (!data || data.length < pagina) break;
    inicio += pagina;
  }

  return { data: todos, error: null };
}

async function carregarRankingOnline() {
  const lista = document.querySelector("[data-ranking-online-list]");
  const status = document.querySelector("[data-ranking-online-status]");
  if (!lista || !status) return;

  const cliente = obterClienteSupabaseRanking();
  if (!cliente) {
    status.className = "badge text-bg-warning text-dark";
    status.textContent = "Configuração pendente";
    lista.innerHTML = `<p class="mb-0">Preencha <code>js/supabase-config.js</code> com a URL e a anon key do Supabase para ativar o ranking online.</p>`;
    return;
  }

  status.className = "badge text-bg-success";
  status.textContent = "Online";
  lista.innerHTML = `<p class="mb-0">Carregando ranking online...</p>`;

  const { data, error } = await buscarRankingOnlineCompleto(cliente);

  if (error) {
    status.className = "badge text-bg-danger";
    status.textContent = "Erro";
    lista.innerHTML = `<p class="mb-0 text-danger">Não foi possível carregar o ranking online: ${escaparHtml(error.message)}</p>`;
    return;
  }

  const linhas = obterLinhasRankingUnicas(data);

  if (!linhas.length) {
    lista.innerHTML = `<p class="mb-0">Nenhuma pontuação online salva ainda.</p>`;
    return;
  }

  lista.innerHTML = `
    <div class="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-2">
      <strong>Ranking completo</strong>
      <span class="small text-muted">${linhas.length} jogador(es) listados</span>
    </div>
    <div class="table-responsive">
      <table class="table table-sm align-middle">
        <thead><tr><th>#</th><th>Jogador/equipe</th><th>Turma</th><th>Total</th><th>Armazém</th><th>Capacidade</th><th>Pallets</th><th>Acertos</th><th>Erros</th><th>Tentativas</th><th>Data</th></tr></thead>
        <tbody>${linhas.map((item, index) => `
          <tr>
            <td>${index + 1}</td>
            <td>${escaparHtml(item.jogador)}</td>
            <td>${escaparHtml(item.turma || "-")}</td>
            <td>${item.total_pontos}</td>
            <td>${obterPontosLinhaRanking(item, "tipo-armazem")}</td>
            <td>${obterPontosLinhaRanking(item, "capacidade")}</td>
            <td>${obterPontosLinhaRanking(item, "pallets")}</td>
            <td>${item.percentual_medio}%</td>
            <td>${item.total_erros}</td>
            <td>${item.total_tentativas}</td>
            <td>${formatarDataRanking(item.criado_em)}</td>
          </tr>`).join("")}</tbody>
      </table>
    </div>`;
}

async function publicarPontuacaoAtual({ silencioso = false } = {}) {
  const cliente = obterClienteSupabaseRanking();
  if (!cliente) {
    if (!silencioso) exibirFeedbackRankingOnline("Configure o Supabase antes de salvar o ranking online.", "warning");
    return false;
  }

  const jogador = obterJogadorAtual();
  if (!jogador) {
    if (!silencioso) exibirFeedbackRankingOnline("Informe o nome do jogador antes de publicar a pontuação.", "warning");
    return false;
  }

  const estado = obterEstado();
  const { resultados, total, media, totalErros } = obterResumoRanking(estado);
  if (total <= 0) {
    if (!silencioso) exibirFeedbackRankingOnline("Jogue ao menos uma missão antes de publicar a pontuação.", "warning");
    return false;
  }

  if (!silencioso) exibirFeedbackRankingOnline("Salvando pontuação online...", "info");

  const mapaJogos = obterMapaJogos(resultados);
  const payload = {
    sessao_id: obterSessaoRanking(),
    jogador,
    turma: obterTurmaAtual() || null,
    total_pontos: total,
    percentual_medio: media,
    total_tentativas: estado.totalTentativas || 0,
    total_erros: totalErros,
    bonus_todos_jogos: estado.bonusTodosJogos || 0,
    tipo_armazem_pontos: obterPontosPorJogo(mapaJogos, "tipo-armazem"),
    capacidade_pontos: obterPontosPorJogo(mapaJogos, "capacidade"),
    pallets_pontos: obterPontosPorJogo(mapaJogos, "pallets"),
    jogos: mapaJogos,
    atualizado_em_local: estado.atualizadoEm
  };

  const { error } = await cliente.from(obterTabelaRanking()).insert(payload);

  if (error) {
    if (!silencioso) exibirFeedbackRankingOnline(`Não foi possível salvar no Supabase: ${escaparHtml(error.message)}`, "danger");
    else console.warn("Não foi possível sincronizar o ranking online.", error);
    return false;
  }

  if (!silencioso) {
    exibirFeedbackRankingOnline("Pontuação salva no ranking online.", "success");
    carregarRankingOnline();
  }
  return true;
}

async function salvarRankingOnline(event) {
  event.preventDefault();
  const jogador = definirJogadorAtual(
    document.querySelector("[data-ranking-player]")?.value,
    document.querySelector("[data-ranking-class]")?.value
  );
  if (!jogador) {
    exibirFeedbackRankingOnline("Informe o nome do jogador ou da equipe.", "warning");
    return;
  }

  const botao = event.submitter;
  if (botao) botao.disabled = true;
  await publicarPontuacaoAtual();
  if (botao) botao.disabled = false;
}

function carregarRanking() {
  const area = document.querySelector("[data-ranking]");
  if (!area) return;
  const estado = obterEstado();
  const jogos = jogosRanking;
  const resultados = jogos.map(([slug, nome]) => ({ slug, nome, ...(estado.jogos[slug] || { pontos: 0, acertos: 0, erros: 0, tentativas: 0, percentual: 0, tempoMedio: 0 }) }));
  const total = resultados.reduce((soma, item) => soma + item.pontos, 0) + (estado.bonusTodosJogos || 0);
  const media = resultados.length ? Math.round(resultados.reduce((soma, item) => soma + item.percentual, 0) / resultados.length) : 0;
  const totalErros = resultados.reduce((soma, item) => soma + (item.erros || 0), 0);
  const melhor = [...resultados].sort((a, b) => b.percentual - a.percentual)[0];
  const reforco = [...resultados].sort((a, b) => a.percentual - b.percentual)[0];
  area.innerHTML = `
    <div class="row g-3 mb-4">
      <div class="col-md-3"><div class="metric-card"><span>Pontuação total</span><strong>${total}</strong></div></div>
      <div class="col-md-3"><div class="metric-card"><span>Acertos médios</span><strong>${media}%</strong></div></div>
      <div class="col-md-3"><div class="metric-card"><span>Tentativas</span><strong>${estado.totalTentativas || 0}</strong></div></div>
      <div class="col-md-3"><div class="metric-card"><span>Classificação</span><strong>${calcularClassificacaoFinal(total)}</strong></div></div>
    </div>
    <div class="row g-4">
      <div class="col-lg-7"><div class="panel"><canvas id="graficoRanking" height="220"></canvas></div></div>
      <div class="col-lg-5">
        <div class="panel h-100">
          <h2>Feedback profissional</h2>
          <p>Seu desempenho foi mais forte em <strong>${melhor.nome}</strong>. A categoria que mais precisa de reforço é <strong>${reforco.nome}</strong>.</p>
          <p>Recomenda-se revisar os feedbacks técnicos, relacionando escolha logística, segurança, ocupação e impacto no atendimento ao cliente.</p>
          <div class="table-responsive">
            <table class="table table-sm align-middle">
              <thead><tr><th>Jogo</th><th>Pontos</th><th>Acertos</th><th>Erros</th><th>Tempo médio</th></tr></thead>
              <tbody>${resultados.map((r) => `<tr><td>${r.nome}</td><td>${r.pontos}</td><td>${r.percentual}%</td><td>${r.erros || 0}</td><td>${r.tempoMedio || 0}s</td></tr>`).join("")}</tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
    ${criarPainelRankingOnline(total, media, totalErros)}`;
  new Chart(document.getElementById("graficoRanking"), {
    type: "bar",
    data: {
      labels: resultados.map((r) => r.nome),
      datasets: [
        { label: "Pontuação", data: resultados.map((r) => r.pontos), backgroundColor: ["#c62828", "#ff7a18", "#f5b32f"] },
        { label: "% de acertos", data: resultados.map((r) => r.percentual * 10), backgroundColor: "rgba(62, 39, 35, .28)" }
      ]
    },
    options: { responsive: true, plugins: { legend: { position: "bottom" } }, scales: { y: { beginAtZero: true } } }
  });
}

window.exigirNomeJogador = exigirNomeJogador;
window.obterJogadorAtual = obterJogadorAtual;

document.addEventListener("DOMContentLoaded", () => {
  const prefixo = document.body.dataset.prefix || ".";
  criarNavbar(prefixo);
  atualizarJogadorUI();
  document.querySelectorAll("[data-bs-toggle='tooltip']").forEach((el) => new bootstrap.Tooltip(el));
  configurarImagensFallback();
  animarContadores();
  carregarResumoHome();
  carregarRanking();
  document.querySelector("[data-ranking-online-form]")?.addEventListener("submit", salvarRankingOnline);
  carregarRankingOnline();
  document.querySelector("[data-reset-ranking]")?.addEventListener("click", () => {
    localStorage.removeItem("reiSaborRanking");
    reiniciarSessaoRanking();
    location.reload();
  });
  document.querySelector("[data-print]")?.addEventListener("click", () => window.print());
});
