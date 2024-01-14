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
        res.status(400).json('error getting user');
    })
};

module.exports = {
    handleProfileGet: handleProfileGet
};