let audioCtx;
let masterGain;
let trilhaAtiva = localStorage.getItem("trilhaArcadeAtiva") === "true";
let trilhaPendente = false;
let intervaloTrilhaFallback;
let toneApi;
let midiApi;
let midiPreparado = false;
let synthMidi;
let audioLiberado = false;

const VOLUME_MAXIMO = 90;
const VOLUME_PADRAO = 90;
const TONE_URL = "https://cdn.jsdelivr.net/npm/tone@14.8.49/+esm";
const MIDI_URL = "https://cdn.jsdelivr.net/npm/@tonejs/midi@2.0.28/+esm";

function obterVolumeSalvo() {
  if (localStorage.getItem("volumeArcadeEscala") !== String(VOLUME_MAXIMO)) {
    localStorage.setItem("volumeArcade", String(VOLUME_PADRAO));
    localStorage.setItem("volumeArcadeEscala", String(VOLUME_MAXIMO));
    return VOLUME_PADRAO;
  }
  const salvo = Number(localStorage.getItem("volumeArcade") || VOLUME_PADRAO);
  if (!Number.isFinite(salvo)) return VOLUME_PADRAO;
  return Math.min(VOLUME_MAXIMO, Math.max(0, salvo));
}

function obterVolumeNormalizado() {
  return obterVolumeSalvo() / VOLUME_MAXIMO;
}

function obterVolumeDb() {
  const normalizado = Math.max(0.001, obterVolumeNormalizado());
  return 20 * Math.log10(normalizado);
}

function obterCaminhoTrilha() {
  const prefixo = document.body.dataset.prefix || ".";
  return `${prefixo}/assets/audio/trilha-arcade.mid`;
}

function prepararAudio() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    masterGain = audioCtx.createGain();
    masterGain.gain.value = obterVolumeNormalizado();
    masterGain.connect(audioCtx.destination);
  }
}

