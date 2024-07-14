const PLAYER_1 = 1
const PLAYER_2 = 2

const CARD_N = 24

const STATE_PAUSE = "PAUSE"
const STATE_CONTINUE = "CONTINUE"
const STATE_FINISHED = "FINISHED"

const STATUS_WIN = "You won"
const STATUS_LOSE = "You lost"
const STATUS_PLAYER = "Turn: you"
const STATUS_OPPONENT = "Turn: opponent"
const STATUS_WAIT = "Waiting"
const STATUS_DRAW = "Draw"

const CARD_SYMBOLS = ['ᴥ', '❤', '♣', '■', '△', '☆', '▽', '✧', 'X', '□', '●', '▒']
const CARD_COLORS = ['blue', 'white', 'orange', 'white', 'white', 'red', 'white', 'red', 'white', 'orange', 'pink', 'green']
const SYMBOL_COLORS = ['white', 'red', 'black', 'yellow', 'black', 'black', 'black', 'black', 'black', 'pink', 'white', 'black']

const CARDS = [
    {symbol: 'ᴥ', frameColor: "rgb(63, 103, 166)", cardColor: 'white', symbolColor: 'blue'}, 
    {symbol: '❤', frameColor: "red", cardColor: 'white', symbolColor: 'red'},
    {symbol: '♣', frameColor: "black", cardColor: 'orange', symbolColor: 'black'},
    {symbol: '■', frameColor: 'black', cardColor: 'white', symbolColor: 'black'},
    {symbol: '♯', frameColor: 'black', cardColor: 'white', symbolColor: 'purple'},
    {symbol: '☆', frameColor: 'black', cardColor: 'white', symbolColor: 'pink'},
    {symbol: '✧', frameColor: 'blue', cardColor: 'white', symbolColor: 'blue'},
    {symbol: '!', frameColor: 'black', cardColor: 'black', symbolColor: 'red'},
    {symbol: '●', frameColor: 'green', cardColor: 'white', symbolColor: 'green'},
    {symbol: '▒', frameColor: 'white', cardColor: 'black', symbolColor: 'green'},
    {symbol: '?', frameColor: 'blue', cardColor: 'blue', symbolColor: 'white'},
    {symbol: '◈', frameColor: 'white', cardColor: 'red', symbolColor: 'white'}
]