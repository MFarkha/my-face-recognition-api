require('dotenv').config();
const jwt = require('jsonwebtoken');
// redis
const { createClient } = require("redis");
const redis = createClient({ socket: {
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT
} });

const handleSignin = (req, res, db, bcrypt) => {
    const { email, password } = req.body;
    if (!password || !email) {
        return Promise.reject('incorrect form submission');
    }
    return db.select('hash').from('login').where('email', email)
    .then(data => {
        const isValidUser = bcrypt.compareSync(password, data[0].hash);
        if (isValidUser) {
            return db.where('email', email).select('*').from('users')
                .then(user => user[0])
                .catch(err => {
                    if (process.env.APP_DEBUG) {
                        console.log('unable to select from DB: ', err);
                    }
                    return Promise.reject('unable to retrieve credentials');
                })
        } else {
            return Promise.reject('wrong credentials');
        }
    })
    .catch(err => {
        if (process.env.APP_DEBUG) {
            console.log('unable to select from DB: ', err);
        }
        res.status(400).json('error getting user');
    })
};
const getAuthTokenId = (token) => {
    return redis
        .on('error', err => console.log('Redis Client Error: ', err))
        .connect()
        .then(redisClient => {
            return redisClient.get(token)
                .then(id => {
                    if (process.env.APP_DEBUG) {
                        console.log('getAuthTokenId-step 1: Redis get key result: ', id);
                    }
                    return redisClient.quit()
                        .then( () => id )
                        .catch((err) => console.log(err));
                })
                .catch(err => console.log(err))
        });
}

const setToken = (token, id) => {
    return redis
        .on('error', err => console.log('Redis Client Error', err))
        .connect()
        .then(redisClient => {
            return redisClient.set(token, id)
                .then(result => {
                    if (process.env.APP_DEBUG) {
                        console.log('Redis set key result: ', result);
                    }
                    return redisClient.quit()
                        .catch(console.log);
                })
                .catch(err => console.log(err))
        });
}


const createSession = (user) => {
    const { email, id } = user;
    const token = signToken(email);
    return setToken(token, id)
        .then(() => ({ success: 'true', userId: id, token }))
        .catch((err) => console.log('error setting a token:', err));
}

const signToken = (email) => {
    const jwtPayload = { email };
    return jwt.sign(jwtPayload, process.env.APP_JWT_SECRET, { expiresIn: '2days' });
}

const signinAuthentification = (req, res, db, bcrypt) => {
    const { authorization } = req.headers;
    return authorization
        ? getAuthTokenId(authorization.split(' ')[1])
            .then(id => {
                if (id) {
                    if (process.env.APP_DEBUG) {
                        console.log('signinAuthentification: Id received successfully: ', id)
                    }
                    return res.json({ success: 'true', userId: id });
                } else {
                    if (process.env.APP_DEBUG) {
                        console.log('Error getting an id from the token: ', id)
                    }
                    return res.status(400).json('Unathorized');
                }
            })
            .catch(err => res.status(400).json(err))
        : handleSignin(req, res, db, bcrypt)
            .then(user => {
                return user.id && user.email ? createSession(user) : Promise.reject(user);
            })
            .then(session => res.json(session))
            .catch(err => {
                if (process.env.APP_DEBUG) {
                    console.log('Error during signin process: ', err)
                }
                return res.status(400).json(err);
            })
}
const deleteToken = (token) => {
    return redis
        .on('error', err => console.log('Redis Client Error', err))
        .connect()
        .then(redisClient => {
            return redisClient.del(token)
                .then(result => {
                    if (process.env.APP_DEBUG) {
                        console.log('Redis delete key result: ', result);
                    }
                    return redisClient.quit()
                        .catch(console.log);
                })
                .catch(err => console.log(err))
        });
}
const handleSignOut = (req, res) => {
    const { authorization } = req.headers;
    if (authorization){
        return deleteToken(authorization.split(' ')[1])
            .then((result) => res.json({ 'success': result }))
            .catch((err) => res.status(400).json('Sign out error:', err))
    }
    return res.status(401).json('Unauthorized');
}
module.exports = {
    signinAuthentification,
    getAuthTokenId,
    createSession,
    handleSignOut
};