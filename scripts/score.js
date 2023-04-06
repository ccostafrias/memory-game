const scoreContainer = document.querySelector(".score-container")

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

    }
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
                    </div>`
                )
            }).join('')}
        </div>`
    )

    const scoreTot = playersOrder.reduce((tot, player) => { return tot + player['score'] }, 0)
    if (scoreTot >= tableSize**2/2) {
        startConfetti()

        setTimeout(() => {
            stopConfetti()
            setConfigs('win-many')
        }, 1000);
    }
}