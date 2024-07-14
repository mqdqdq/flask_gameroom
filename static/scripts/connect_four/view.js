let startPlayer = undefined;
let turn = undefined;
let board = undefined;
let state = undefined;

let initLoad = false;
let stateText = document.querySelector("#state-text");

function onLoad(data) {
	turn = data.turn;
	startPlayer = data.start_player;
	state = data.state;
	board = data.board;
	if (gameOver()) {
        endGame();
    }
    if (isNewGame()) {
        startGame();
        clearBoard();
    }
	drawPieces();
	resetMouseover();
	setState();
	if (!initLoad) {
		addClickListeners();
		addMouseoverListeners();
        initLoad = true;
	}
}
loadData();


function getPiece(col, row) {
	for (const [key, piece] of Object.entries(board)) {
		if ((piece.row == row) && (piece.col == col)) {
			return piece
		}
	}
	return undefined;
}

function colFree(col) {
    return (getPiece(col, 0) == undefined);
}

function isPlayerTurn() {
	return (((turn == COLOR_RED) && (startPlayer == PLAYER)) || ((turn == COLOR_BLUE) && (startPlayer != PLAYER)));
}

function isNewGame() {
    return (Object.keys(board).length == 0);
}

function gameOver() {
    return (state != STATE_CONTINUE);
}

function addClickListeners() {
	for (let col = 0; col < COLS_N; col++) {
		let selectArea = document.querySelector("#select-col-" + col);
		selectArea.addEventListener('click', function() {
			if (opponentConnected) {
				if (!gameOver()) {
					if ((colFree(col)) && (isPlayerTurn())) {
						move = {'col': parseInt(col)};
						sendData(move)
					}
				}
				else {
					sendRematch();
				}
			}
		})
	}
}

function addMouseoverListeners() {
	for (let col = 0; col < COLS_N; col++) {
		let selectArea = document.querySelector("#select-col-" + col);
		selectArea.addEventListener('mouseover', function() {
			if (!gameOver()) {
				resetMouseover();
				if (isPlayerTurn()) {
					let selectCircles = document.getElementsByClassName('circle-select col-' + col);
					for (const [key, circle] of Object.entries(selectCircles)) {
						let color = (turn == COLOR_RED) ? DRAW_COLOR_RED : DRAW_COLOR_BLUE;
						circle.setAttribute('fill', color)
					}
				}
			}
		});
	}
}


function resetMouseover() {
	let selectCircles = document.getElementsByClassName('circle-select');
	for (const [key, circle] of Object.entries(selectCircles)) {
		circle.setAttribute('fill', 'white')
	}
}

function drawPieces() {
    for (const [key, piece] of Object.entries(board)) {
		let col = piece.col
		let row = piece.row
		let pieceColor = piece.color
		let win_mark = (piece.marked == 1) ? true : false;
		let drawSquare = document.querySelector(".row-" + row + ".col-" + col + ".circle-draw");
		let color = (pieceColor == COLOR_RED) ? DRAW_COLOR_RED : DRAW_COLOR_BLUE;
		drawSquare.setAttribute('fill', color)
		drawSquare.setAttribute('stroke', color)
		drawSquare.setAttribute('visibility', 'visible')
		if (win_mark) {
			drawSquare.setAttribute('stroke', 'white')
		}
    }
}

function clearBoard() {
	let selectCircles = document.getElementsByClassName('circle-draw');
	for (const [key, circle] of Object.entries(selectCircles)) {
		circle.setAttribute('visibility', 'hidden');
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
                stateText.innerHTML = (isPlayerTurn()) ? STATUS_LOSE : STATUS_WIN;
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
