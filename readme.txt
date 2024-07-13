DOCUMENTATION

The following is a flask application that uses socketIO to create a simple game room website. 
The following games are available:
- TicTacToe
- Four in a row
- Memory
- Othello

Following features are available:
- password protected rooms, that locks when exceeding max users limit.
- gametype selection for rooms, allowing different games.
- a system for a base game template that can be used to implement more games more easily.
- persistent login and saving of data, users can return to the room without having their data erased.
- verification of user input by using models. protects against cheating and data manipulation.


FILES AND FOLDER STRUCTURE 
- sockets.py
Cntains all the socket routes and their methods.

- views.py
Contains all the views and their methods.

- templates/
Contains all the site templates. this includes login_room, create_room, error_room.
The template loaded for each game should be placed under templates/games.

- models/<gametype>
Contains the python files for the models.

- static/styles/
Contains all the css files.

- static/scripts/<gametype>
Should contain all the appropriate scripts used for creating the views for the games.

- requirements.txt
Contains the modules required to run the app.

- app.py
Contains what is needed to set up the app.

- db/db.py
Contains all the relevant database operations.

- db/init_db.py
Contains a script to be run to initiate the database.

- db/schema.sql
Contains the schema for the database.

- games.py
Contains methods used to simplify processing the games when there are different gametypes, as well as processing user input for the games.


DATABASE AND DATABASE OPERATIONS
tables:
- rooms contains all data relevant for storing a room, with properties:
    room_id  // a 6 character random generated key
    password_hash // a hashed value used for the password
    game_content // whatever is needed to save and load the game for the user is stored in the game_content
    game_type // the type of game in the room
    locked // 1 or 0, where 1 indicates that the room is closed and more players cannot join
    users_joined  // starting at 0, increments each time a new user joins the room. Also used to set <session.player_id>
    users_max // a constant indiciating the size of the room. when it is exceeded the room closes


operations:
- add_room() // adds a room to the database, returns the room_id
- get_room(room_id) // retrieve data for a room with room_id
- get_all_rooms() // retrieve all data for all rooms
- add_user(room_id) // add a user to the room
- lock_room(room_id) // lock the room
- set_game_content(room_id, game_content) // update the game_content for the room
- get_game_content(room_id) // retrieve the game_content for the room
- get_game_type(room_id) // retrieve the game_type for the room


ROUTES
the follwoing routes are used in the app:

- / 
the home page. contains a simple create form, as well as a table showing all the open rooms.

- /room/<room_id>
This route loads either a login page for a room or the game template (if the room is locked).




GAMES
Games are uses models (files under models/<gametype>) and as game_content (json type) which is stored in the database.
game_content is updated by processing new data from client sent with sendData().
How the data affects the model and the resulting updated game_content is determined in games.py -> get_updated_game_content.
For each game there should be appropriate converters between models and game_content. models are never stored as is, only retrieved and used on saved game_content.
A fresh game_content should be provided by games.py -> get_game_content.

- A new entry in a returning dict must be added to games.py -> get_game_list. This is used to create select options in create_room.html.
The key should be the name of the template, value should be the text in the select field.

- How the game is implemented is up to the developer, but base_game.html can be included to simplify the process.
It exposes the following variables:

<PLAYER> // the player number
<ROOM_ID> // the room id

It exposes the following functions:
loadData() // this loads data set for this game from the database
sendData(data) // this transmits data for this game in the database
sendSignal(signal) // this sends a simple signal to all other connecting clients

The following functions must be implemented:
onLoad(data) // is called when data is loaded from the database (called by loadData())
onSignal(player, signal) // is called when a signal is recieved from another client, with player number and signal as arguments.
onJoin(player) and onLeave(player) // is called when a player leave or joins the room, with player number as argument.


