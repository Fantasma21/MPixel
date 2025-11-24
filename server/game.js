// server/game.js
export default function createGame() {
    const state = {
        players: {},   // players[playerId] = { x, y, lastSeq }
        fruits: {},    // fruits[fruitId] = { x, y }
        screen: { width: 20, height: 15 },
        match: {
            timeLeft: 60,     // 1 minuto
            phase: "playing"  // "playing" | "countdown"
        }

    }

    let onScoreChange = null

    function setScoreChangeHandler(fn) {
        onScoreChange = fn
    }


    // helpers
    const randPos = () => ({
        x: Math.floor(Math.random() * state.screen.width),
        y: Math.floor(Math.random() * state.screen.height)
    })

    function addPlayer(playerId, nickname) {
        state.players[playerId] = {
            x: Math.floor(Math.random() * state.screen.width),
            y: Math.floor(Math.random() * state.screen.height),
            nickname: nickname ?? "Player",
            score: 0,         // ⭐ novo campo
            lastSeq: 0
        }
    }



    function removePlayer(playerId) {
        delete state.players[playerId]
    }

    function movePlayer(playerId, direction, clientSeq) {
    const moves = {
        up(p)    { if (p.y > 0) p.y-- },
        down(p)  { if (p.y < state.screen.height - 1) p.y++ },
        left(p)  { if (p.x > 0) p.x-- },
        right(p) { if (p.x < state.screen.width - 1) p.x++ }
    }

    const player = state.players[playerId]
    if (!player) return

    if (typeof clientSeq === "number" && clientSeq <= (player.lastSeq || 0)) return

    const fn = moves[direction]
    if (fn) {
        fn(player)
        player.lastSeq = clientSeq || (player.lastSeq + 1)
        checkCollision(playerId)
    }
}


    function addFruit(fruitId, x, y) {
        // limite máximo de frutas
        const MAX_FRUITS = 10

        // impede criar mais do que o limite
        if (Object.keys(state.fruits).length >= MAX_FRUITS) {
            return null // não cria fruta
        }

        // criação normal
        if (!fruitId) {
            fruitId = `fruit_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`
        }

        if (typeof x === 'number' && typeof y === 'number') {
            state.fruits[fruitId] = { x, y }
        } else {
            state.fruits[fruitId] = randPos()
        }

        return fruitId
    }


    function removeFruit(fruitId) {
        delete state.fruits[fruitId]
    }

    function checkCollision(playerId) {
        const player = state.players[playerId]
        if (!player) return

        for (const fruitId in state.fruits) {
            const fruit = state.fruits[fruitId]

            if (player.x === fruit.x && player.y === fruit.y) {

                // 🔥 remove a fruta
                removeFruit(fruitId)

                // ⭐ adiciona 1 ponto
                player.score += 1

                // 🔔 IMPORTANTE: notifica o servidor que o score mudou
                if (onScoreChange) {
                    onScoreChange(playerId, player.score)
                }
            }
        }
    }

    function resetMatch() {
  // zera frutas
  state.fruits = {}

  // zera score e reposiciona jogadores
  for (const id in state.players) {
    state.players[id].score = 0
    state.players[id].x = Math.floor(Math.random() * state.screen.width)
    state.players[id].y = Math.floor(Math.random() * state.screen.height)
  }

  // reinicia estado da partida
  state.match.timeLeft = 60
  state.match.phase = "playing"
}



    return {
        state,
        addPlayer,
        removePlayer,
        movePlayer,
        addFruit,
        removeFruit,
        setScoreChangeHandler,   // ⭐ ADICIONADO
        resetMatch
    }

}
