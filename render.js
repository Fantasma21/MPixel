export default function renderScreen(screen, game, requestAnimationFrame) {
    const context = screen.getContext('2d')
    // Limpa a tela
    context.clearRect(0, 0, screen.width, screen.height)

    // Desenha jogadores
    for (const playerId in game.state.players) {
        const player = game.state.players[playerId]
        context.fillStyle = 'black'
        context.fillRect(player.x, player.y, 1, 1)
    }

    // Desenha frutas
    for (const fruitId in game.state.fruits) {
        const fruit = game.state.fruits[fruitId]
        context.fillStyle = 'green'
        context.fillRect(fruit.x, fruit.y, 1, 1)
    }

    requestAnimationFrame(() => {
        renderScreen(screen, game,requestAnimationFrame)
    })
}