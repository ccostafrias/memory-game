function handlePlayerClick(e) {
    const players = [...document.querySelectorAll('.player')]
    players.forEach(player => player.classList.remove('active'))

    this.classList.add('active')
    numberPlayers = Number(this.textContent)
}

function handleArrowClick(e) {
    const side = [...this.classList].find(classy => classy === 'left' || classy === 'right')
    const tablesizeArrows = [...document.querySelectorAll('.arrow')]
    const tableSizeInput = document.querySelector('.table-size-num')

    tableSize = side === 'left' ? tableSize - 2 : tableSize + 2
    if (tableSize <= 2) { 
        tableSize = 2
        tablesizeArrows.find(arrow => arrow.classList.contains('left')).classList.add('block')
    } else {
        tablesizeArrows.find(arrow => arrow.classList.contains('left')).classList.remove('block')
    }
    
    tableSizeInput.innerHTML = `${tableSize}x${tableSize}`
}

function handleStartClick() {
    const configs = document.querySelector('.configs')
    configs.classList.add('invisible')
    startGame()
}

function handleThemeClick(e) {
    const themeBttns = [...document.querySelectorAll('.theme-bttn')]
    themeBttns.forEach(bttn => bttn.classList.remove('active'))
    this.classList.add('active')
    theme = this.textContent.toLowerCase()
}

const configContainer = document.querySelector(".configs")

function setConfigs(p) {
    if (p === 'settings') {
        configContainer.innerHTML = (
            `<div class="configs-wrapper">
            <button class="configs-close-bttn"></button>
            <div class="configs-content">
                <div class="configs-fieldset">
                    <span class="config-label">Memory theme</span>
                    <div class="theme-field">
                        <button class="theme-bttn bttn active">Numbers</button>
                        <button class="theme-bttn bttn">Icons</button>
                    </div>
                </div>
                <div class="configs-fieldset">
                    <span class="config-label">Table size:</span>
                    <div class="table-size-field">
                        <button class="arrow left"></button>
                        <div class="table-size-num">4x4</div>
                        <button class="arrow right"></button>
                    </div>
                </div>
                <div class="configs-fieldset">
                    <span class="config-label">Number of players:</span>
                    <div class="num-players-field">
                        <button class="player">1</button>
                        <button class="player active">2</button>
                        <button class="player">3</button>
                        <button class="player">4</button>
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
    }
}

setConfigs('settings')