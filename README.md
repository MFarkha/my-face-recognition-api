Description of API:
/signin - POST success/fail
/register - POST new user/fail
/profile/:id - GET user/fail
/image - PUT  updated user info/ fail

How to start a server: "npm start".
Create .env file to put required variables for database and face detection service (see below).

Required infrastructure:
1. Database based on POSTGRES (or any other relational database compatible with knex.js sql builder module):
<!--
Example for postgres:

createdb 'smart-brain'
type 'psql' to execute these sql commands:

CREATE TABLE users (id serial PRIMARY KEY, name VARCHAR(100), email TEXT UNIQUE NOT NULL, entries BIGINT DEFAULT 0, joined TIMESTAMP NOT NULL);
CREATE TABLE login (id serial PRIMARY KEY, hash VARCHAR(100), email TEXT UNIQUE NOT NULL);

SQL builder (node.js module) is knex.js (along with 'pg' module for database access from nodejs)

Example for env variables (to put into .env file):

DB_CLIENT=pg
DB_HOST=127.0.0.1
DB_PORT=5432
DB_USER=
DB_PASSWORD=
DB_DATABASE_NAME=smart-brain

-->
2. Clarifai AI face detection service
You need to provide API KEY for the model (https://clarifai.com/clarifai/main/models/face-detection).
Create/modify ".env" file:
CLARIFAI_PAT=your pat
CLARIFAI_USER_ID=your user id
CLARIFAI_APP_ID=your app id