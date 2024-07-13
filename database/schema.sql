DROP TABLE IF EXISTS rooms;

CREATE TABLE IF NOT EXISTS rooms (
    room_id TEXT NOT NULL,
    password_hash TEXT NOT NULL,
    game_content JSON,
    game_type TEXT NOT NULL,
    room_closed INTEGER DEFAULT 0 NOT NULL,
    users_joined INTEGER DEFAULT 0 NOT NULL,
    users_max INTEGER DEFAULT 2 NOT NULL,
    PRIMARY KEY (room_id)
);