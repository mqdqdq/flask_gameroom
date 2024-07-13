from flask import Flask
from views import views_bp
from flask_session import Session

from sockets import socketio
import secrets

app = Flask(__name__)
app.config['SECRET_KEY'] = secrets.token_urlsafe(16)
app.config['SESSION_TYPE'] = 'filesystem'
app.register_blueprint(views_bp)
Session(app)
socketio.init_app(app)