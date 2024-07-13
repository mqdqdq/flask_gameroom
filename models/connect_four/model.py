from models.connect_four.constants import COLS_N, ROWS_N, COLOR_BLUE, COLOR_RED, REQUIRED_LINE
from models.connect_four.constants import STATE_DRAW, STATE_CONTINUE, PLAYER_1, PLAYER_2, STATE_FINISHED
from models.game import Game
    
class Logic():
    def __init__(self):
        pass

    def get_piece(self, board, col, row):
        for piece in board:
            if piece['col'] == col and piece['row'] == row:
                return piece
        return None
    
    def get_top_row(self, board, col):
        for row in range(ROWS_N - 1, -1, -1):
            if self.get_piece(board, col, row) == None:
                return row
        return None

    def col_is_free(self, board, col):
        return self.get_piece(board, col, 0) == None
    
    def has_spaces(self, board):
        return len(board) < COLS_N * ROWS_N
    
    def set_marks(self, lst):
        for p in lst:
            p['marked'] = 1
    
    def has_marked(self, board):
        for piece in board:
            if piece['marked'] == 1:
                return True
        return False
    
    def check_win(self, board, p: dict):
        lst_vertical = [p]
        lst_horizontal = [p]
        lst_diagonal_a = [p]
        lst_diagonal_b = [p]
        for n in [1, -1]:
            self.add_to_lst_recursive(board, p['color'], p['col'], p['row'], n, 0, lst_vertical)
            self.add_to_lst_recursive(board, p['color'], p['col'], p['row'], 0, n, lst_horizontal)  
            self.add_to_lst_recursive(board, p['color'], p['col'], p['row'], n, n, lst_diagonal_a)
            self.add_to_lst_recursive(board, p['color'], p['col'], p['row'], n * -1, n, lst_diagonal_b)
        for lst in [lst_vertical, lst_horizontal, lst_diagonal_a, lst_diagonal_b]:
            if len(lst) >= REQUIRED_LINE:
                self.set_marks(lst)

    def add_to_lst_recursive(self, board, color, prev_col, prev_row, add_col, add_row, lst: list):
        p = self.get_piece(board, prev_col + add_col, prev_row + add_row)
        if p != None and p['color'] == color:
            lst.append(p)
            self.add_to_lst_recursive(board, color, prev_col + add_col, prev_row + add_row, add_col, add_row, lst)


class Connect_Four(Game):
    def __init__(self):
        self.logic = Logic()
        self.start_player = PLAYER_2
        self.new_game()

    def new_game(self):
        self.start_player = PLAYER_2 if (self.start_player == PLAYER_1) else PLAYER_1
        self.turn = COLOR_RED
        self.board = []
        self.state = STATE_CONTINUE
            
    def user_input(self, data: dict) -> bool:
        try:
            reset = data.get('reset')
            player = data.get('player')
            if reset and self.state != STATE_CONTINUE:
                self.new_game()
                return True
            elif self.is_player_turn(player) and self.state == STATE_CONTINUE:
                self.make_move(data['col'])
                return True
            else:
                raise Exception()
        except Exception as ex:
            print(f"User input error: {ex}")
            return False
        
    def __dict__(self) -> dict:
        attributes = ['start_player', 'turn', 'board', 'state']
        return super().__dict__(attributes)

    def next_turn(self):
        self.turn = COLOR_BLUE if self.turn == COLOR_RED else COLOR_RED

    def is_player_turn(self, player):
        return ((self.start_player == player) and (self.turn == COLOR_RED)) or ((self.start_player != player) and (self.turn == COLOR_BLUE))

    def update_state(self):
        if self.logic.has_marked(self.board):
            self.state = STATE_FINISHED
        else:
            if not self.logic.has_spaces(self.board):
                self.state = STATE_DRAW

    def make_move(self, col):
        if self.logic.col_is_free(self.board, col):
            row = self.logic.get_top_row(self.board, col)
            p = {'col': col, 'row': row, 'color': self.turn, 'marked': 0}
            self.board.append(p)
            self.logic.check_win(self.board, p)
            self.update_state()
            self.next_turn()
        else:
            raise Exception('illegal move')
