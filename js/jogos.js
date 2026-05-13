const configsJogos = {
  "tipo-armazem": {
    titulo: "Qual armazém eu sou?",
    tema: "Tipos de armazém",
    dados: () => desafiosTipoArmazem,
    proximo: "capacidade-armazenagem.html",
    pergunta: "Por que uma empresa pode escolher terceirizar um armazém mesmo tendo menor controle direto sobre a operação?",
    resumo: "Você praticou a escolha de estruturas de armazenagem conforme produto, fluxo, custo, controle e velocidade."
  },
  capacidade: {
    titulo: "Semáforo da ocupação",
    tema: "Capacidade de armazenagem",
    dados: () => desafiosCapacidade,
    proximo: "pallets-estruturas.html",
    pergunta: "Uma taxa de ocupação alta é sempre sinal de eficiência? Justifique considerando circulação, segurança e produtividade.",
    resumo: "Você avaliou ocupação considerando percentuais, layout, sazonalidade, validade e risco operacional."
  },
  pallets: {
    titulo: "Inspeção de segurança do pallet",
    tema: "Pallets e estruturas",
    dados: () => desafiosPallets,
    proximo: "ranking.html",
    pergunta: "Por que um pallet aparentemente simples pode representar risco para toda a operação de armazenagem?",
    resumo: "Você aplicou critérios de inspeção visual, capacidade, unitização e segurança de estruturas."
  }
};

let estadoJogo;

function iniciarJogo(slug) {
  const config = configsJogos[slug];
  estadoJogo = {
    slug,
    desafios: config.dados(),
    indice: 0,
    pontos: 0,
    acertos: 0,
    erros: 0,
    tentativasQuestao: 0,
    tentativas: 0,
    pausado: false,
    inicioQuestao: Date.now(),
    tempos: [],
    semErro: true,
    finalizado: false
  };
  document.querySelector("[data-start-area]")?.classList.add("d-none");
  document.querySelector("[data-game-area]")?.classList.remove("d-none");
  carregarDesafio();
}

function carregarDesafio() {
  const desafio = estadoJogo.desafios[estadoJogo.indice];
  estadoJogo.tentativasQuestao = 0;
  estadoJogo.inicioQuestao = Date.now();
  const progresso = Math.round((estadoJogo.indice / estadoJogo.desafios.length) * 100);
  document.querySelector("[data-progress]").style.width = `${progresso}%`;
  document.querySelector("[data-progress-label]").textContent = `Missão ${estadoJogo.indice + 1}/10`;
  document.querySelector("[data-score]").textContent = `${estadoJogo.pontos} pts`;
  document.querySelector("[data-level]").textContent = desafio.nivel;
  document.querySelector("[data-title]").textContent = desafio.titulo;
  document.querySelector("[data-situation]").textContent = desafio.situacao;
  document.querySelector("[data-concept]").textContent = desafio.conceitoRelacionado;
  document.querySelector("[data-risk]").textContent = desafio.riscoOperacional;
  const img = document.querySelector("[data-image]");
  if (img) img.src = desafio.imagem;
  montarAreaEspecial(desafio);
  const opcoes = document.querySelector("[data-options]");
  opcoes.innerHTML = desafio.alternativas.map((alt) => `<button class="btn option-btn" data-answer="${alt}">${alt}</button>`).join("");
  opcoes.querySelectorAll("button").forEach((botao) => botao.addEventListener("click", () => verificarResposta(botao.dataset.answer, botao)));
  document.querySelector("[data-feedback]").innerHTML = "";
  document.querySelector("[data-next]").classList.add("d-none");
}

