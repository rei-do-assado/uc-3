let audioCtx;
let masterGain;
let trilhaAtiva = false;
let intervaloTrilha;

function prepararAudio() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    masterGain = audioCtx.createGain();
    masterGain.gain.value = Number(localStorage.getItem("volumeArcade") || 0.18);
    masterGain.connect(audioCtx.destination);
  }
}

function tocarNota(freq, duracao = 0.12, tipo = "square", volume = 0.18) {
  prepararAudio();
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  osc.type = tipo;
  osc.frequency.value = freq;
  gain.gain.setValueAtTime(volume, audioCtx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duracao);
  osc.connect(gain);
  gain.connect(masterGain);
  osc.start();
  osc.stop(audioCtx.currentTime + duracao);
}

function alternarTrilha() {
  prepararAudio();
  if (audioCtx.state === "suspended") audioCtx.resume();
  trilhaAtiva = !trilhaAtiva;
  localStorage.setItem("trilhaArcadeAtiva", String(trilhaAtiva));
  if (trilhaAtiva) iniciarTrilhaArcade();
  else pararTrilhaArcade();
  atualizarAudioUI();
}

function iniciarTrilhaArcade() {
  pararTrilhaArcade();
  trilhaAtiva = true;
  const notas = [196, 247, 294, 330, 294, 247, 220, 247, 196, 247, 330, 392];
  let passo = 0;
  intervaloTrilha = setInterval(() => {
    tocarNota(notas[passo % notas.length], 0.09, passo % 4 === 0 ? "triangle" : "square", 0.08);
    if (passo % 4 === 0) tocarNota(98, 0.14, "sawtooth", 0.045);
    passo += 1;
  }, 170);
}

function pararTrilhaArcade() {
  clearInterval(intervaloTrilha);
  intervaloTrilha = null;
  trilhaAtiva = false;
}

function definirVolume(valor) {
  prepararAudio();
  masterGain.gain.value = Number(valor);
  localStorage.setItem("volumeArcade", String(valor));
}

function tocarSomAcerto() {
  [523, 659, 784].forEach((n, i) => setTimeout(() => tocarNota(n, 0.1, "square", 0.16), i * 80));
}

function tocarSomErro() {
  [180, 120].forEach((n, i) => setTimeout(() => tocarNota(n, 0.16, "sawtooth", 0.12), i * 90));
}

function tocarSomConclusao() {
  [392, 523, 659, 784, 1046].forEach((n, i) => setTimeout(() => tocarNota(n, 0.13, "triangle", 0.18), i * 90));
}

function atualizarAudioUI() {
  document.querySelectorAll("[data-audio-toggle]").forEach((botao) => {
    botao.innerHTML = trilhaAtiva ? "🔇 Desativar trilha" : "🎵 Ativar trilha";
    botao.classList.toggle("btn-warning", !trilhaAtiva);
    botao.classList.toggle("btn-outline-light", trilhaAtiva);
  });
}

document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll("[data-audio-toggle]").forEach((botao) => botao.addEventListener("click", alternarTrilha));
  document.querySelectorAll("[data-volume]").forEach((range) => {
    range.value = localStorage.getItem("volumeArcade") || 0.18;
    range.addEventListener("input", (event) => definirVolume(event.target.value));
  });
  atualizarAudioUI();
});
