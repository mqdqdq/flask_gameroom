from models.game import Game

def get_game_selects() -> dict:
    return {'tictactoe': 'TicTacToe', 
            'connect_four': 'Connect Four',
            'othello': 'Othello',
            'memory': 'Memory'}

def get_game(game_type) -> Game:
    if game_type == 'tictactoe':
        from models.tictactoe.model import TicTacToe
        return TicTacToe()
    if game_type == 'connect_four':
        from models.connect_four.model import Connect_Four
        return Connect_Four()
    if game_type == 'othello':
        from models.othello.model import Othello
        return Othello()
    if game_type == "memory":
        from models.memory.model import Memory
        return Memory()