const handleProfileGet = (req, res, db) => {
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
        if (process.env.APP_DEBUG) {
            console.log('unable to select user info from db: ', err);
            console.log('ENV: ', process.env);
        }
        res.status(400).json('error getting user');
    })
};

module.exports = {
    handleProfileGet: handleProfileGet
};