from flask import Blueprint, render_template, request, redirect, url_for, session, flash
from database.db import Db
from werkzeug.security import generate_password_hash, check_password_hash
from games import get_game, get_game_selects
from models.game import Game

views_bp = Blueprint("views", __name__, template_folder = "templates")

@views_bp.route('/', methods=["GET", "POST"])
def create_room():
    if request.method == 'POST':
        game_type = request.form['gametype']
        password = request.form['password']
        game: Game = get_game(game_type)
        game_content = game.get_content()
        with Db() as db:
            room_id = db.add_room(generate_password_hash(password), game_type, game_content)
            db.add_user(room_id)
        if room_id:
            session['room_id'] = room_id
            session['player'] = 1
            return redirect(url_for('views.join_room', room_id=room_id))
        else:
            flash("Could not create a room, please try again later", "error")
    return render_template('create_room.html', games=get_game_selects())
    

@views_bp.route('/join/<string:room_id>', methods=["GET", "POST"])
def join_room(room_id):
    with Db() as db:
        room = db.get_room(room_id)
    if room:
        saved_room_id = session.get('room_id')
        game_type = room['game_type']
        if saved_room_id == room_id:
            return render_template("game.html", game_type = game_type)
        else:
            room_closed = room['room_closed']
            password_hash = room['password_hash']
            if request.method == 'POST':
                password = request.form['password']
                if bool(room_closed):
                    flash('This room is closed', "info")
                else:  
                    if check_password_hash(password_hash, password):
                        users_joined = room['users_joined']
                        max_users = room['users_max']
                        with Db() as db:
                            db.add_user(room_id)
                            if (users_joined + 1) >= max_users:
                                db.close_room(room_id)
                        session['room_id'] = room_id
                        session['player'] = (users_joined + 1)
                        return render_template("game.html", game_type = game_type)
                    else:
                        flash("Password is not correct. Try again", "info")
        return render_template('join_room.html')
    else:
        return render_template('invalid_room.html')

