document.addEventListener('click', e => {
    if (e.target.className === "game-square" && !win) {
        clickSquare(parseInt(e.target.dataset.square))
        winCheck()
    }
    if (e.target.className === "game-reset") {
        resetGame()
    }
})

var crossTurn = true
var win = false
var winSquares = []
var playedSquares = [false, false, false, false, false, false, false, false, false]
const score = {x:0, o:0}
var turn = 0
const x = '\u2715'
const o = '\u25EF'

const clickSquare = square => {
    if (playedSquares[square]) return
    const squares = document.querySelectorAll(".game-square")
    const player = crossTurn ? x : o
    playedSquares[square] = player
    squares[square].innerHTML = player
    crossTurn = !crossTurn
    document.querySelector(".game-message").innerHTML = `It is ${crossTurn ? x : o}'s turn`
    turn++
}

const winCheck = () => {
    //Check if each square is selected and if the row/column all match
    for (let i = 0; i < 3; i++) {
        //Horizontal
        if (playedSquares[3*i] && playedSquares[3*i+1] && playedSquares[3*i+2] && playedSquares[3*i]===playedSquares[3*i+1] && playedSquares[3*i+1]===playedSquares[3*i+2]) {
            win = true
            winSquares = [3*i, 3*i+1, 3*i+2]
        }
        //Vertical
        if (playedSquares[i] && playedSquares[i+3] && playedSquares[i+6] && playedSquares[i]===playedSquares[i+3] && playedSquares[i+3]===playedSquares[i+6]) {
            win = true
            winSquares = [i, i+3, i+6,]
        }
    }

    //Diagonal
    if (playedSquares[0] && playedSquares[4] && playedSquares[8] && playedSquares[0]===playedSquares[4] && playedSquares[4]===playedSquares[8]) {
        win = true
        winSquares = [0, 4, 8]
    }
    if (playedSquares[2] && playedSquares[4] && playedSquares[6] && playedSquares[2]===playedSquares[4] && playedSquares[4]===playedSquares[6]) {
        win = true
        winSquares = [2, 4, 6]
    }

    if (win) {
        document.querySelector(".game-message").innerHTML = `${crossTurn ? o : x} won`
        if (crossTurn) {
            score.o = score.o + 1
            document.querySelector("#oScore").innerHTML = score.o
        } else {
            score.x = score.x + 1
            document.querySelector("#xScore").innerHTML = score.x
        }
        drawWinLine(document.querySelector(`#square${winSquares[0]}`), document.querySelector(`#square${winSquares[2]}`))
    }

    if (turn===9 && !win) {
        document.querySelector(".game-message").innerHTML = "Draw, no one won"
    }
}

const resetGame = () => {
    crossTurn = true
    win = false
    playedSquares = [false, false, false, false, false, false, false, false, false]
    turn = 0

    document.querySelectorAll(".game-square").forEach(e => {
        e.innerHTML = ""
    })

    document.querySelector(".game-message").innerHTML = `It is ${x}'s turn`
    if (lineSVG) {
        lineSVG.remove()
        lineSVG = null
    }
}
var lineSVG
const drawWinLine = (start, end) => {
    const parentSize = document.querySelector(".game-board").getBoundingClientRect()
    if (!lineSVG) {
        console.log(1, parentSize)
        lineSVG = document.createElementNS("http://www.w3.org/2000/svg", "svg")
        lineSVG.classList = "game-win-line"
        lineSVG.style.width = `${parentSize.width}px`
        lineSVG.style.height = `${parentSize.height}px`
    }
    const line = document.createElementNS("http://www.w3.org/2000/svg", "line")
    
    const startBounds = start.getBoundingClientRect()
    const endBounds = end.getBoundingClientRect()
    
    const startPoint = {x: startBounds.x + startBounds.width/2 - parentSize.x, y:startBounds.y + startBounds.height/2 - parentSize.y}
    const endPoint = {x: endBounds.x + endBounds.width/2 - parentSize.x, y: endBounds.y + endBounds.height/2 - parentSize.y}
    
    console.log(startPoint, endPoint)
    
    line.setAttribute("x1", startPoint.x)
    line.setAttribute("y1", startPoint.y)
    line.setAttribute("x2", endPoint.x)
    line.setAttribute("y2", endPoint.y)
    line.setAttribute("stroke", "#c81450")
    line.setAttribute("stroke-width", "10px")
    
    lineSVG.appendChild(line)
    document.querySelector(".game-board").appendChild(lineSVG)
}