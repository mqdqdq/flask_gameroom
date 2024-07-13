let startPlayer = undefined;
let symbol = undefined;
let board = undefined;
let state = undefined;

let initLoad = false;
let stateText = document.querySelector("#state-text");

function onLoad(data) {
    startPlayer = data.start_player;
    symbol = data.symbol;
    state = data.state;
    board = data.board;
    if (gameOver()) {
        endGame();
    }
    if (isNewGame()) {
        startGame();
        clearBoard();
    }
    setBoard();
    setState();
    if (!initLoad) {
        initLoad = true;
        addClickListeners();
    }
}
loadData();

function gameOver() {
    return (state != STATE_CONTINUE);
}

function isPlayerTurn() {
    return ((startPlayer == PLAYER ) && (symbol == SYMBOL_X) || (startPlayer != PLAYER) && (symbol == SYMBOL_O));
}

function isNewGame() {
    return (Object.keys(board).length == 0);
}

function clearBoard() {
    for (let row = 0; row < ROWS_N; row++) {
        for (let col = 0; col < COLS_N; col++) {
            let cell = document.querySelector('#row-' + (row + 1) + '-col-' + (col + 1));
            cell.innerHTML = '';
            cell.style.color = 'white';
        }
    }
}

function addClickListeners() {
    for (let row = 0; row < ROWS_N; row++) {
        for (let col = 0; col < COLS_N; col++) {
            let cell = document.querySelector('#row-' + (row + 1) + '-col-' + (col + 1));
            cell.addEventListener('click', function() {
                if (opponentConnected) {
                    if ((state == STATE_CONTINUE)) {
                        if (isPlayerTurn()) {
                            sendData({reset: false, 'row': row, 'col': col});
                        }
                    }
                    else {
                        sendRematch();
                    }
                }
            });
        }
    }
}

function setBoard() {
    for (const [key, cellData] of Object.entries(board)) {
        let cell = document.querySelector('#row-' + (cellData.row + 1) + '-col-' + (cellData.col + 1));
        cell.innerHTML = cellData.symbol;
        cell.style.color = (cellData.marked == 1) ? 'red' : 'white'
    }
}

function setState() {
    if (!opponentConnected) {
        stateText.innerHTML = STATUS_WAIT;
    }
    else {
        switch (state) {
            case STATE_DRAW:
                stateText.innerHTML = STATUS_DRAW;
                break;
            case STATE_CONTINUE:
                stateText.innerHTML = (isPlayerTurn()) ? STATUS_PLAYER : STATUS_OPPONENT;
                break;
            case STATE_FINISHED:
                stateText.innerHTML = (isPlayerTurn()) ? STATUS_PLAYER_WIN : STATUS_OPPONENT_WIN;
                break;
        }
    }
}

function onLeave() {
    setState();
}

function onJoin() {
    setState();
}