function tocarNota(freq, duracao = 0.12, tipo = "square", volume = 0.18) {
  prepararAudio();
  if (audioCtx.state === "suspended") audioCtx.resume();
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

async function carregarDependenciasMidi() {
  if (!toneApi || !midiApi) {
    [toneApi, midiApi] = await Promise.all([import(TONE_URL), import(MIDI_URL)]);
  }
  return { Tone: toneApi, Midi: midiApi.Midi };
}

async function prepararTrilhaMidi() {
  if (midiPreparado) return toneApi;

  const { Tone, Midi } = await carregarDependenciasMidi();
  const resposta = await fetch(obterCaminhoTrilha(), { cache: "force-cache" });
  if (!resposta.ok) throw new Error("Nao foi possivel carregar a trilha MIDI.");

  const midi = new Midi(await resposta.arrayBuffer());
  const notas = midi.tracks.flatMap((track) => track.notes);
  const duracao = Math.max(midi.duration || 0, ...notas.map((nota) => nota.time + nota.duration), 1);

  synthMidi = new Tone.PolySynth(Tone.Synth, {
    oscillator: { type: "square" },
    envelope: { attack: 0.005, decay: 0.08, sustain: 0.25, release: 0.08 }
  }).toDestination();
  synthMidi.volume.value = obterVolumeDb();

  Tone.Transport.cancel();
  Tone.Transport.loop = true;
  Tone.Transport.loopStart = 0;
  Tone.Transport.loopEnd = duracao;
  notas.forEach((nota) => {
    Tone.Transport.schedule((time) => {
      if (!trilhaAtiva) return;
      synthMidi.triggerAttackRelease(nota.name, Math.max(nota.duration, 0.04), time, nota.velocity);
    }, nota.time);
  });

  midiPreparado = true;
  return Tone;
}

function iniciarTrilhaFallback() {
  pararTrilhaFallback();
  const notas = [196, 247, 294, 330, 294, 247, 220, 247, 196, 247, 330, 392];
  let passo = 0;
  intervaloTrilhaFallback = setInterval(() => {
    if (!trilhaAtiva) return;
    tocarNota(notas[passo % notas.length], 0.09, passo % 4 === 0 ? "triangle" : "square", 0.08);
    if (passo % 4 === 0) tocarNota(98, 0.14, "sawtooth", 0.045);
    passo += 1;
  }, 170);
}

function pararTrilhaFallback() {
  clearInterval(intervaloTrilhaFallback);
  intervaloTrilhaFallback = null;
}

async function iniciarTrilhaArcade({ salvar = true } = {}) {
  if (!window.obterJogadorAtual?.()) {
    trilhaAtiva = false;
    trilhaPendente = false;
    localStorage.setItem("trilhaArcadeAtiva", "false");
    atualizarAudioUI();
    return;
  }

  trilhaAtiva = true;
  trilhaPendente = false;
  if (salvar) localStorage.setItem("trilhaArcadeAtiva", "true");
  atualizarAudioUI();

  try {
    const Tone = await prepararTrilhaMidi();
    if (!trilhaAtiva) return;
    if (!audioLiberado) {
      trilhaPendente = true;
      atualizarAudioUI();
      return;
    }

    await Tone.start();

    if (Tone.context.state !== "running") {
      trilhaPendente = true;
      atualizarAudioUI();
      return;
    }

    pararTrilhaFallback();
    Tone.Transport.stop();
    Tone.Transport.position = 0;
    Tone.Transport.start("+0.03");
  } catch (erro) {
    console.warn("Nao foi possivel tocar o MIDI; usando fallback sintetizado.", erro);
    if (trilhaAtiva && !audioLiberado) {
      trilhaPendente = true;
      return;
    }
    if (trilhaAtiva) iniciarTrilhaFallback();
  } finally {
    atualizarAudioUI();
  }
}

function pararTrilhaArcade() {
  trilhaAtiva = false;
  trilhaPendente = false;
  localStorage.setItem("trilhaArcadeAtiva", "false");
  pararTrilhaFallback();
  if (toneApi?.Transport) {
    toneApi.Transport.stop();
    toneApi.Transport.position = 0;
  }
  atualizarAudioUI();
}

async function alternarTrilha() {
  if (trilhaAtiva && !trilhaPendente) {
    audioLiberado = true;
    pararTrilhaArcade();
    return;
  }

  if (window.exigirNomeJogador) await window.exigirNomeJogador();
  audioLiberado = true;
  iniciarTrilhaArcade();
}

function definirVolume(valor) {
  const numerico = Number(valor);
  const volume = Number.isFinite(numerico) ? Math.min(VOLUME_MAXIMO, Math.max(0, numerico)) : VOLUME_PADRAO;
  localStorage.setItem("volumeArcade", String(volume));
  localStorage.setItem("volumeArcadeEscala", String(VOLUME_MAXIMO));
  if (masterGain) masterGain.gain.value = volume / VOLUME_MAXIMO;
  if (synthMidi) synthMidi.volume.value = obterVolumeDb();
  atualizarAudioUI();
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
  const volume = obterVolumeSalvo();
  document.querySelectorAll("[data-audio-toggle]").forEach((botao) => {
    botao.innerHTML = trilhaAtiva && !trilhaPendente ? "🔇 Parar trilha" : "🎵 Tocar trilha";
    botao.setAttribute("aria-pressed", String(trilhaAtiva));
    botao.setAttribute("title", trilhaPendente ? "Clique na página para liberar o áudio do navegador" : "");
  });
  document.querySelectorAll("[data-volume]").forEach((range) => {
    range.value = volume;
  });
  document.querySelectorAll("[data-volume-value]").forEach((el) => {
    el.textContent = `${volume}/${VOLUME_MAXIMO}`;
  });
}

function tentarIniciarTrilhaPendente(event) {
  if (event?.target?.closest?.("[data-audio-toggle]")) return;
  if (!window.obterJogadorAtual?.()) return;
  audioLiberado = true;
  if (trilhaAtiva && trilhaPendente) iniciarTrilhaArcade({ salvar: false });
}

document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll("[data-audio-toggle]").forEach((botao) => botao.addEventListener("click", alternarTrilha));
  document.querySelectorAll("[data-volume]").forEach((range) => {
    range.min = "0";
    range.max = String(VOLUME_MAXIMO);
    range.step = "1";
    range.value = obterVolumeSalvo();
    range.addEventListener("input", (event) => definirVolume(event.target.value));
  });
  document.addEventListener("pointerdown", tentarIniciarTrilhaPendente);
  document.addEventListener("keydown", tentarIniciarTrilhaPendente);
  atualizarAudioUI();
  if (trilhaAtiva && window.obterJogadorAtual?.()) iniciarTrilhaArcade({ salvar: false });
  else if (trilhaAtiva) pararTrilhaArcade();
});
