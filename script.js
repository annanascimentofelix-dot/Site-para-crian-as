// ==========================================
// 1. LOUSA MÁGICA DE DESENHO (CANVAS)
// ==========================================
const canvas = document.getElementById('paintCanvas');
const ctx = canvas.getContext('2d');

let isDrawing = false;
let currentColor = '#ff4757';
let currentSize = 8;
let isEraser = false;

// Ajustar resolução para telas de alta densidade
function setupCanvas() {
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
}
setupCanvas();

function startDrawing(e) {
    isDrawing = true;
    draw(e);
}

function stopDrawing() {
    isDrawing = false;
    ctx.beginPath();
}

function getPos(e) {
    const rect = canvas.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    return {
        x: clientX - rect.left,
        y: clientY - rect.top
    };
}

function draw(e) {
    if (!isDrawing) return;
    
    const pos = getPos(e);
    ctx.lineWidth = currentSize;
    ctx.strokeStyle = isEraser ? '#ffffff' : currentColor;

    ctx.lineTo(pos.x, pos.y);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(pos.x, pos.y);
}

// Eventos do Mouse
canvas.addEventListener('mousedown', startDrawing);
canvas.addEventListener('mouseup', stopDrawing);
canvas.addEventListener('mousemove', draw);
canvas.addEventListener('mouseleave', stopDrawing);

// Eventos de Toque (Para Tablets e Celulares)
canvas.addEventListener('touchstart', (e) => { e.preventDefault(); startDrawing(e); });
canvas.addEventListener('touchend', stopDrawing);
canvas.addEventListener('touchmove', (e) => { e.preventDefault(); draw(e); });

// Paleta de Cores
document.querySelectorAll('.color-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
        document.querySelectorAll('.color-btn').forEach(b => b.classList.remove('active'));
        e.target.classList.add('active');
        currentColor = e.target.getAttribute('data-color');
        isEraser = false;
        playPopSound();
    });
});

// Cor Personalizada
document.getElementById('customColor').addEventListener('input', (e) => {
    currentColor = e.target.value;
    isEraser = false;
});

// Tamanho do Pincel
document.getElementById('brushSize').addEventListener('input', (e) => {
    currentSize = e.target.value;
});

// Borracha
document.getElementById('eraserBtn').addEventListener('click', () => {
    isEraser = true;
    playPopSound();
});

// Limpar Lousa
document.getElementById('clearBtn').addEventListener('click', () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    playPopSound();
});


// ==========================================
// 2. PIANO MUSICAL (SINTETIZADOR DE ÁUDIO)
// ==========================================
const AudioContext = window.AudioContext || window.webkitAudioContext;
let audioCtx = null;

function playNote(freq) {
    if (!audioCtx) {
        audioCtx = new AudioContext();
    }
    
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, audioCtx.currentTime);

    gain.gain.setValueAtTime(0.3, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.8);

    osc.connect(gain);
    gain.connect(audioCtx.destination);

    osc.start();
    osc.stop(audioCtx.currentTime + 0.8);
}

function playPopSound() {
    if (!audioCtx) audioCtx = new AudioContext();
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(400, audioCtx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(800, audioCtx.currentTime + 0.1);
    
    gain.gain.setValueAtTime(0.2, audioCtx.currentTime);
    gain.gain.linearRampToValueAtTime(0.01, audioCtx.currentTime + 0.1);
    
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    
    osc.start();
    osc.stop(audioCtx.currentTime + 0.1);
}

document.querySelectorAll('.key').forEach(key => {
    key.addEventListener('click', () => {
        const note = parseFloat(key.getAttribute('data-note'));
        playNote(note);
        
        key.classList.add('playing');
        setTimeout(() => key.classList.remove('playing'), 150);
    });
});


// ==========================================
// 3. CANTINHO DAS HISTÓRIAS (MODAL)
// ==========================================
const historiasBase = {
    unicornio: {
        titulo: "🦄 O Unicórnio Curioso",
        texto: "<p>Era uma vez um unicórnio chamado Faísca. Ele vivia em uma floresta mágica cheia de árvores de algodão-doce.</p><br><p>Um dia, Faísca decidiu seguir o fim de um arco-íris para ver o que tinha lá. No final, encontrou uma grande festa com coelhinhos e borboletas dançantes!</p><br><p>Faísca aprendeu que quando somos curiosos e amigáveis, sempre encontramos novos amigos pelo caminho!</p>"
    },
    robo: {
        titulo: "🤖 O Robô Amigo",
        texto: "<p>Bip-Bop era um pequeno robô feito de peças coloridas. Ele morava numa oficina muito organizada.</p><br><p>Bip-Bop adorava ajudar as crianças a resolverem problemas de matemática e a guardarem os brinquedos no lugar certo.</p><br><p>Sua frase favorita era: 'Aprender é a maior aventura do universo!'</p>"
    },
    dragao: {
        titulo: "🐉 O Dragão com Medo do Escuro",
        texto: "<p>Fumaça era um dragãozinho muito simpático, mas ele tinha um pequeno segredo: tinha medo do escuro!</p><br><p>Sua amiga, a Estrelinha Brilhante, ensinou que a noite serve para descansar e sonhar coisas lindas.</p><br><p>Desde aquele dia, Fumaça soltava pequenas faíscas brilhantes para iluminar seu quarto com carinho antes de dormir.</p>"
    }
};

const modal = document.getElementById('storyModal');
const modalTitle = document.getElementById('modalTitle');
const modalBody = document.getElementById('modalBody');
const closeModal = document.querySelector('.close-modal');

function lerHistoria(id) {
    const historia = historiasBase[id];
    if (historia) {
        modalTitle.innerText = historia.titulo;
        modalBody.innerHTML = historia.texto;
        modal.style.display = 'flex';
        playPopSound();
    }
}

closeModal.addEventListener('click', () => {
    modal.style.display = 'none';
});

window.addEventListener('click', (e) => {
    if (e.target === modal) {
        modal.style.display = 'none';
    }
});


// ==========================================
// 4. CHARADAS E PIADAS INFANTIS
// ==========================================
const piadas = [
    {
        pergunta: "O que é, o que é: cai em pé e corre deitado?",
        resposta: "A chuva! 🌧️"
    },
    {
        pergunta: "O que o tomate foi fazer no banco?",
        resposta: "Tirar extrato! 🍅"
    },
    {
        pergunta: "Qual é o cúmulo da lentidão?",
        resposta: "Uma corrida de caracóis na neve! 🐌"
    },
    {
        pergunta: "Por que o livro de matemática ficou triste?",
        resposta: "Porque tinha muitos problemas! 📖"
    },
    {
        pergunta: "O que o zero disse para o oito?",
        resposta: "Que cinto bonito! ⭕"
    }
];

let jokeIndex = 0;
const jokeQuestion = document.getElementById('jokeQuestion');
const jokeAnswer = document.getElementById('jokeAnswer');
const revealBtn = document.getElementById('revealBtn');
const nextJokeBtn = document.getElementById('nextJokeBtn');

revealBtn.addEventListener('click', () => {
    jokeAnswer.classList.add('show');
    playPopSound();
});

nextJokeBtn.addEventListener('click', () => {
    jokeIndex = (jokeIndex + 1) % piadas.length;
    jokeQuestion.innerText = piadas[jokeIndex].pergunta;
    jokeAnswer.innerText = piadas[jokeIndex].resposta;
    jokeAnswer.classList.remove('show');
    playPopSound();
});