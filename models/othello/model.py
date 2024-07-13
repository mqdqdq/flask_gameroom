from models.othello.constants import PLAYER_1, PLAYER_2
from models.othello.constants import STATE_CONTINUE, STATE_FINISHED, STATE_SKIP
from models.othello.constants import BOARD_HEIGHT, BOARD_WIDTH
from models.othello.constants import TURN_DARK, TURN_LIGHT
from models.game import Game
import ast

class Othello(Game):
    def __init__(self):
        self.start_player = PLAYER_2
        self.new_game()

    def new_game(self):
        self.start_player = PLAYER_2 if (self.start_player == PLAYER_1) else PLAYER_1
        self.disks = dict()
        self.flip_lists = dict()
        self.turn = TURN_DARK
        self.create_start_position()
        self.create_flip_lists()
        self.state = STATE_CONTINUE

    def is_player_turn(self, player):
        return ((self.turn == TURN_DARK) and (self.start_player == player)) or ((self.turn == TURN_LIGHT) and (self.start_player != player))

    def user_input(self, data: dict) -> bool:
        try:
            reset = data.get('reset')
            if reset and (self.state == STATE_FINISHED):
                self.new_game()
                return True
            else:
                player = data.get('player')
                if self.is_player_turn(player):
                    self.make_move((data['col'], data['row']))
                    return True
            raise Exception()
        except Exception as ex:
            print(f"User input error: {ex}")
            return False

    def get_content(self) -> dict:
        content = dict()

        # tuples cannot be used for json format, to simplify everything is converted to strings
        disks = dict()
        for position, color in self.disks.items():
            disks[str(position)] = color
        content['disks'] = disks

        # tuples cannot be used for json format, to simplify everything is converted to strings
        flip_lists = dict()
        for from_position, to_positions in self.flip_lists.items():
            flip_lists[str(from_position)] = str(to_positions)
        content['flip_lists'] = flip_lists

        content['turn'] = self.turn
        content['state'] = self.state
        content['start_player'] = self.start_player
        return content

    def apply_content(self, content):
        # converting back to tuples by using ast
        self.disks = dict()
        for key, item in content['disks'].items():
            self.disks[ast.literal_eval(key)] = item

        # converting back to tuples by using ast
        self.flip_lists = dict()
        for key, item in content['flip_lists'].items():
            self.flip_lists[ast.literal_eval(key)] = ast.literal_eval(item)

        self.turn = content['turn']
        self.state = content['state']
        self.start_player = content['start_player']
    
    def create_start_position(self):
        self.disks[(3, 3)] = TURN_LIGHT
        self.disks[(4, 4)] = TURN_LIGHT
        self.disks[(4, 3)] = TURN_DARK
        self.disks[(3, 4)] = TURN_DARK

    def create_flip_lists(self):
        self.flip_lists = dict()
        for col in range(BOARD_WIDTH):
            for row in range(BOARD_HEIGHT):
                flip_list = self.flip_lists[(col, row)] = []
                if (col, row) not in self.disks.keys():
                    positions = [(col_inc, row_inc) for col_inc in range(-1, 2) for row_inc in range(-1, 2)]
                    positions.remove((0, 0))
                    for position in positions:
                        self.add_disk_to_flip_list(col, row, flip_list, [], position[0], position[1])
        
    def add_disk_to_flip_list(self, prev_x, prev_y, flip_list: list, temp_list: list, x_inc, y_inc):
        position = (prev_x + x_inc, prev_y + y_inc)
        if position[0] in range(0, 8) and position[1] in range(0, 8):
            if position in self.disks.keys():
                disk = self.disks[position]
                if disk == self.turn:
                    flip_list.extend(temp_list)
                else:
                    temp_list.append(position)
                    self.add_disk_to_flip_list(position[0], position[1], flip_list, temp_list, x_inc, y_inc)
                    
    def make_move(self, position):
        self.flip_list : dict
        flip_list = self.flip_lists.get(position)
        if flip_list and len(flip_list) > 0:
            self.disks[position] = self.turn
            for disk in flip_list:
                self.disks[disk] = self.turn
            self.next_turn()
        else:
            raise Exception('illegal move')
        
    def next_turn(self):
        self.turn = TURN_DARK if self.turn == TURN_LIGHT else TURN_LIGHT
        self.create_flip_lists()
        if not self.has_moves():
            if self.state == STATE_SKIP:
                self.state = STATE_FINISHED
                return
            else:
                self.state = STATE_SKIP
                self.next_turn()
                return
        self.state = STATE_CONTINUE
                
    def has_moves(self):
        for pos in self.flip_lists.keys():
            if len(self.flip_lists[pos]) > 0:
                return True
        return False