require('dotenv').config();
const {ClarifaiStub, grpc} = require("clarifai-nodejs-grpc");
const stub = ClarifaiStub.grpc();
const metadata = new grpc.Metadata();
metadata.set("authorization", `Key ${process.env.CLARIFAI_API_KEY}`);

const handleApiCall = (req, res) => {
    const { imageUrl } = req.body;
    stub.PostModelOutputs(
        {
            model_id: "face-detection",
            inputs: [{data: {image: {url: imageUrl}}}]
        },
        metadata,
        (err, response) => {
            if (err || response.status.code !== 10000) {
                // console.log("Error: " + err);
                // console.log("Received failed status: " + response.status.description + "\n" + response.status.details);
                res.status(400).json('error receiving api call from clarifai')
            } else {
                res.json(response);
            }
        }
    );
}

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
    handleImage: handleImage,
    handleApiCall: handleApiCall,
}