const tableSize = 4
const numCards = tableSize**2
const cards = setCards(numCards/2, 'a')

// Cria uma array com números
function setCards(size, key) {
    if (size % 2 == 1) alert('Tabela precisa ser par!')

    const newCards = Array.from({length: size}).map((n, i) => Object({num: i+1, key}))
    return newCards
}

// Embaralha as cartas
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

    return array;
}

const shuffledCards = shuffle(cards.concat(setCards(numCards/2, 'b')));

const board = document.getElementById("board");
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

    if (flippedCards.length === 2) {
        const [numA, numB] = flippedCards.map(card => shuffledCards[card.dataset.index]['num'])
        if (numA === numB) {
            flippedCards.forEach(card => {
                card.classList.add('locked')
            })

            setScore(true)
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
                
                setTimeout(() => {
                    cardBack.querySelector('span').innerHTML = ''
                    lockBoard = false
                    flippedCards = []
                }, 400)
            }, 500)

        }
    }
}

// Score

const scoreTxt = document.getElementById("score");
let score = 0

setScore()

function setScore(add = false) {
    if (add) score++
    scoreTxt.textContent = `Placar: ${score}/${cards.length}`
}