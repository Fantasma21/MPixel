// public/render.js
export default function renderScreen(screen, game, requestAnimationFrame) {
  const ctx = screen.getContext('2d')
  const cell = 30
  const width = game.state.screen.width * cell
  const height = game.state.screen.height * cell
  screen.width = width
  screen.height = height

  // To interpolate, keep a small local map of visual positions
  const visual = {
    players: {}, // id -> { x, y }
    fruits: {}
  }

  function lerp(a,b,t){ return a + (b-a)*t }

  function drawFrame() {
    // smooth interpolate players toward authoritative positions
    for (const id in game.state.players) {
      const p = game.state.players[id]
      if (!visual.players[id]) visual.players[id] = { x: p.x, y: p.y }
      visual.players[id].x = lerp(visual.players[id].x, p.x, 0.25)
      visual.players[id].y = lerp(visual.players[id].y, p.y, 0.25)
    }
    // remove visual players no longer in state
    for (const id in visual.players) {
      if (!game.state.players[id]) delete visual.players[id]
    }

    // fruits: snap (no interpolation needed)
    visual.fruits = { ...game.state.fruits }

    // clear
    ctx.clearRect(0, 0, width, height)
    ctx.fillStyle = '#fff'
    ctx.fillRect(0,0,width,height)

    // draw grid (optional)
    // ctx.strokeStyle = '#eee'
    // for (let i=0;i<=game.state.screen.width;i++){ ctx.beginPath(); ctx.moveTo(i*cell,0); ctx.lineTo(i*cell,height); ctx.stroke() }
    // for (let i=0;i<=game.state.screen.height;i++){ ctx.beginPath(); ctx.moveTo(0,i*cell); ctx.lineTo(width,i*cell); ctx.stroke() }

    // draw fruits
    ctx.fillStyle = 'green'
    for (const fid in visual.fruits) {
      const f = visual.fruits[fid]
      ctx.fillRect(f.x * cell, f.y * cell, cell, cell)
    }

    // draw players
  // Jogadores
ctx.fillStyle = "black"
for (const id in game.state.players) {
    const p = game.state.players[id]
    const size = cell

    // Desenha o quadrado
    ctx.fillRect(p.x * cell, p.y * cell, size, size)

    // Desenha o nome DO LADO DE CIMA
    ctx.fillStyle = "blue"
    ctx.font = "14px Arial"
    ctx.textAlign = "center"
    ctx.fillText(
        p.nickname || "Player",
        p.x * cell + size / 2,
        p.y * cell - 5
    )

    ctx.fillStyle = "black"
}

    requestAnimationFrame(drawFrame)
  }

  drawFrame()
}