function montarAreaEspecial(desafio) {
  const area = document.querySelector("[data-special]");
  if (!area) return;
  if (estadoJogo.slug === "capacidade") {
    const largura = Math.min(desafio.ocupacao, 120) / 1.2;
    area.innerHTML = `
      <div class="occupation-wrap">
        <div class="w-100">
          <div class="d-flex justify-content-between"><strong>Ocupação</strong><strong>${desafio.ocupacao}%</strong></div>
          <div class="occupation-bar occupation-bar-neutral"><span style="width:${largura}%"></span></div>
          <small>Alerta: percentual, giro, layout, sazonalidade e segurança devem ser analisados em conjunto.</small>
        </div>
      </div>`;
  } else if (estadoJogo.slug === "pallets") {
    area.innerHTML = `<div class="checklist">${desafio.checklist.map((item, i) => `<span>${i < 5 ? "✅" : "🔎"} ${item}</span>`).join("")}</div>`;
  } else {
    area.innerHTML = `<div class="concept-chip">🏭 Decisão logística aplicada à operação alimentícia de Guarulhos/SP</div>`;
  }
}

function verificarResposta(resposta, botao) {
  if (estadoJogo.pausado || estadoJogo.finalizado || botao.disabled) return;
  const desafio = estadoJogo.desafios[estadoJogo.indice];
  estadoJogo.tentativasQuestao += 1;
  estadoJogo.tentativas += 1;
  const correta = resposta === desafio.respostaCorreta;
  if (correta) {
    const tempo = Math.round((Date.now() - estadoJogo.inicioQuestao) / 1000);
    estadoJogo.tempos.push(tempo);
    estadoJogo.acertos += 1;
    estadoJogo.pontos += calcularPontuacao(estadoJogo.tentativasQuestao, tempo);
    botao.classList.add("correct");
    tocarSomAcerto();
    exibirFeedback(true, desafio, tempo);
    document.querySelectorAll("[data-options] button").forEach((b) => (b.disabled = true));
    document.querySelector("[data-next]").classList.remove("d-none");
  } else {
    estadoJogo.semErro = false;
    estadoJogo.erros += 1;
    botao.classList.add("wrong", "shake");
    botao.disabled = true;
    tocarSomErro();
    if (estadoJogo.tentativasQuestao >= 3) {
      document.querySelectorAll("[data-options] button").forEach((b) => {
        if (b.dataset.answer === desafio.respostaCorreta) b.classList.add("correct");
      });
      exibirFeedback(false, desafio);
      document.querySelectorAll("[data-options] button").forEach((b) => (b.disabled = true));
      document.querySelector("[data-next]").classList.remove("d-none");
    } else {
      exibirFeedback(false, desafio, null, `Tentativa ${estadoJogo.tentativasQuestao}/3. Você ainda pode tentar novamente.`);
    }
  }
  document.querySelector("[data-score]").textContent = `${estadoJogo.pontos} pts`;
}

function calcularPontuacao(tentativas, tempo) {
  const base = tentativas === 1 ? 100 : tentativas === 2 ? 60 : 30;
  return base + (tempo <= 15 ? 20 : 0);
}

function exibirFeedback(correta, desafio, tempo = null, aviso = "") {
  const classe = correta ? "feedback-ok glow" : "feedback-warn";
  const selo = correta ? "✅ Acerto técnico" : "⚠️ Revisão necessária";
  const texto = correta ? desafio.feedbackCorreto : desafio.feedbackIncorreto;
  document.querySelector("[data-feedback]").innerHTML = `
    <div class="feedback ${classe}">
      <strong>${selo}</strong>
      <p>${texto}</p>
      ${aviso ? `<p class="mb-1"><strong>${aviso}</strong></p>` : ""}
      ${tempo !== null ? `<p class="mb-1">Tempo de resposta: ${tempo}s ${tempo <= 15 ? "+20 pontos de agilidade" : ""}</p>` : ""}
      <p class="mb-1"><strong>Explicação técnica:</strong> ${desafio.explicacaoTecnica}</p>
      <p class="mb-0"><strong>Dica do professor:</strong> ${desafio.dicaProfessor}</p>
      ${desafio.recomendacao ? `<p class="mt-2 mb-0"><strong>Recomendação:</strong> ${desafio.recomendacao}</p>` : ""}
    </div>`;
}

function atualizarBarraProgresso() {
  const progresso = Math.round(((estadoJogo.indice + 1) / estadoJogo.desafios.length) * 100);
  document.querySelector("[data-progress]").style.width = `${progresso}%`;
}

