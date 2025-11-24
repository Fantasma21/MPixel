import createGame from './game.js'
import createKeyboardListener from './keyboard.js'
import renderScreen from './render.js'

const socket = io()

const screen = document.getElementById("screen")
const loginScreen = document.getElementById("login-screen")
const btnLogin = document.getElementById("btn-login")
const nicknameInput = document.getElementById("nickname")

const game = createGame()

btnLogin.addEventListener("click", () => {
    const name = nicknameInput.value.trim()

    if (name.length < 1) return alert("Digite um nome válido!")

    socket.emit("login", name)

    // Oculta tela de login, mostra o game
    loginScreen.style.display = "none"
    screen.style.display = "block"

    renderScreen(screen, game, requestAnimationFrame)
})

socket.on("setup", (serverState) => {
    game.setState(serverState)
})

socket.on("state", (serverState) => {
    game.setState(serverState)
})

// Teclado → enviar movimento
const keyboard = createKeyboardListener(document)

keyboard.subscribe((cmd) => {
    socket.emit("move", cmd.keyPressed)
})

const rankingBox = document.getElementById("ranking")

socket.on("ranking-update", (ranking) => {
  rankingBox.innerHTML = `
    <h3>🏆 Ranking</h3>
    <ul>
      ${ranking.map(p => `<li><b>${p.nickname}</b>: ${p.score}</li>`).join("")}
    </ul>
  `
})

const timerBox = document.getElementById("timer")

socket.on("match-timer", (timeLeft) => {
  timerBox.innerHTML = `⏱️ Tempo: ${timeLeft}s`
})

socket.on("match-countdown", (timeLeft) => {
  timerBox.innerHTML = `🔄 Reiniciando em: ${timeLeft}s`
})

socket.on("match-ended", (ranking) => {
  // você pode estilizar isso depois
  console.log("Partida terminou! Ranking final:", ranking)
})

socket.on("match-restart", () => {
  timerBox.innerHTML = "🏁 Nova partida!"
  setTimeout(() => {
    timerBox.innerHTML = ""
  }, 2000)
})

function emitMovement(direction) {
    socket.emit("move", direction);
}

btnUp?.addEventListener("touchstart", () => emitMovement("up"));
btnDown?.addEventListener("touchstart", () => emitMovement("down"));
btnLeft?.addEventListener("touchstart", () => emitMovement("left"));
btnRight?.addEventListener("touchstart", () => emitMovement("right"));


btnUp?.addEventListener("click", () => emitMovement("ArrowUp"))
btnDown?.addEventListener("click", () => emitMovement("ArrowDown"))
btnLeft?.addEventListener("click", () => emitMovement("ArrowLeft"))
btnRight?.addEventListener("click", () => emitMovement("ArrowRight"))

