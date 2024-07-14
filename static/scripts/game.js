    /* This script encapsulates alot of the underlying methods used in the game rooms.
    In particular rematching, handling of sockets, transmitting and recieving data between users.
    It is limited to only two-player games. */

    const socket = io();
    const PLAYER = parseInt("{{ session['player'] }}");
    const ROOM_ID = parseInt("{{ session['room_id'] }}");

    const SIGNAL_CONNECTED = 'CONNECTED';
    const SIGNAL_DISCONNECTED = 'DISCONNECTED';
    const SIGNAL_IN_ROOM = 'IN_ROOM';
    const SIGNAL_REMATCH = 'REMATCH';   // sending rematch offers
    const SIGNAL_RESET = 'RESET';     // resets status after rematch

    const TEXT_STATUS_WAIT = "Status: Waiting for the opponent";
    const TEXT_STATUS_CONTINUE = "Status: Opponent is connected";

    const STATE_ROOM_WAITING = "WAITING";
    const STATE_ROOM_FINISHED = "FINISHED";
    const STATE_ROOM_CONTINUE = "CONTINUE";

    const INFO_TEXT_REMATCH = "Click on the game board to rematch";
    const INFO_TEXT_REMATCH_WAIT = "Waiting for opponent to rematch"

    let statusText = document.querySelector("#status-text");
    let infoText = document.querySelector("#info-text");

    let roomState = STATE_ROOM_WAITING;
    setRoomStatus();

    let opponentConnected = false;
    let rematch = false;

    function setRoomStatus() {
        console.log(roomState);
        switch (roomState) {
            case STATE_ROOM_WAITING:
                statusText.innerHTML = TEXT_STATUS_WAIT;
                break;
            case STATE_ROOM_CONTINUE:
                statusText.innerHTML = TEXT_STATUS_CONTINUE;
                break;
        }
    }

    function endGame() {
        infoText.innerHTML = INFO_TEXT_REMATCH;
        infoText.style.visibility = 'visible';
        rematch = false;
    }

    function startGame() {
        infoText.style.visibility = 'hidden';
    }

    socket.on('load_data_client', function(data) {
        console.log("DATA LOADED FROM SERVER: ");
        console.log(data);
        // implement to process data from the server
        onLoad(data);
    });

    // call this function to load game data from the server
    function loadData() {
        console.log("REQUESTING DATA LOAD FROM SERVER...");
        socket.emit('load_data_server');
    }

    // call this to update game update
    function sendData(data) {
        console.log("SENDING DATA TO SERVER")
        socket.emit('send_data_server', data);
    }

    // call this to send a simple signal to the other user
    function sendSignal(signal) {
        socket.emit('send_signal_server', signal)
    }

    // call to send rematch offers
    function sendRematch() {
        roomState = STATE_ROOM_WAITING;
        rematch = true;
        infoText.innerHTML = INFO_TEXT_REMATCH_WAIT;
        sendSignal(SIGNAL_REMATCH);
    }

    // handler for signals
    socket.on('send_signal_client', function(player, signal) {
        console.log("RECIEVED SIGNAL " + signal + " FROM USER " + player)
        switch (signal) {
            // handler for signal sent by new users to the room
            case SIGNAL_CONNECTED:
                opponentConnected = true;
                roomState = STATE_ROOM_CONTINUE;
                setRoomStatus();
                sendSignal(SIGNAL_IN_ROOM)
                onJoin();
                break;
            // handler for signal response from users already in room
            case SIGNAL_IN_ROOM:
                opponentConnected = true;
                roomState = STATE_ROOM_CONTINUE
                setRoomStatus();
                onJoin();
                break;
            // handler for signal sent by users that leave the room
            case SIGNAL_DISCONNECTED:
                opponentConnected = false;
                roomState = STATE_ROOM_WAITING;
                setRoomStatus();
                onLeave();
                break;
            // handler for rematch request signals
            case SIGNAL_REMATCH:
                if (rematch) {
                    roomState = STATE_ROOM_CONTINUE;
                    setRoomStatus();
                    sendData({reset: true});
                }
                break;     
            default:
                // implement to handle self implemented signals
                onSignal(player, signal);
                break;
        }
    });