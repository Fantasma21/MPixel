// public/game.js
export default function createGame() {
  const state = {
    players: {},
    fruits: {},
    screen: { width: 20, height: 17 }
  }

  // For client-side prediction & reconciliation:
  // keep a queue of local moves not acked by server
  const pendingMoves = [] // [{ seq, direction }]

  let nextSeq = 1
  let clientId = null

  function setPlayerId(id) { clientId = id }

  function setState(serverState) {
    // replace authoritative state
    state.players = serverState.players || {}
    state.fruits = serverState.fruits || {}
    state.screen = serverState.screen || state.screen

    // Reconciliation: re-apply pending moves (prediction)
    // Remove acknowledged moves based on lastSeq from server
    if (clientId && state.players[clientId]) {
      const lastAck = state.players[clientId].lastSeq || 0
      // drop moves <= lastAck
      while (pendingMoves.length && pendingMoves[0].seq <= lastAck) {
        pendingMoves.shift()
      }
      // reapply remaining moves locally to predict current pos
      for (const m of pendingMoves) {
        applyLocalMove(state.players[clientId], m.direction)
      }
    }
  }

  function setState(newState) {
    state.players = newState.players
    state.fruits = newState.fruits
    state.screen = newState.screen
}


  function applyLocalMove(player, direction) {
    const moves = {
      ArrowUp(p)    { if (p.y > 0) p.y-- },
      ArrowDown(p)  { if (p.y < state.screen.height - 1) p.y++ },
      ArrowLeft(p)  { if (p.x > 0) p.x-- },
      ArrowRight(p) { if (p.x < state.screen.width - 1) p.x++ }
    }
    const fn = moves[direction]
    if (player && fn) fn(player)
  }

  // --- CONTROLES TOUCH PARA CELULAR ---

let touchStartX = 0
let touchStartY = 0

window.addEventListener("touchstart", (e) => {
    const touch = e.touches[0]
    touchStartX = touch.clientX
    touchStartY = touch.clientY
})

window.addEventListener("touchmove", (e) => {
    e.preventDefault() // impede scroll da página

    const touch = e.touches[0]
    const dx = touch.clientX - touchStartX
    const dy = touch.clientY - touchStartY

    const threshold = 20 // sensibilidade

    if (Math.abs(dx) > Math.abs(dy)) {
        if (dx > threshold) socket.emit("move", "right")
        if (dx < -threshold) socket.emit("move", "left")
    } else {
        if (dy > threshold) socket.emit("move", "down")
        if (dy < -threshold) socket.emit("move", "up")
    }
})


  function createLocalMove(direction) {
    const seq = nextSeq++
    if (!clientId) return null
    // optimistic locally:
    const player = state.players[clientId]
    if (player) {
      applyLocalMove(player, direction)
      pendingMoves.push({ seq, direction })
      return { seq, direction }
    }
    return null
  }

  return {
    state,
    setState,
    createLocalMove,
    setPlayerId
  }
}
