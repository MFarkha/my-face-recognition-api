const { createSession } = require("./signin");

const handleRegister = (req, res, db, bcrypt) => {
    const { firstname, password, email } = req.body;
    const hash = bcrypt.hashSync(password, 10);
    if (!firstname || !password || !email) {
        return res.status(400).json('incorrect form submission');
    }
    return db.transaction(trx => {
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
                    return user[0].id && user[0].email ? createSession(user[0]) : Promise.reject(user[0]);
                })
                .then(session => res.json(session))
                .catch(err => {
                    if (process.env.APP_DEBUG) {
                        console.log('unable to create a user session: ', err);
                    }
                    return res.status(400).json(err)
                })
        })
        .then(trx.commit)
        .catch(err => {
            trx.rollback();
            if (process.env.APP_DEBUG) {
                console.log('unable to commit insert transaction into db: ', err);
            }
            return res.status(400).json('unable to register');
        })
    })
    .catch(err => {
        if (process.env.APP_DEBUG) {
            console.log('unable to execute DB transaction ', err);
        }
        return res.status(400).json('unable to register');
    });

}

module.exports = {
    handleRegister: handleRegister
};