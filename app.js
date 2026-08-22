// ======================================================
// CONFIGURAÇÃO — troque pela URL do seu webhook do n8n
// quando o backend estiver pronto (ex: Google Sheets + IA)
// ======================================================
const API_URL = "https://SEU-N8N-AQUI.exemplo.com/webhook/assistente-saude";

// Registro do Service Worker (deixa o app instalável e funcionando offline)
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("sw.js").catch((err) => {
      console.warn("Falha ao registrar service worker:", err);
    });
  });
}

const chatLog = document.getElementById("chatLog");
const chatInput = document.getElementById("chatInput");
const sendBtn = document.getElementById("sendBtn");
const micBtn = document.getElementById("micBtn");
const fab = document.getElementById("fabAssistant");
const sheet = document.getElementById("assistantSheet");
const closeBtn = document.getElementById("closeAssistant");

function openAssistant() {
  sheet.classList.add("open");
}
function closeAssistant() {
  sheet.classList.remove("open");
}

fab.addEventListener("click", openAssistant);
closeBtn.addEventListener("click", closeAssistant);

// Mensagens pré-definidas de cada card do menu — cada uma já entra
// no chat como se o usuário tivesse pedido, agilizando o fluxo
const flowMessages = {
  agendar: "Quero marcar ou confirmar uma consulta.",
  exame: "Quero ver o resultado de um exame.",
  transporte: "Preciso de transporte (ônibus/van/ambulância programada) para um tratamento.",
  enderecos: "Quero saber o endereço e telefone de uma UBS, hospital ou farmácia.",
  plantao: "Quero saber qual médico e qual farmácia estão de plantão hoje.",
  ouvidoria: "Quero registrar uma manifestação na Ouvidoria.",
  protocolo: "Quero acompanhar um protocolo que já abri.",
  avaliar: "Quero avaliar um atendimento que recebi.",
  emergencia: "EMERGENCIA",
};

document.querySelectorAll(".card[data-flow]").forEach((card) => {
  card.addEventListener("click", () => {
    const flow = card.getAttribute("data-flow");
    if (flow === "emergencia") {
      showEmergencyAlert();
      return;
    }
    openAssistant();
    sendMessage(flowMessages[flow]);
  });
});

function showEmergencyAlert() {
  const ok = confirm(
    "Isto parece uma emergência.\n\nLigue AGORA para o SAMU: 192\n\nDeseja abrir o discador com o número 192?"
  );
  if (ok) {
    window.location.href = "tel:192";
  }
}

function addMessage(text, from = "bot") {
  const div = document.createElement("div");
  div.className = "msg " + from;
  div.textContent = text;
  chatLog.appendChild(div);
  chatLog.scrollTop = chatLog.scrollHeight;
}

// Camada simples de detecção de emergência no texto do usuário —
// mesma lógica do prompt de IA, aplicada também no front-end
const EMERGENCY_WORDS = [
  "socorro", "não consigo respirar", "sangrando muito", "desmaiou",
  "infarto", "avc", "acidente grave", "vou me matar", "tentativa de suicídio"
];

function containsEmergencySignal(text) {
  const normalized = text.toLowerCase();
  return EMERGENCY_WORDS.some((w) => normalized.includes(w));
}

async function sendMessage(text) {
  if (!text || !text.trim()) return;
  addMessage(text, "user");
  chatInput.value = "";

  if (containsEmergencySignal(text)) {
    addMessage(
      "Isso parece uma emergência. Ligue agora para o SAMU 192 ou vá ao pronto-socorro mais próximo. Não espere pelo atendimento por aqui.",
      "bot"
    );
    return;
  }

  addMessage("Um instante, estou verificando...", "bot");

  try {
    // Troque este bloco pela chamada real ao seu backend (n8n) quando estiver pronto.
    // const response = await fetch(API_URL, {
    //   method: "POST",
    //   headers: { "Content-Type": "application/json" },
    //   body: JSON.stringify({ message: text })
    // });
    // const data = await response.json();
    // addMessage(data.reply, "bot");

    // Resposta simulada por enquanto (protótipo sem backend ligado ainda):
    setTimeout(() => {
      addMessage(
        "[Protótipo] Aqui a IA vai responder com base no prompt que já montamos. Assim que o webhook do n8n estiver pronto, troque a URL em app.js (API_URL) para conectar de verdade.",
        "bot"
      );
    }, 700);
  } catch (err) {
    addMessage("Não consegui me conectar agora. Por favor, tente novamente em instantes.", "bot");
  }
}

sendBtn.addEventListener("click", () => sendMessage(chatInput.value));
chatInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") sendMessage(chatInput.value);
});

// ======================================================
// Captura de voz — usa a Web Speech API nativa do navegador
// (gratuita, funciona bem no Chrome/Android). Para produção
// com mais controle e privacidade, trocar depois por
// Whisper self-hosted, como conversamos.
// ======================================================
let recognizing = false;
let recognition = null;

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

if (SpeechRecognition) {
  recognition = new SpeechRecognition();
  recognition.lang = "pt-BR";
  recognition.continuous = false;
  recognition.interimResults = false;

  recognition.onresult = (event) => {
    const transcript = event.results[0][0].transcript;
    sendMessage(transcript);
  };

  recognition.onend = () => {
    recognizing = false;
    micBtn.classList.remove("recording");
  };

  micBtn.addEventListener("click", () => {
    if (recognizing) {
      recognition.stop();
      return;
    }
    recognizing = true;
    micBtn.classList.add("recording");
    recognition.start();
  });
} else {
  micBtn.addEventListener("click", () => {
    alert("Este navegador não suporta entrada por voz. Use o teclado, por favor.");
  });
}
