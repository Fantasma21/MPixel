import createGame from "./game.js"
import createKeyboardListener from "./keyboard.js"
import renderScreen from "./render.js"

// Desenhando no jogo
const game = createGame()
const keyboardListener = createKeyboardListener(document)
keyboardListener.subscribe(game.movePlayer)

const screen = document.getElementById('screen')
renderScreen(screen, game, requestAnimationFrame)

// ✅ AGORA FUNCIONANDO - a fruta vai aparecer na posição (3, 0)
game.addPlayer({ playerId: 'player1', playerX: 1, playerY: 0 })
game.addPlayer({ playerId: 'player2', playerX: 5, playerY: 4 })
game.addFruit({ fruitId: 'fruit1', fruitX: 3, fruitY: 0 })
game.addFruit({ fruitId: 'fruit2', fruitX: 7, fruitY: 0 })

