This is NodeJS backend for an application named "my-face-recognition"
https://github.com/MFarkha/my-face-recognition

Description of API:
/signin - POST success/fail
/register - POST new user/fail
/profile/:id - GET user/fail
/image - PUT  updated user info/ fail

How to start a server:
"npm start".

Required infrastructure (you might build it - look into deployment-* directories):
1. Database based on POSTGRES (or any other relational database compatible with knex.js sql builder module):
Options to create db schema:
- execute postgres commands manually:
createdb 'smart-brain' - to create postgres db
type 'psql' to execute these sql commands:
CREATE TABLE users (id serial PRIMARY KEY, firstname VARCHAR(100), email TEXT UNIQUE NOT NULL, entries BIGINT DEFAULT 0, joined TIMESTAMP NOT NULL);
CREATE TABLE login (id serial PRIMARY KEY, hash VARCHAR(100), email TEXT UNIQUE NOT NULL);
- run the application along with APP_INIT=1 variable to let it to create db schema
- ENV variables (to put into .env file):
DB_CLIENT=pg
DB_HOST=127.0.0.1
DB_PORT=5432
DB_USER=
DB_PASSWORD=
DB_DATABASE_NAME=smart-brain

2. Clarifai AI face detection service
You need to provide API KEY for the model (https://clarifai.com/clarifai/main/models/face-detection).
Create/modify ".env" file:
CLARIFAI_PAT=your pat
CLARIFAI_USER_ID=your user id
CLARIFAI_APP_ID=your app id

3. To prepare for the build:
Leverage 'buildspec.yaml' file located at the root of the application to configure AWS CodeBuild project to build and push a docker image into Docker Hub registry
You would need to create a secret to contain Docker Hub login credentials

4. The rest of environment variables are (with its default values):
APP_PORT=3001 - application port to listen for requests
APP_DEBUG=undefined - application and db errors are set to be displayed
APP_INIT=undefined () - db schema would be created (see above)
