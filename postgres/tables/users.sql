BEGIN TRANSACTION;

CREATE TABLE users (
    id serial PRIMARY KEY,
    firstname VARCHAR(100),
    email TEXT UNIQUE NOT NULL,
    entries BIGINT DEFAULT 0,
    joined TIMESTAMP NOT NULL
);

COMMIT;
