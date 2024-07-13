const PLAYER_1 = 1
const PLAYER_2 = 2

const CARD_N = 24

const STATE_PAUSE = "PAUSE"
const STATE_CONTINUE = "CONTINUE"
const STATE_FINISHED = "FINISHED"

const STATUS_WIN = "You won"
const STATUS_LOSE = "You lost"
const STATUS_PLAYER = "Turn: You"
const STATUS_OPPONENT = "Turn: Opponent"
const STATUS_WAIT = "Waiting"
const STATUS_DRAW = "Draw"

const CARD_SYMBOLS = ['ᴥ', '❤', '♣', '■', '△', '☆', '▽', '✧', 'X', '□', '●', '▒']
const CARD_COLORS = ['blue', 'white', 'orange', 'white', 'white', 'red', 'white', 'red', 'white', 'orange', 'pink', 'green']
const SYMBOL_COLORS = ['white', 'red', 'black', 'yellow', 'black', 'black', 'black', 'black', 'black', 'pink', 'white', 'black']

const CARDS = [
    {symbol: 'ᴥ', frameColor: 'white', cardColor: 'white', symbolColor: 'blue'}, 
    {symbol: '❤', frameColor: 'white', cardColor: 'black', symbolColor: 'red'},
    {symbol: '♣', frameColor: 'orange', cardColor: 'orange', symbolColor: 'black'},
    {symbol: '■', frameColor: 'red', cardColor: 'black', symbolColor: 'red'},
    {symbol: '♯', frameColor: 'white', cardColor: 'white', symbolColor: 'white'},
    {symbol: '☆', frameColor: 'yellow', cardColor: 'white', symbolColor: 'yellow'},
    {symbol: '✧', frameColor: 'pink', cardColor: 'white', symbolColor: 'pink'},
    {symbol: 'X', frameColor: 'red', cardColor: 'black', symbolColor: 'red'},
    {symbol: '●', frameColor: 'green', cardColor: 'white', symbolColor: 'green'},
    {symbol: '▒', frameColor: 'white', cardColor: 'black', symbolColor: 'green'},
    {symbol: '◬', frameColor: 'blue', cardColor: 'blue', symbolColor: 'pink'},
    {symbol: '◈', frameColor: 'cyan', cardColor: 'red', symbolColor: 'cyan'}
]