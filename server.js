const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const cors = require('cors');
const knex = require('knex')
const db = knex ({
    client: 'pg',
    connection: {
      host : '127.0.0.1',
      port : 5432,
      user : '',
      password : '',
      database : 'smart-brain'
    }
  });

const app = express();
app.use(bodyParser.json());
app.use(cors());

app.get('/', (req,res)=> {
    res.status(400).json('wrong route');
})

app.post('/signin', (req,res) => {
    const { email, password } = req.body;
    db.select('hash').from('login').where('email', email)
    .then(data => {
        const isValidUser = bcrypt.compareSync(password, data[0].hash);
        if (isValidUser) {
            db.where('email', email).select('*').from('users')
            .then(user => {
                if (user.length) {
                    res.json(user[0]);
                } else {
                    res.status(400).json('no such user');
                }
            })
            .catch(err => {
                res.status(400).json('error getting user');
            })
        } else {
            res.status(400).json('wrong credentials');
        }
    })
    .catch(err => {
        res.status(400).json('wrong credentials');
    })
});

app.post('/register', (req, res) => {
    const { firstname, password, email } = req.body;
    const hash = bcrypt.hashSync(password, 10);

    db.transaction(trx => {
        trx.insert({
            hash: hash,
            email: email
        })
        .into('login')
        .returning('email')
        .then(data => {
            return trx('users').returning('*').insert({
                firstname: firstname,
                email: data[0].email,
                entries: 0,
                joined: new Date()
            })
            .then(user => {
                res.json(user[0]);
            })
        })
        .then(trx.commit)
        .catch(trx.rollback)
    })
    .catch(err => {
        res.status(400).json('unable to register');
    });


})

app.get('/profile/:id', (req, res) => {
    const { id } = req.params;
    db.where('id', id).select('*').from('users')
    .then(user => {
        if (user.length) {
            res.json(user[0]);
        } else {
            res.status(400).json('no such user');
        }
    })
    .catch(err => {
        res.status(400).json('error getting user');
    })
});

app.put('/image', (req,res) => {
    const { id } = req.body;
    db('users').returning('entries').where('id', id).increment('entries', 1)
    .then(data => {
        res.json(data[0].entries);
    })
    .catch(err => {
        res.status(400).json('error updating entries attribute');
    })
});

app.listen(3001, ()=> {
    console.log('The app my-face-recognition-api is running on port 3001');
})

