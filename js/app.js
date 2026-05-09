const estadoPadrao = {
  jogos: {},
  totalTentativas: 0,
  atualizadoEm: null
};

function obterEstado() {
  return JSON.parse(localStorage.getItem("reiSaborRanking") || JSON.stringify(estadoPadrao));
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

function carregarResumoHome() {
  const el = document.querySelector("[data-home-score]");
  if (!el) return;
  const estado = obterEstado();
  const total = Object.values(estado.jogos).reduce((soma, jogo) => soma + jogo.pontos, 0) + (estado.bonusTodosJogos || 0);
  el.textContent = `${total} pontos acumulados`;
}

function carregarRanking() {
  const area = document.querySelector("[data-ranking]");
  if (!area) return;
  const estado = obterEstado();
  const jogos = [
    ["tipo-armazem", "Tipos de armazém"],
    ["capacidade", "Capacidade"],
    ["pallets", "Pallets e segurança"]
  ];
  const resultados = jogos.map(([slug, nome]) => ({ slug, nome, ...(estado.jogos[slug] || { pontos: 0, acertos: 0, erros: 0, tentativas: 0, percentual: 0, tempoMedio: 0 }) }));
  const total = resultados.reduce((soma, item) => soma + item.pontos, 0) + (estado.bonusTodosJogos || 0);
  const media = resultados.length ? Math.round(resultados.reduce((soma, item) => soma + item.percentual, 0) / resultados.length) : 0;
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
              <thead><tr><th>Jogo</th><th>Pontos</th><th>Acertos</th><th>Tempo médio</th></tr></thead>
              <tbody>${resultados.map((r) => `<tr><td>${r.nome}</td><td>${r.pontos}</td><td>${r.percentual}%</td><td>${r.tempoMedio || 0}s</td></tr>`).join("")}</tbody>
            </table>
          </div>
        </div>
      </div>
    </div>`;
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

document.addEventListener("DOMContentLoaded", () => {
  const prefixo = document.body.dataset.prefix || ".";
  criarNavbar(prefixo);
  document.querySelectorAll("[data-bs-toggle='tooltip']").forEach((el) => new bootstrap.Tooltip(el));
  configurarImagensFallback();
  animarContadores();
  carregarResumoHome();
  carregarRanking();
  document.querySelector("[data-reset-ranking]")?.addEventListener("click", () => {
    localStorage.removeItem("reiSaborRanking");
    location.reload();
  });
  document.querySelector("[data-print]")?.addEventListener("click", () => window.print());
});
