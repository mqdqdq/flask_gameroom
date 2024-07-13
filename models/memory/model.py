from models.memory.constants import STATE_CONTINUE, STATE_PAUSE, STATE_FINISHED
from models.memory.constants import CARD_N, PLAYER_1, PLAYER_2
import random
from models.game import Game

class Card():
    def __init__(self, id, name):
        self.id = id
        self.name = name
        self.open = 0
        self.selected = 0

    def __dict__(self):
        return {'id': self.id, 
                'name': self.name, 
                'open': self.open, 
                'selected': self.selected}


class Memory(Game):
    def __init__(self):
        self.set_deck()
        self.player_start = PLAYER_2
        self.new_game()

    def set_deck(self):
        self.deck = []
        names = [m for m in range(CARD_N // 2)] * 2
        random.shuffle(names)
        for id in range(CARD_N):
            name = names.pop()
            self.deck.append(Card(id, name).__dict__())
            
    def new_game(self):
        self.state = STATE_CONTINUE
        self.set_deck()
        self.player_start = PLAYER_1 if self.player_start == PLAYER_2 else PLAYER_2
        self.turn = self.player_start
        self.score_1 = 0
        self.score_2 = 0
        self.round = 0

    def __dict__(self):
        attributes = ['round', 'deck', 'player_start', 'state', 'turn', 'score_1', 'score_2']
        return super().__dict__(attributes)

    def user_input(self, data: dict) -> bool:
        print(data)
        reset = data.get('reset')
        unpause = data.get('unpause')
        player = data.get('player')
        try:
            if reset and self.state == STATE_FINISHED:
                self.new_game()
                return True
            elif unpause and self.state == STATE_PAUSE:
                    self.state = STATE_CONTINUE
                    self.reset_select()
                    self.next_turn()
                    return True
            elif self.is_player_turn(player) and self.state == STATE_CONTINUE:
                    id = data.get('move')
                    self.open_card(id)
                    return True
            else:
                raise Exception()
        except Exception as ex:
            print(f"Model error: {ex}")
            return False
        
    def is_player_turn(self, player):
        return player == self.turn
    
    def game_is_over(self):
        total_score = self.score_1 + self.score_2
        return (total_score >= CARD_N / 2)

    def open_card(self, id):
        card = self.get_card(id)
        card['selected'] = 1
        selected_cards = self.get_selected_cards()
        if len(selected_cards) >= 2:
            card_a, card_b = selected_cards
            self.evaluate(card_a, card_b)
    
    def get_card(self, id) -> dict:
        for card in self.deck:
            card_id = card['id']
            if card_id == id:
                return card
        return None

    def reset_select(self):
        for card in self.deck:
            card['selected'] = 0

    def get_selected_cards(self):
        selected_cards = []
        for card in self.deck:
            if card['selected'] == 1:
                selected_cards.append(card)
        return selected_cards

    def evaluate(self, card_a: dict, card_b: dict):
        if card_a['name'] == card_b['name']:
            card_a['open'] = 1
            card_b['open'] = 1
            self.score_point()
            self.reset_select()
            if self.game_is_over():
                self.state = STATE_FINISHED
        else:
            self.state = STATE_PAUSE
    
    def score_point(self):
        if self.turn == PLAYER_1:
            self.score_1 += 1
        elif self.turn == PLAYER_2:
            self.score_2 += 1
    
    def next_turn(self):
        self.round += 1
        self.turn = PLAYER_2 if self.turn == PLAYER_1 else PLAYER_1