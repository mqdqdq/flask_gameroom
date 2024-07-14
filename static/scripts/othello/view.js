let disks = undefined;
let flipLists = undefined;
let turn = undefined;
let startPlayer = undefined;
let state = undefined;

let initLoad = false;

let scoreDark = 0;
let scoreLight = 0;

let textLight = document.querySelector("#score-text-light");
let textDark = document.querySelector("#score-text-dark");
let stateText = document.querySelector("#state-text");

function onLoad(data) {
	disks = data.disks;
	flipLists = data.flip_lists;
	turn = data.turn;
	startPlayer = data.start_player;
	state = data.state;
	drawMarkers();
    drawPieces();
	if (!initLoad) {
		addClickListeners();
		initLoad = true;
	}
	setScore();
	if (newGame()) {
		startGame();
	}
	setScoreBoard();
	setState();
	if (state == STATE_FINISHED) {
		endGame();
	}
}
loadData();

function getCircle(key) {
	let position = key.split(",")
	let col = position[0].replace(/[^0-9]/g, '');
	let row = position[1].replace(/[^0-9]/g, '');
	let query = (".row-" + row + ".col-" + col + ".cell");
	let cell = document.querySelector(query);
	let circle = cell.querySelector(".circle-draw");
	return circle;
}

function drawPieces() {
    for (const [key, value] of Object.entries(disks)) {
		let circle = getCircle(key);
        circle.setAttribute('visibility', 'visible');
		let color = (value == DARK) ? COLOR_DARK : COLOR_LIGHT;
		circle.setAttribute('stroke', color);
		circle.setAttribute('fill', color);
    }
}

function drawMarkers() {
	for (const [key, value] of Object.entries(flipLists)) {
		let circle = getCircle(key);
		circle.setAttribute('visibility', 'visible');
		if ((value == "[]") || !(isPlayerTurn())) {
			circle.setAttribute('stroke', "none");
			circle.setAttribute('fill', "none");
		} 
		else {
			let color = (turn == DARK) ? COLOR_DARK : COLOR_LIGHT;
			circle.setAttribute('stroke', color);
			circle.setAttribute('fill', "none");
		}
    }
}

function addClickListeners() {
	let cells = document.getElementsByClassName('cell');
	for (const [key, cell] of Object.entries(cells)) {
		className = cell.className
		let row = className.charAt(9);
		let col = className.charAt(15);
		cell.addEventListener('click', function() {
			if (opponentConnected) {
				if (state != STATE_FINISHED) {
					if (isPlayerTurn()) {
						let key = "(" + col + ", " + row + ")";
						if (flipLists[key] != "[]") {
							data = {'col': parseInt(col), 'row': parseInt(row)};
							sendData(data);
						}
					}
				}
				else  {
					sendRematch();
				}
			}
		});
	}
}

function isDark() {
	return (PLAYER == startPlayer);
}

function isPlayerTurn() {
	return ((turn == DARK) && isDark() || ((turn == LIGHT) && (!isDark())));
}

function setScore() {
	scoreDark = 0;
	scoreLight = 0;
	for (const [key, value] of Object.entries(disks)) {
		if (value == DARK) {
			scoreDark += 1;
		}
		if (value == LIGHT) {
			scoreLight += 1;
		}
	}
}

function newGame() {
	return (scoreDark + scoreLight == 4);
}

function setScoreBoard() {
	textLight.textContent = String(scoreLight);
	textDark.textContent = String(scoreDark);
}

function setState() {
	console.log(scoreLight);
	console.log(scoreDark);
    if (!opponentConnected) {
        stateText.innerHTML = STATUS_WAIT;
    }
    else {
		if (state == STATE_CONTINUE) {
			stateText.innerHTML = (isPlayerTurn()) ? STATUS_PLAYER : STATUS_OPPONENT;
		}
		else {
			if (scoreDark > scoreLight) {
				stateText.innerHTML = (isDark()) ? STATUS_WIN : STATUS_LOSE;
			}
			else if (scoreLight > scoreDark) {
				stateText.innerHTML = (!isDark()) ? STATUS_WIN : STATUS_LOSE;
			}
			else {
				stateText.innerHTML = STATUS_DRAW;
			}
		}
    }
}

function onJoin() {
	setState();
}

function onLeave() {
	setState();
}
