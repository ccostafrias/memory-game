function handlePlayerClick(e) {
    const players = [...document.querySelectorAll('.player')]
    players.forEach(player => player.classList.remove('active'))

    this.classList.add('active')
    numberPlayers = Number(this.textContent)

    saveLocalStorage('numberPlayers', numberPlayers)
}

const [min, max] = [2, 6]

function handleArrowClick(e) {
    const side = [...this.classList].find(classy => classy === 'left' || classy === 'right')
    const tablesizeArrows = [...document.querySelectorAll('.arrow')]
    const tableSizeInput = document.querySelector('.table-size-num')

    tableSize = side === 'left' ? tableSize - 2 : tableSize + 2
    if (tableSize <= min) { 
        tableSize = min
        tablesizeArrows.find(arrow => arrow.classList.contains('left')).classList.add('block')
    } else if (tableSize >= max) {
        tableSize = max
        tablesizeArrows.find(arrow => arrow.classList.contains('right')).classList.add('block')
    }else {
        tablesizeArrows.find(arrow => arrow.classList.contains('left')).classList.remove('block')
        tablesizeArrows.find(arrow => arrow.classList.contains('right')).classList.remove('block')
    }
    
    saveLocalStorage('tableSize', tableSize)
    tableSizeInput.innerHTML = `${tableSize}x${tableSize}`
}

function handleStartClick(e) {
    const configs = document.querySelector('.configs')
    configs.classList.add('invisible')
    startGame()
}

function handleThemeClick(e) {
    const themeBttns = [...document.querySelectorAll('.theme-bttn')]
    themeBttns.forEach(bttn => bttn.classList.remove('active'))
    this.classList.add('active')
    theme = this.textContent.toLowerCase()

    saveLocalStorage('theme', theme)
}

function handleNewGameClick(e) {
    setConfigs('settings')
}

const configContainer = document.querySelector(".configs")

function setConfigs(p, showClose = false) {
    const configs = document.querySelector('.configs')
    configs.classList.remove('invisible')

    if (p === 'settings') {
        configContainer.innerHTML = (
            `<div class="configs-wrapper">
            <button class="configs-close-bttn ${showClose ? 'visible' : ''}"></button>
            <div class="configs-content">
                <div class="configs-fieldset">
                    <span class="config-label">Memory theme</span>
                    <div class="theme-field">
                        <button class="theme-bttn bttn ${theme === 'numbers' ? 'active' : ''}">Numbers</button>
                        <button class="theme-bttn bttn ${theme === 'icons' ? 'active' : ''}">Icons</button>
                    </div>
                </div>
                <div class="configs-fieldset">
                    <span class="config-label">Table size:</span>
                    <div class="table-size-field">
                        <button class="arrow left ${tableSize <= min ? 'block' : ''}"></button>
                        <div class="table-size-num">${tableSize}x${tableSize}</div>
                        <button class="arrow right ${tableSize >= max ? 'block' : ''}"></button>
                    </div>
                </div>
                <div class="configs-fieldset">
                    <span class="config-label">Number of players:</span>
                    <div class="num-players-field">
                        <button class="player ${numberPlayers === 1 ? 'active' : ''}">1</button>
                        <button class="player ${numberPlayers === 2 ? 'active' : ''}">2</button>
                        <button class="player ${numberPlayers === 3 ? 'active' : ''}">3</button>
                        <button class="player ${numberPlayers === 4 ? 'active' : ''}">4</button>
                    </div>
                </div>
                <button class="start-bttn bttn">Start Game</button>
            </div>
        </div>`
        )

        const startButton = document.querySelector('.start-bttn')
        startButton.addEventListener('click', handleStartClick)

        const themeBttns = [...document.querySelectorAll('.theme-bttn')]
        themeBttns.forEach(bttn => {
            bttn.addEventListener('click', handleThemeClick)
        })
        
        const tablesizeArrows = [...document.querySelectorAll('.arrow')]
        tablesizeArrows.forEach(arrow => {
            arrow.addEventListener('click', handleArrowClick)
        })

        const players = [...document.querySelectorAll('.player')]
        players.forEach(player => {
            player.addEventListener('click', handlePlayerClick)
        })

    } else if (p === 'win-many') {
        const playersSorted = playersOrder.sort((playerA, playerB) => {
            return playerB['score'] - playerA['score']
        })

        configContainer.innerHTML = (
            `<div class="winner-screen">
                <header>
                    <h2>Player ${playersSorted[0]['player']} wins!</h2>
                    <span>Game over... Here are the results!</span>
                </header>

                <div class="winner-players">
                    ${playersSorted.map((player, i) => {
                        return (
                            `<div class="winner-player ${i === 0 ? 'player-winner' : ''}">
                                <span class="winner-player-name">Player ${player['player']}${i === 0 ? ' (Winner!)' : ''}</span>
                                <span class="winner-pairs">${player['score']} pairs</span>
                            </div>`
                        )
                    }).join('')}
                </div>

                <div class="winner-bttns">
                    <button class="winner-bttn bttn winner-restart-bttn">Restart</button>
                    <button class="winner-bttn bttn winner-ng-bttn">Setup New Game</button>
                </div>
            </div>`
        )

        const restartBttn = document.querySelector('.winner-restart-bttn')
        restartBttn.addEventListener('click', handleStartClick)

        const setupNewGameBttn = document.querySelector('.winner-ng-bttn')
        setupNewGameBttn.addEventListener('click', handleNewGameClick)
    } else if (p === 'win-solo') {
        if (timer) clearInterval(timer)

        configContainer.innerHTML = (
            `<div class="winner-screen">
                <header>
                    <h2>You did it!</h2>
                    <span>Game over... Here's how you got on...</span>
                </header>

                <div class="winner-content">
                    <div class="winner-time-container">
                        <span class="winner-time">Time Elapsed</span>
                        <span class="winner-time-count">${buildTime(playersOrder['time'])}</span>
                    </div>
                    <div class="winner-moves-container">
                        <span class="winner-moves">Moves Taken</span>
                        <span class="winner-moves-count">${playersOrder['moves']}</span>
                    </div>
                </div>

                <div class="winner-bttns">
                    <button class="winner-bttn bttn winner-restart-bttn">Restart</button>
                    <button class="winner-bttn bttn winner-ng-bttn">Setup New Game</button>
                </div>
            </div>`
        )

        const restartBttn = document.querySelector('.winner-restart-bttn')
        restartBttn.addEventListener('click', handleStartClick)

        const setupNewGameBttn = document.querySelector('.winner-ng-bttn')
        setupNewGameBttn.addEventListener('click', handleNewGameClick)
    }
}

const headerRestartButton = document.querySelector('.header-restart-bttn')
headerRestartButton.addEventListener('click', () => {
    if (!lockBoard) handleStartClick()
})

const headerNewGameButton = document.querySelector('.header-ng-bttn')
headerNewGameButton.addEventListener('click', () => {
    if (!lockBoard) handleNewGameClick()
})

setConfigs('settings')