This is NodeJS backend for an application named "my-face-recognition"
https://github.com/MFarkha/my-face-recognition

Description of API:
/signin - POST success/fail
/register - POST new user/fail
/profile/:id - GET user/fail
/image - PUT  updated user info/ fail

How to start a server:
- "npm start". (if you have set up a Postgres database)
- docker-compose up --build (you have to have Docker installed, no database setup though required)
- docker-compose down (to remove the containers)

Required steps before:
1. Database based on POSTGRES (or any other relational database compatible with knex.js sql builder module) - might be deployed for you (check 'deployment-*' directories).
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
DB_SSL_DISABLED= set this variable up if you DO NOT want to connect via SSL only self-signed DB (like AWS RDS Postgres)
REDIS_HOST=redis
REDIS_PORT=6379

2. Clarifai AI face detection service
You need to provide the information for the model (https://clarifai.com/clarifai/main/models/face-detection) to work.
Create/modify ".env" file (or AWS Secret):
CLARIFAI_PAT=your pat
CLARIFAI_USER_ID=your user id
CLARIFAI_APP_ID=your app id

3. Container runtime compute platform (like AWS EKS or AWS ECS) - might be deployed for you: just check 'deployment-*' directories::
Hint: leverage 'buildspec.yaml' located at the root of the application to configure AWS CodeBuild project to build and push a docker image into Docker Hub registry. You would need to create a secret to contain Docker Hub login credentials.

4. The rest of environment variables are (with its default values):
APP_PORT=3001 - application port to listen for requests
APP_DEBUG=undefined - application and db errors are set to be displayed
APP_INIT=undefined () - db schema would be created (see above)
APP_JWT_SECRET - secret for jwt tokens

5. There is a AWS lambda function at the directory ./deployment-AWS_CDK_Lambda to be deployed as well.
Use instructions from its README.md file. REACT_APP_LAMBDA_UL variable should be set on a frontend part of the application (see above the github link of it) once you deployed the lambda function (there will be output value of Cloudformation stack).