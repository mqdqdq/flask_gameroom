from flask_socketio import SocketIO, join_room, leave_room, emit
from flask import session
from database.db import Db
from games import get_game
from models.game import Game

socketio = SocketIO(manage_session=False)

SIGNAL_CONNECTED = 'CONNECTED'
SIGNAL_DISCONNECTED = 'DISCONNECTED'

# automatically called on by connecting users, send a signal to all users (not self)
@socketio.on("connect")
def user_join():
    room_id = session.get('room_id')
    player = session.get('player')
    if room_id:
        print(f"USER {player} CONNECTED TO ROOM")
        join_room(room=room_id)
        emit('send_signal_client', (player, SIGNAL_CONNECTED), to=room_id, include_self=False)


# automatically called on by disconnecting users, send a signal to all users (not self)
@socketio.on("disconnect")
def user_leave():
    room_id = session.get('room_id')
    player = session.get('player')
    if room_id:
        print(f"USER {player} DISCONNECTED FROM ROOM")
        emit('send_signal_client', (player, SIGNAL_DISCONNECTED), to=room_id, include_self=False)
        leave_room(room=room_id)


# handler for signals to server, simply send it back to all other clients (not self)
@socketio.on('send_signal_server')
def send_signal(signal):
    room_id = session.get('room_id')
    player = session.get('player')
    if room_id:
        emit('send_signal_client', (player, signal), to=room_id, include_self=False)


# handler for data requests from the server, returns it to the requesting client
@socketio.on('load_data_server')
def load_data():
    room_id = session.get('room_id')
    if room_id:
        with Db() as db:
            game_content = db.get_game_content(room_id)
            emit('load_data_client', game_content);


# handler for sending data to the server, verify and update the corresponding game content in the db.
# then return the game content to all users (including self)
@socketio.on('send_data_server')
def send_data(data):
    room_id = session.get('room_id')
    player = session.get('player')
    if room_id:
        with Db() as db:
            game_content = db.get_game_content(room_id)
            game_type = db.get_game_type(room_id)
        game: Game = get_game(game_type)
        data['player'] = player
        if game != None:
            game.apply_content(game_content)
            valid_input = game.user_input(data)
            if valid_input:
                updated_game_content = game.get_content()
                if updated_game_content != None:
                    with Db() as db:
                        db.set_game_content(room_id, updated_game_content)
                        updated_game_content = db.get_game_content(room_id)
                    emit('load_data_client', updated_game_content, to=room_id);