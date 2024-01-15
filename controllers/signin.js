const handleSignin = (req, res, db, bcrypt) => {
    const { email, password } = req.body;
    if (!password || !email) {
        return res.status(400).json('incorrect form submission');
    }
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
};

module.exports = {
    handleSignin: handleSignin
};