const tableSize = 4
const numCards = tableSize**2
const cards = setCards(numCards/2, 'a')

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

// shuffledCards.forEach(card => {
//     const newCard = document.createElement("div");
//     newCard.classList.add("card");
//     newCard.dataset.cardValue = card['num'];
//     newCard.addEventListener("click", flipCard);
//     board.appendChild(newCard);
// });

board.innerHTML = shuffledCards.map(card => {
    return `<div class='card' data-card-value='${card['num']}'></div>`
}).join('')

const boardCards = [...board.querySelectorAll('.card')]
boardCards.forEach(boardCard => boardCard.addEventListener("click", flipCard))

let flippedCards = [];
let lockBoard = false;

function flipCard() {
    if (lockBoard) return;
    if (this === flippedCards[0]) return;

    this.classList.add("flip");

    if (flippedCards.length === 0) {
        flippedCards[0] = this;
        return;
    } else {
        board.classList.add("disabled");
        flippedCards[1] = this;
        checkForMatch();
    }
}

function checkForMatch() {
    let isMatch = flippedCards[0].dataset.cardValue === flippedCards[1].dataset.cardValue;

    isMatch ? disableCards() : unflipCards();
}

function disableCards() {
    score++
    flippedCards[0].removeEventListener("click", flipCard);
    flippedCards[1].removeEventListener("click", flipCard);
    resetBoard();
    addScore();
}

function unflipCards() {
    lockBoard = true;

    setTimeout(() => {
        flippedCards[0].classList.remove("flip");
        flippedCards[1].classList.remove("flip");

        resetBoard();
    }, 1500);
}

function resetBoard() {
    flippedCards = [];
    lockBoard = false;
    board.classList.remove("disabled");
}

// Score

const scoreTxt = document.getElementById("score");
let score = 0

setScore()

function setScore() {
    scoreTxt.textContent = `Placar: ${score}/${cards.length}`
}