Description of API:
/signin - POST success/fail
/register - POST new user/fail
/profile/:id - GET user/fail
/image - PUT  updated user info/ fail

How to start a server:
"npm start"

DATABASE based on POSTGRES-SQL
<!--
createdb 'smart-brain'
 -->
type 'psql' to execute these sql commands:

<!--
CREATE TABLE users (id serial PRIMARY KEY, name VARCHAR(100), email TEXT UNIQUE NOT NULL, entries BIGINT DEFAULT 0, joined TIMESTAMP NOT NULL);
CREATE TABLE login (id serial PRIMARY KEY, hash VARCHAR(100), email TEXT UNIQUE NOT NULL);
-->

SQL builder (node.js module) is knex.js (along with 'pg' module for database access from nodejs)