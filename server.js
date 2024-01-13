const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');


const database = {
    users: [
        {
            id: "1",
            firstname: "John",
            password: "$2a$10$sSYqOsAtO9IXIJ6ECVfDwuGiaWVgUaog/7yBZ2.LD/rUFxrd.taBy", // pass123
            email: "john@company.com",
            entries: 0,
            joined: new Date()
        },
        {
            id: "2",
            firstname: "Sally",
            password: "$2a$10$bWTGGrb6PNz1DjNLk5gIueSoSwSE1m81Cud2mGm3ZEpW37yrxagja", // jkdf123
            email: "sally@company.com",
            entries: 0,
            joined: new Date()
        },
        {
            id: "3",
            firstname: "Ken",
            password: "$2a$10$zfyxqgg5bYA7eEk0p7qK8.mCmzQjSuCLwvCkS8hRnmZlAQYIZms4q", // 7g43kdf 
            email: "ken@company.com",
            entries: 0,
            joined: new Date()
        }
    ],
    login: {
        id: "21",
        hash: '',
        email: "john@company.com"
    }
}
const app = express();
app.use(bodyParser.json());

app.get('/', (req,res)=> {
    res.send(database.users);
})
app.post('/signin', (req,res) => {
    const { email, password } = req.body;
    const foundUser = database.users.find(user => (user.email === email && bcrypt.compareSync(password, user.password)));

    if (foundUser) {
        res.json('signed in!');
    } else {
        res.status(400).json('error logging in');
    }
});

app.post('/register', (req, res) => {
    const { firstname, password, email } = req.body;
    database.users.push({
        id: "4",
        firstname: firstname,
        email: email,
        entries: 0,
        joined: new Date()
    });
    const newUser = database.users[database.users.length-1];
    const hash = bcrypt.hashSync(password, 10);
    newUser.password = hash;
    res.json(newUser);
})

app.get('/profile/:id', (req, res) => {
    const { id } = req.params;
    const foundUser = database.users.find(user => (user.id === id));
    if (foundUser) {
        res.json(foundUser);
    } else {
        res.status(404).json('no such user');
    }
});

app.put('/image', (req,res) => {
    const { id } = req.body;
    const foundUserIdx = database.users.findIndex(user => (user.id === id));
    if (foundUserIdx>-1) {
        database.users[foundUserIdx].entries += 1;
        res.json(database.users[foundUserIdx]);
    } else {
        res.status(404).json('no such user');
    }
});

app.listen(3001, ()=> {
    console.log('my-face-recognition-api is running on port 3001');
})

