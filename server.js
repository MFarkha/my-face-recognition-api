const express = require('express');
const bcrypt = require('bcryptjs');
const cors = require('cors');
const register = require('./controllers/register');
const signin = require('./controllers/signin');
const profile = require('./controllers/profile');
const image = require('./controllers/image');
const initdb = require('./controllers/initdb');
const auth = require('./controllers/authorization');
const compression = require('compression');

// postgres
const knex = require('knex');
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
//to connect db via SSL only self-signed certificate (like at AWS RDS Postgres)
if (!process.env.DB_SSL_DISABLED) {
    dbConnection.ssl = { rejectUnauthorized: false };
}
const db = knex(dbConnection);

require('dotenv').config();

// express
const app = express();
app.use(express.json());
app.use(cors());
app.use(compression());

// debugging express
if (process.env.APP_DEBUG) {
  const morgan = require('morgan');
  app.use(morgan('combined'));
}

app.get('/', (req,res)=> {
  res.json('wrong route');
})

app.get('/api/health', (req,res)=> {
  res.json('OK');
})

app.post('/api/signin', (req,res) => { signin.signinAuthentification(req, res, db, bcrypt) });
app.get('/api/signout', auth.requireAuth, signin.handleSignOut);
app.post('/api/register', (req, res) => { register.handleRegister(req, res, db, bcrypt) });
app.get('/api/profile/:id', auth.requireAuth, (req, res) => { profile.handleProfileGet(req, res, db) });
app.post('/api/profile/:id', auth.requireAuth, (req, res) => { profile.handleProfileUpdate(req, res, db) });
app.put('/api/image', auth.requireAuth, (req,res) => { image.handleImage(req, res, db) });
app.post('/api/imageurl', auth.requireAuth, image.handleApiCall);

APP_PORT = process.env.APP_PORT || 3001;

if (process.env.APP_INIT) {
  initdb.createSchema(db);
} else {
  app.listen(APP_PORT, ()=> {
    console.log(`The my-face-recognition-api app is running on port ${APP_PORT}`);
  })
}