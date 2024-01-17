const handleRegister = (req, res, db, bcrypt) => {
    const { firstname, password, email } = req.body;
    const hash = bcrypt.hashSync(password, 10);
    if (!firstname || !password || !email) {
        return res.status(400).json('incorrect form submission');
    }
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
        .catch(err => {
            trx.rollback();
            if (process.env.APP_DEBUG) {
                console.log('unable to commit insert transaction into db: ', err);
            }
            res.status(400).json('unable to register');
        })
    })
    .catch(err => {
        if (process.env.APP_DEBUG) {
            console.log('unable to execute DB transaction ', err);
        }
        res.status(400).json('unable to register');
    });

}

// export default handleRegister;
module.exports = {
    handleRegister: handleRegister
};