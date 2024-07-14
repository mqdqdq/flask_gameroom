let deck = undefined;
let turn = undefined;
let state = undefined;
let score1 = undefined;
let score2 = undefined;
let round = undefined;

let initLoad = false;

let stateText = document.querySelector("#state-text");

let scorePlayerText = document.querySelector("#score-player-text");
let scoreOpponentText = document.querySelector("#score-opponent-text");

function onLoad(data) {
    deck = data.deck;
    turn = data.turn;
    state = data.state;
    score1 = data.score_1;
    score2 = data.score_2;
    round = data.round;
    if (isNewGame()) {
        startGame();
        setCardFront();
    }
    if (!initLoad) {
        initLoad = true;
        setCardFront();
        addClickListeners();
	}
    if (gameOver()) {
        endGame();
    }
    setScore();
    drawCards();
    unpauseInit();
    setState();
}
loadData();


function isNewGame() {
    return (round == 0);
}

function cardClosed(id) {
    let card = document.querySelector("#card-" + id);
    let cardFront = card.querySelector(".card-front")
    return (cardFront.getAttribute('visibility') == "hidden")
}

function addClickListeners() {
    let cards = document.getElementsByClassName('card');
    for (const [key, card] of Object.entries(cards)) {
        let id = card.id;
        id = id.replace('card-', '');
        id = parseInt(id);
        card.addEventListener('click', function() {
            if (opponentConnected) {
                if (!gameOver()) {
                    if (turn == PLAYER) {
                        if (cardClosed(id)) {
                            sendData({'move': id});
                        }
                    }
                }
                else {
                    sendRematch();
                }
            }
        });
    }
}

function gameOver() {
    return ((state != STATE_CONTINUE) && (state != STATE_PAUSE));
}

function setCardFront() {
    for (const [key, cardData] of Object.entries(deck)) {
        let id = cardData.id;
        let name = cardData.name;
        let card = document.querySelector("#card-" + id);
        let cardFront = card.querySelector('.card-front');
        let cardSymbol = card.querySelector('.card-symbol');
        cardGraphics = CARDS[name];
        cardFront.setAttribute('fill', cardGraphics.cardColor);
        cardFront.setAttribute('stroke', cardGraphics.frameColor);
        cardSymbol.textContent = cardGraphics.symbol;
        cardSymbol.setAttribute('fill', cardGraphics.symbolColor);
    }
}

function drawCards() {
    for (const [key, cardData] of Object.entries(deck)) {
		let id = cardData.id
        let card = document.querySelector("#card-" + id);
        let cardFront = card.querySelector('.card-front')
        let cardBack = card.querySelector('.card-back')
        let cardSymbol = card.querySelector('.card-symbol')
        if ((cardData.open == 1) || (cardData.selected == 1)) {
            cardSymbol.setAttribute("visibility", "visible")
            cardFront.setAttribute("visibility", 'visible');
            cardBack.setAttribute("visibility", "hidden")
        }
        else {
            cardSymbol.setAttribute("visibility", "hidden")
            cardFront.setAttribute("visibility", 'hidden');
            cardBack.setAttribute("visibility", "visible")
        }
    }
}

function unpauseInit() {
    if ((state == STATE_PAUSE) && (turn == PLAYER)) {
        setTimeout(sendData, 1000, {'unpause': true});
    }
}

function setState() {
    if (!opponentConnected) {
        stateText.innerHTML = STATUS_WAIT;
    }
    else {
        if (state == STATE_FINISHED) {
            if (score1 > score2) {
                stateText.innerHTML = (PLAYER == 1) ? STATUS_WIN : STATUS_LOSE
            }
            else if (score2 > score1) {
                stateText.innerHTML = (PLAYER == 2) ? STATUS_WIN : STATUS_LOSE
            }
            else {
                stateText.innerHTML = STATUS_DRAW
            }
        }
        else {
            if (state == STATE_CONTINUE) {
                stateText.textContent = (turn == PLAYER) ? STATUS_PLAYER : STATUS_OPPONENT;
            }
            else if (state == STATE_PAUSE) {
                stateText.textContent = STATUS_WAIT;
            }
        }
    }
}

function setScore() {
    scorePlayerText.innerHTML = (PLAYER == 1) ? score1 : score2;
    scoreOpponentText.innerHTML = (PLAYER == 1) ? score2 : score1;
}

function onLeave() {
    setState();
}

function onJoin() {
    setState();
}
