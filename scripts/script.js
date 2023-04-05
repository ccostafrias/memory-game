let tableSize = 4
let numberPlayers = 2
let playersOrder = []
let theme = 'numbers'
let cards = setCards(tableSize, 'a').concat(setCards(tableSize, 'b'))

const board = document.getElementById("board")

// Initialize the game
function startGame() {
    flippedCards = []
    lockBoard = false
    score = 0
    cards = setCards(tableSize, 'a').concat(setCards(tableSize, 'b'))
    shuffledCards = shuffle(cards)

    document.documentElement.style.setProperty('--table-size', tableSize)

    const cardSize = () => {
        const i = (tableSize - 2) / 2
        const size = Math.round(100 * ((.75)**(i)))
        return `${size}px`
    }
    document.documentElement.style.setProperty('--card-size', cardSize())

    board.innerHTML = shuffledCards.map((card, i) => {
        return (
            `<div class='card' data-index='${i}'>
                <div class='turn card-front'></div>
                <div class='turn card-back'><span></span></div>
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

    const newCards = Array.from({length: size}).map((n, i) => Object({num: i+1, key}))
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
    cardBack.querySelector('span').innerHTML = cardContent['num']

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
                        card.querySelector('span').innerHTML = ''
                    })
                    
                    lockBoard = false
                    flippedCards = []
                }, 300)
            }, 500)

        }
    }
}

// startGame()