function avancarDesafio() {
  estadoJogo.indice += 1;
  atualizarBarraProgresso();
  if (estadoJogo.indice >= estadoJogo.desafios.length) finalizarJogo();
  else carregarDesafio();
}

function pausarJogo() {
  estadoJogo.pausado = !estadoJogo.pausado;
  document.querySelector("[data-pause]").textContent = estadoJogo.pausado ? "Continuar" : "Pausar";
  document.querySelector("[data-pause-badge]").classList.toggle("d-none", !estadoJogo.pausado);
}

function reiniciarJogo() {
  if (window.exigirNomeJogador) window.exigirNomeJogador(() => iniciarJogo(document.body.dataset.game));
  else iniciarJogo(document.body.dataset.game);
}

function finalizarJogo() {
  estadoJogo.finalizado = true;
  let bonus = 0;
  if (estadoJogo.semErro) bonus += 150;
  const percentual = Math.round((estadoJogo.acertos / estadoJogo.desafios.length) * 100);
  if (percentual >= 80) bonus += 80;
  estadoJogo.pontos += bonus;
  const tempoMedio = estadoJogo.tempos.length ? Math.round(estadoJogo.tempos.reduce((a, b) => a + b, 0) / estadoJogo.tempos.length) : 0;
  const classificacao = calcularClassificacaoPercentual(percentual);
  salvarPontuacao(estadoJogo.slug, {
    concluido: true,
    pontos: estadoJogo.pontos,
    acertos: estadoJogo.acertos,
    erros: estadoJogo.erros,
    tentativas: estadoJogo.tentativas,
    percentual,
    tempoMedio
  });
  tocarSomConclusao();
  confeteSimples();
  const config = configsJogos[estadoJogo.slug];
  document.querySelector("[data-game-area]").innerHTML = `
    <section class="result-card">
      <div class="achievement">🏆</div>
      <h2>${classificacao.titulo}</h2>
      <p>${classificacao.recomendacao}</p>
      <div class="row g-3 my-3">
        <div class="col-6 col-md-3"><div class="metric-card"><span>Pontos</span><strong>${estadoJogo.pontos}</strong></div></div>
        <div class="col-6 col-md-3"><div class="metric-card"><span>Acertos</span><strong>${percentual}%</strong></div></div>
        <div class="col-6 col-md-3"><div class="metric-card"><span>Erros</span><strong>${estadoJogo.erros}</strong></div></div>
        <div class="col-6 col-md-3"><div class="metric-card"><span>Bônus</span><strong>${bonus}</strong></div></div>
      </div>
      <div class="panel text-start">
        <h3>Resumo de aprendizagem</h3>
        <p>${config.resumo}</p>
        <p><strong>Pergunta reflexiva:</strong> ${config.pergunta}</p>
      </div>
      <div class="d-flex flex-wrap gap-2 justify-content-center mt-4">
        <button class="btn btn-warning btn-lg" onclick="reiniciarJogo()">Jogar novamente</button>
        <a class="btn btn-dark btn-lg" href="${config.proximo}">Próxima missão</a>
      </div>
    </section>`;
}

function confeteSimples() {
  const area = document.createElement("div");
  area.className = "confetti";
  area.innerHTML = Array.from({ length: 40 }, (_, i) => `<span style="left:${Math.random() * 100}%;animation-delay:${Math.random()}s;background:${["#c62828", "#ff7a18", "#f5b32f", "#fff"][i % 4]}"></span>`).join("");
  document.body.appendChild(area);
  setTimeout(() => area.remove(), 2500);
}

document.addEventListener("DOMContentLoaded", () => {
  const slug = document.body.dataset.game;
  if (!slug) return;
  document.querySelector("[data-start]")?.addEventListener("click", () => {
    if (window.exigirNomeJogador) window.exigirNomeJogador(() => iniciarJogo(slug));
    else iniciarJogo(slug);
  });
  document.querySelector("[data-next]")?.addEventListener("click", avancarDesafio);
  document.querySelector("[data-pause]")?.addEventListener("click", pausarJogo);
  document.querySelector("[data-restart]")?.addEventListener("click", reiniciarJogo);
});
