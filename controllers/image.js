const handleImage = (req, res, db) => {
    const { id } = req.body;
    db('users').returning('entries').where('id', id).increment('entries', 1)
    .then(data => {
        res.json(data[0].entries);
    })
    .catch(err => {
        res.status(400).json('error updating entries attribute');
    })
};

module.exports = {
    handleImage: handleImage
};