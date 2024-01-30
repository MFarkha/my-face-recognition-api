BEGIN TRANSACTION;

CREATE TABLE users (
    id serial PRIMARY KEY,
    firstname VARCHAR(100),
    email TEXT UNIQUE NOT NULL,
    age INTEGER,
    pet VARCHAR(100),
    entries BIGINT DEFAULT 0,
    joined TIMESTAMP NOT NULL
);

COMMIT;
