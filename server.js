const express = require('express');
const bcrypt = require('bcryptjs');
const cors = require('cors');
const knex = require('knex')
const register = require('./controllers/register');
const signin = require('./controllers/signin');
const profile = require('./controllers/profile');
const image = require('./controllers/image');
const initdb = require('./controllers/initdb');
require('dotenv').config();

let dbConnection = {
  client: process.env.DB_CLIENT,
  // acquireConnectionTimeout: 1000,
  pool: { min: 0, max: 7 },
  connection: {
    host : process.env.DB_HOST,
    port : process.env.DB_PORT,
    user : process.env.DB_USER,
    password : process.env.DB_PASSWORD,
    database : process.env.DB_DATABASE_NAME
  }
}
// required to connect SSL only self-signed DB (like AWS RDS Postgres)
if (!process.env.DB_SSL_DISABLED) {
  dbConnection.ssl = { rejectUnauthorized: false };
}

const db = knex(dbConnection);

const app = express();
app.use(express.json());

app.use(cors());

app.get('/', (req,res)=> {
  res.json('wrong route');
})

app.get('/api/health', (req,res)=> {
  res.json('OK');
})

app.post('/api/signin', (req,res) => { signin.handleSignin(req, res, db, bcrypt) });

app.post('/api/register', (req, res) => { register.handleRegister(req, res, db, bcrypt) });

app.get('/api/profile/:id', (req, res) => { profile.handleProfileGet(req, res, db) });

app.put('/api/image', (req,res) => { image.handleImage(req, res, db) });

app.post('/api/imageurl', image.handleApiCall);

APP_PORT = process.env.APP_PORT || 3001;

if (process.env.APP_INIT) {
  initdb.createSchema(db);
} else {
  app.listen(APP_PORT, ()=> {
    console.log(`The app my-face-recognition-api is running on port ${APP_PORT}`);
  })
}