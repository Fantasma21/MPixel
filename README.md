🟩 MPixel — Multiplayer Pixel Game

Um jogo online multiplayer simples, rápido e divertido, onde vários jogadores coletam frutas, disputam pontuação em um ranking e participam de partidas de 1 minuto!

🚀 Visão Geral

MPixel é um jogo multiplayer em tempo real criado com:

Node.js + Express

Socket.IO (comunicação em tempo real)

Canvas 2D (renderização do jogo no navegador)

Os jogadores:

✔ escolhem um nickname
✔ entram no mapa
✔ movem-se em grid
✔ coletam frutas (máx. 10)
✔ ganham pontos
✔ competem em partidas de 1 minuto
✔ veem o ranking ao vivo
✔ aguardam uma contagem automática para a próxima partida

🕹 Funcionalidades
🧍 Multiplayer em tempo real

Cada jogador se movimenta no mapa e todos veem os outros jogadores instantaneamente.

🍏 Sistema de frutas

Spawn automático até o limite de 10

Posições aleatórias

Pontuação ao coletar

⭐ Ranking ao vivo

Exibido no canto superior-direito da tela, atualizado em tempo real.

⏱ Ciclo de partidas

1 minuto de disputa

Contagem regressiva de 10 segundos

Reinício automático

Pontuação zerada no início de cada rodada

🖥 Renderização suave

Interpolação para players

Grid estilo retrô

Nomes renderizados acima dos jogadores

MPixel/
│
├── public/               # Código do cliente
│   ├── index.html
│   ├── render.js
│   ├── game.js
│   ├── mult.js
│   ├── keyboard.js
│   └── style.css
│
├── server/               # Lógica do servidor
│   ├── game.js
│   └── socket.js
│
├── server.js             # Inicialização do servidor Express + Socket.IO
├── package.json
└── README.md

🔧 Instalação e Execução
1️⃣ Instalar dependências
npm install

2️⃣ Iniciar o servidor
npm start