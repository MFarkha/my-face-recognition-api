const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const cors = require('cors');
const knex = require('knex')
const register = require('./controllers/register');
const signin = require('./controllers/signin');
const profile = require('./controllers/profile');
const image = require('./controllers/image');
// require('dotenv').config();

const db = knex ({
    client: process.env.DB_CLIENT,
    connection: {
      host : process.env.DB_HOST,
      port : process.env.DB_PORT,
      user : process.env.DB_USER,
      password : process.env.DB_PASSWORD,
      database : process.env.DB_DATABASE_NAME
    }
  });

const app = express();
app.use(bodyParser.json());
app.use(cors());

app.get('/', (req,res)=> {
    res.status(400).json('wrong route');
})

app.post('/signin', (req,res) => { signin.handleSignin(req, res, db, bcrypt) });

app.post('/register', (req, res) => { register.handleRegister(req, res, db, bcrypt) });

app.get('/profile/:id', (req, res) => { profile.handleProfileGet(req, res, db) });

app.put('/image', (req,res) => { image.handleImage(req, res, db) });

app.post('/imageurl', image.handleApiCall);

app.listen(3001, ()=> {
    console.log('The app my-face-recognition-api is running on port 3001');
})

