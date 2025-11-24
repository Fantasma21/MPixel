export default function setupSocket(io, game) {

    io.on("connection", socket => {
        // ← depois de game.addPlayer(...)

        const ranking = Object.values(game.state.players)
            .sort((a, b) => b.score - a.score)
            .map(p => ({
                nickname: p.nickname,
                score: p.score
            }))

        socket.emit("ranking-update", ranking)

        console.log("> Conectado:", socket.id)

        // Espera o login antes de adicionar player
        socket.on("login", nickname => {
            console.log("> Player entrou como:", nickname)

            game.addPlayer(socket.id, nickname)

            socket.emit("setup", game.state)
            io.emit("state", game.state)
        })

        socket.on("move", direction => {
            game.movePlayer(socket.id, direction, null)
            io.emit("state", game.state)
        })


        socket.on("disconnect", () => {
            game.removePlayer(socket.id)
            io.emit("state", game.state)
        })
    })
}
