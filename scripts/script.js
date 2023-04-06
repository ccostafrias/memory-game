const prefix = 'memorygame'

let tableSize = getLocalStorage('tableSize') || 4
let numberPlayers = getLocalStorage('numberPlayers') || 2
let theme = getLocalStorage('theme') || 'numbers'
let playersOrder = []

const icons = [
    "<img src='./images/cards/accessibility-outline.svg'/>",
    "<img src='./images/cards/airplane-outline.svg'/>",
    "<img src='./images/cards/alarm-outline.svg'/>",
    "<img src='./images/cards/american-football-outline.svg'/>",
    "<img src='./images/cards/attach-outline.svg'/>",
    "<img src='./images/cards/balloon-outline.svg'/>",
    "<img src='./images/cards/bandage-outline.svg'/>",
    "<img src='./images/cards/barbell-outline.svg'/>",
    "<img src='./images/cards/bed-outline.svg'/>",
    "<img src='./images/cards/beer-outline.svg'/>",
    "<img src='./images/cards/bicycle-outline.svg'/>",
    "<img src='./images/cards/boat-outline.svg'/>",
    "<img src='./images/cards/bonfire-outline.svg'/>",
    "<img src='./images/cards/book-outline.svg'/>",
    "<img src='./images/cards/bowling-ball-outline.svg'/>",
    "<img src='./images/cards/bug-outline.svg'/>",
    "<img src='./images/cards/camera-outline.svg'/>",
    "<img src='./images/cards/car-outline.svg'/>",
    "<img src='./images/cards/color-palette-outline.svg'/>",
    "<img src='./images/cards/cut-outline.svg'/>",
    "<img src='./images/cards/diamond-outline.svg'/>",
    "<img src='./images/cards/dice-outline.svg'/>",
    "<img src='./images/cards/earth-outline.svg'/>",
    "<img src='./images/cards/extension-puzzle-outline.svg'/>",
    "<img src='./images/cards/fish-outline.svg'/>",
    "<img src='./images/cards/flask-outline.svg'/>",
    "<img src='./images/cards/footsteps-outline.svg'/>",
    "<img src='./images/cards/game-controller-outline.svg'/>",
    "<img src='./images/cards/happy-outline.svg'/>",
    "<img src='./images/cards/home-outline.svg'/>",
    "<img src='./images/cards/hourglass-outline.svg'/>",
    "<img src='./images/cards/paw-outline.svg'/>",
]

const selectRandom = (arr, size) => {
    let arrCopy = Array.from(arr)
    return Array
        .from({length: size})
        .map((n, i) => {
            let random = Math.floor(Math.random() * arrCopy.length)
            let arrRandom = (arrCopy.splice(random, 1)).join('')

            return arrRandom
        })
}
let selectedIcons = selectRandom(icons, tableSize**2/2)

let cards = setCards(tableSize, 'a').concat(setCards(tableSize, 'b'))

const board = document.getElementById("board")

function getLocalStorage(key) {
    const fromlocal = localStorage.getItem(`${prefix}-${key}`)
    if (fromlocal) {
        if (Number(fromlocal)) {
            return Number(fromlocal)
        }
        else { 
            return fromlocal
        }
    }
}

function saveLocalStorage(key, value) {
    localStorage.setItem(`${prefix}-${key}`, value)
}

// Start the game
function startGame() {
    // Reset configs
    selectedIcons = selectRandom(icons, tableSize**2/2)
    flippedCards = []
    lockBoard = false
    score = 0

    cards = setCards(tableSize, 'a').concat(setCards(tableSize, 'b'))
    shuffledCards = shuffle(cards)
    let insideCard

    if (theme === 'numbers') {
        insideCard = `<span class="card-content"></span>`
    } else if (theme === 'icons') {
        insideCard = `<div class="card-content"></div>`
    }

    document.documentElement.style.setProperty('--table-size', tableSize)

    // Card size CSS variable
    const cardSize = () => {
        const i = (tableSize - 2) / 2
        const size = Math.round(100 * ((.75)**(i)))
        return `${size}px`
    }

    document.documentElement.style.setProperty('--card-size', cardSize())
    document.documentElement.style.setProperty('--num-players', numberPlayers)

    board.innerHTML = shuffledCards.map((card, i) => {
        return (
            `<div class='card' data-index='${i}'>
                <div class='turn card-front'></div>
                <div class='turn card-back'>${insideCard}</div>
            </div>`
        )
    }).join('')

    const boardCards = [...board.querySelectorAll('.card')]
    boardCards.forEach(boardCard => boardCard.addEventListener("click", flipCard))

    setScore()
}

// Create array within a range of numbers
function setCards(size, key) {
    if (size <= 0) {
        size = tableSize = 2
    }

    if (size % 2 !== 0) {
        tableSize++
        size = (size+1)**2/2
    } else {
        size = size**2/2
    }

    let newCards

    if (theme === 'numbers') { 
        newCards = Array
            .from({length: size})
            .map((n, i) => Object({num: i+1, key}))
    } else if (theme === 'icons') {
        newCards = Array
            .from({length: size})
            .map((n, i) => Object({num: selectedIcons[i], key}))
    }
    return newCards
}

// Shuffle the cards
// The top cards go into any position, randomly
// Sometime, the top card will go under the first bottom card
// This card will slowly rise through the deck
// When that card reaches the top, the deck is 100% shuffled
function shuffle(array) {
    const length = array.length
    const bottomNum = array[0]['num']
    const bottomKey = array[0]['key']
    let isOnTop = false
    while (!isOnTop) {
        let random = Math.floor(Math.random() * length)
        let top = array.pop()
        array.splice(random, 0, top)
        
        if (
            array[length - 1]['num'] === bottomNum &&
            array[length - 1]['key'] === bottomKey
        ) isOnTop = true
    }

    let random = Math.floor(Math.random() * length)
    let top = array.pop()
    array.splice(random, 0, top)

    return array
}

let flippedCards = []
let lockBoard = false

function flipCard() {
    if (lockBoard) return
    if (this.classList.contains('locked') || this.classList.contains('flip')) return

    const [cardFront, cardBack] = [...this.children]
    const index = this.dataset.index
    const cardContent = shuffledCards[index]

    this.classList.add("flip")
    cardBack.querySelector('.card-content').innerHTML = cardContent['num']

    flippedCards.push(this)

    checkMatch(this)
}

function checkMatch() {
    if (flippedCards.length === 2) {
        const [numA, numB] = flippedCards.map(card => shuffledCards[card.dataset.index]['num'])
        if (numA === numB) {
            flippedCards.forEach(card => {
                card.classList.add('locked')
            })

            updateScore('add')
            flippedCards = []
        } else {
            lockBoard = true

            flippedCards.forEach(card => {
                card.classList.add('shake')
            })
            
            setTimeout(() => {
                flippedCards.forEach(card => {
                    card.classList.remove('shake')
                    card.classList.remove('flip')
                })

                updateScore('pass')
                
                setTimeout(() => {
                    flippedCards.forEach(card => {
                        card.querySelector('.card-content').innerHTML = ''
                    })
                    
                    lockBoard = false
                    flippedCards = []
                }, 300)
            }, 500)

        }
    }
}