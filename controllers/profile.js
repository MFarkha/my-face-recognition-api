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
        }
        res.status(400).json('error getting user');
    })
};
const handleProfileUpdate = (req, res, db) => {
    const { id } = req.params;
    const { firstname, age, pet } = req.body.formInput;
    db('users')
        .where({ id })
        .update({ firstname })
        .then(result => {
            if (result) {
                res.json('success');
            } else {
                res.status(400).json('unable to update');
            }
        })
        .catch(err => res.status(400).json('error updating the user'))
}

module.exports = {
    handleProfileGet,
    handleProfileUpdate
};