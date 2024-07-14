let startPlayer = undefined;
let symbol = undefined;
let board = undefined;
let state = undefined;

let initLoad = false;
let stateText = document.querySelector("#state-text");
let stateSymbolText = document.querySelector("#state-symbol-text");

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
        addMouseoverListener();
    }
    clearMouseover();
}
loadData();

function gameOver() {
    return (state != STATE_CONTINUE);
}

function isX() {
    return (startPlayer == PLAYER);
}

function isPlayerTurn() {
    return (isX() && (symbol == SYMBOL_X) || !isX() && (symbol == SYMBOL_O));
}

function isNewGame() {
    return (Object.keys(board).length == 0);
}

function clearBoard() {
    for (let row = 0; row < ROWS_N; row++) {
        for (let col = 0; col < COLS_N; col++) {
            let cell = document.querySelector('.row-' + row + '.col-' + col + '.cell');
            cell.innerHTML = '';
            cell.style.color = 'black';
        }
    }
}

function addClickListeners() {
    for (let row = 0; row < ROWS_N; row++) {
        for (let col = 0; col < COLS_N; col++) {
            let cell = document.querySelector('.row-' + row + '.col-' + col + '.cell');
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

function addMouseoverListener() {
    for (let row = 0; row < ROWS_N; row++) {
        for (let col = 0; col < COLS_N; col++) {
            let cell = document.querySelector('.row-' + row + '.col-' + col + '.cell');
            cell.addEventListener('mouseover', function() {
                if (opponentConnected) {
                    if ((state == STATE_CONTINUE)) {
                        if (isPlayerTurn()) {
                            clearMouseover();
                            if (cell.innerHTML == "") {
                                cell.innerHTML = symbol;
                                cell.style.color = "rgba(0, 0, 0, 0.4)";
                            }
                        }
                    }
                }
            });
        }
    }
}

function clearMouseover() {
    for (let row = 0; row < ROWS_N; row++) {
        for (let col = 0; col < COLS_N; col++) {
            let cell = document.querySelector('.row-' + row + '.col-' + col + '.cell');
            if ((cell.style.color != 'black') && (cell.style.color != 'red')) {
                cell.style.color = 'black';
                cell.innerHTML = '';
            }
        }
    }
}

function setBoard() {
    for (const [key, cellData] of Object.entries(board)) {
        let cell = document.querySelector('.row-' + cellData.row + '.col-' + cellData.col + '.cell');
        cell.innerHTML = cellData.symbol;
        cell.style.color = (cellData.marked == 1) ? 'red' : 'black'
    }
}

function setState() {
    if (!opponentConnected) {
        stateText.innerHTML = STATUS_WAIT;
        stateSymbolText.innerHTML = "";
    }
    else {
        switch (state) {
            case STATE_DRAW:
                stateText.innerHTML = STATUS_DRAW;
                stateSymbolText.innerHTML = "";
                break;
            case STATE_CONTINUE:
                stateText.innerHTML = (isPlayerTurn()) ? STATUS_PLAYER : STATUS_OPPONENT;
                stateSymbolText.innerHTML = "(" + symbol + ")";
                break;
            case STATE_FINISHED:
                stateText.innerHTML = (!isPlayerTurn()) ? STATUS_PLAYER_WIN : STATUS_OPPONENT_WIN;
                stateSymbolText.innerHTML = "";
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
