import express from 'express'
import http from 'http'
import { Server } from 'socket.io'

import createGame from './server/game.js'
import setupSocket from './server/socket.js'

const app = express()
const server = http.createServer(app)
const io = new Server(server, {
    cors: { origin: "*" }
})

app.use(express.static('public'))

// Estado do jogo no servidor
const game = createGame()

setInterval(() => {

  const match = game.state.match

  // 🔥 FASE 1 — 1 minuto de jogo normal
  if (match.phase === "playing") {
    match.timeLeft--

    // envia tempo para todos os clientes
    io.emit("match-timer", match.timeLeft)

    if (match.timeLeft <= 0) {
      match.phase = "countdown"
      match.timeLeft = 10

      // manda ranking final da partida
      const finalRanking = Object.values(game.state.players)
        .sort((a, b) => b.score - a.score)
        .map(p => ({
          nickname: p.nickname,
          score: p.score
        }))

      io.emit("match-ended", finalRanking)
    }
  }

  // 🔥 FASE 2 — countdown de 10 segundos
  else if (match.phase === "countdown") {
    match.timeLeft--

    io.emit("match-countdown", match.timeLeft)

    if (match.timeLeft <= 0) {
      // reset total
      game.resetMatch()

      io.emit("match-restart", {
        message: "Nova partida começou!"
      })
    }
  }

}, 1000)


game.setScoreChangeHandler((playerId, newScore) => {
  console.log(`🔥 Score atualizado: ${playerId} -> ${newScore}`)

  // monta ranking atualizado
  const ranking = Object.values(game.state.players)
    .sort((a, b) => b.score - a.score)
    .map(p => ({
      nickname: p.nickname,
      score: p.score
    }))

  // envia ranking para todos os clientes
  io.emit("ranking-update", ranking)
})


// Spawna frutas automaticamente a cada 2s
setInterval(() => {
  game.addFruit()
}, 5000)


// Configura eventos do socket
setupSocket(io, game)

server.listen(3000, () => {
    console.log("> Server listening on port 3000")
})
