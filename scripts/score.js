const scoreContainer = document.querySelector(".score-container")
var timer

function setScore() {
    // Score for 2+ players
    if (numberPlayers !== 1) {
        playersOrder = Array.from({length: numberPlayers})
            .map((item, i) => {
                return Object({
                    player: i+1,
                    turn: i === 0 ? true : false,
                    score: 0
                })
            })

        updateScore()
    } 
    // Score for solo player
    else {
        playersOrder = Object({
            moves: 0,
            time: 0,
            score: 0,
        })

        updateScoreSolo()

        timer = setInterval(() => {
            playersOrder['time']++

            const scoreTimer = document.querySelector('.score-timer > .score-content')
            // if (!scoreTimer) clearInterval(timer)
            scoreTimer.innerHTML = buildTime(playersOrder['time'])
        }, 1000);
    }
}

function buildTime(s) {
    let seconds = s
    let mins = Math.floor(seconds / 60)
    seconds %= 60

    return `${mins}:${String(seconds).padStart(2, '0')}`
}

function updateScoreSolo(p) {
    if (p === 'add') {
        playersOrder['moves']++
        playersOrder['score']++

        const scoreMoves = document.querySelector('.score-moves > .score-content')
        scoreMoves.innerHTML = playersOrder['moves']
    } else if (p === 'move') {
        playersOrder['moves']++
        
        const scoreMoves = document.querySelector('.score-moves > .score-content')
        scoreMoves.innerHTML = playersOrder['moves']
    }

    scoreContainer.innerHTML = (
        `<div class="score-solo-wrapper">
            <div class="score-timer">
                <span class="score-title">Time</span>
                <span class="score-content">${buildTime(playersOrder['time'])}</span>
            </div>
            <div class="score-moves">
                <span class="score-title">Moves</span>
                <span class="score-content">${playersOrder['moves']}</span>
            </div>
        </div>`
    )

    checkWinSolo()
}

function updateScore(p) {
    if (p === 'add') {
        const playerTurn = playersOrder.find(player => player['turn'])
        playerTurn['score']++
    } else if (p === 'pass') {
        let i = playersOrder.findIndex(player => player['turn'])
        playersOrder[i]['turn'] = false

        i++
        if (i >= playersOrder.length) i = 0
        playersOrder[i]['turn'] = true
    }

    scoreContainer.innerHTML = (
        `<div class="score-wrapper">
            ${playersOrder.map((player, i) => {
                return (
                    `<div class="score-player ${player['turn'] ? 'turn' : ''}">
                        <span class="score-player-name name-short">P${i+1}</span>
                        <span class="score-player-name">Player&nbsp;${i+1}</span>
                        <span class="score-player-score">${player['score']}</span>
                    </div>`)
            }).join('')}
        </div>`
    )

    checkWin()
}

function checkWin() {
    const scoreTot = playersOrder.reduce((tot, player) => { return tot + player['score'] }, 0)
    if (scoreTot >= tableSize**2/2) {
        startConfetti()

        setTimeout(() => {
            stopConfetti()
            setConfigs('win-many')
        }, 1000);
    }
}

function checkWinSolo() {
    if (playersOrder['score'] >= tableSize**2/2) {
        startConfetti()

        setTimeout(() => {
            stopConfetti()
            setConfigs('win-solo')
        }, 1000);
    }
}