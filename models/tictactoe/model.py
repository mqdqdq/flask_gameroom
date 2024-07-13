from models.tictactoe.constants import COLS_N, ROWS_N, PLAYER_1, PLAYER_2, SYMBOL_X, SYMBOL_O
from models.tictactoe.constants import STATE_CONTINUE, STATE_DRAW, STATE_FINISHED
from models.game import Game

class Logic():
    def get_cell(self, board, col, row):
        for cell in board:
            if row == cell['row'] and col == cell['col']:
                return cell
        return None
    
    def has_marked_cells(self, board):
        for cell in board:
            if cell['marked'] == 1:
                return True
        return False
    
    def has_spaces(self, board):
        return len(board) < COLS_N * ROWS_N
    
    def mark_vertical(self, board, symbol):
        for col in range(COLS_N):
            cells = []
            for row in range(ROWS_N):
                cell = self.get_cell(board, col, row)
                if cell != None and cell['symbol'] == symbol:
                    cells.append(cell)
                    if len(cells) >= 3:
                        self.set_marks(cells)
                else:
                    break
                
    def mark_horizontal(self, board, symbol):
        for row in range(ROWS_N):
            cells = []
            for col in range(COLS_N):
                cell = self.get_cell(board, col, row)
                if cell != None and cell['symbol'] == symbol:
                    cells.append(cell)
                    if len(cells) >= 3:
                        self.set_marks(cells)
                else:
                    break
                
    def mark_diagonal(self, board, symbol):
        cells = []
        for diag in range(ROWS_N):
            cell = self.get_cell(board, diag, diag)
            if cell != None and cell['symbol'] == symbol:
                cells.append(cell)
                if len(cells) >= 3:
                    self.set_marks(cells)
            else:
                break
        cells = []
        for diag in range(ROWS_N):
            cell = self.get_cell(board, diag, (ROWS_N - 1) - diag)
            if cell != None and cell['symbol'] == symbol:
                cells.append(cell)
                if len(cells) >= 3:
                    self.set_marks(cells)
            else:
                break

    def set_marks(self, cells):
        for cell in cells:
            cell['marked'] = 1

class TicTacToe(Game):
    def __init__(self, content = None):
        self.logic = Logic()
        self.start_player = PLAYER_1
        self.symbol = SYMBOL_X
        self.board = []
        self.state = STATE_CONTINUE
        if content:
            self.apply_content(content)

    def new_game(self):
        self.start_player = PLAYER_1 if (self.start_player == PLAYER_2) else PLAYER_2
        self.symbol = SYMBOL_X
        self.board = []
        self.state = STATE_CONTINUE
    
    def user_input(self, data: dict) -> bool:
        try:
            reset = data.get('reset')
            player = data.get('player')
            if reset and self.state in [STATE_FINISHED, STATE_DRAW]:
                self.new_game()
                return True
            elif self.is_player_turn(player) and self.state == STATE_CONTINUE:
                self.make_move(data['col'], data['row'], data['player'])
                return True
            else:
                raise Exception()
        except Exception as ex:
            print(f"User input error: {ex}")
            return False
        
    def __dict__(self) -> dict:
        attributes = ['start_player', 'symbol', 'board', 'state']
        return super().__dict__(attributes)

    def next_turn(self):
        self.symbol = SYMBOL_O if (self.symbol == SYMBOL_X) else SYMBOL_X

    def mark_wins(self):
        self.logic.mark_vertical(self.board, self.symbol)
        self.logic.mark_horizontal(self.board, self.symbol)
        self.logic.mark_diagonal(self.board, self.symbol)

    def is_player_turn(self, player):
        return (self.symbol == SYMBOL_X and player == self.start_player) or (self.symbol == SYMBOL_O and player != self.start_player)

    def make_move(self, col, row, player):
        cell = self.logic.get_cell(self.board, col, row)
        if cell != None or ((row < 0) or (row >= ROWS_N)) or ((col < 0) or (col >= COLS_N)):
            raise Exception("illegal move")
        else:
            self.board.append({'symbol': self.symbol, 'col': col, 'row': row, 'marked': 0})
            self.mark_wins()
            self.update_state()
            self.next_turn()
    
    def update_state(self):
        if self.logic.has_marked_cells(self.board):
            self.state = STATE_FINISHED
        else:
            if self.logic.has_spaces(self.board):
                self.state = STATE_CONTINUE
            else:
                self.state = STATE_DRAW