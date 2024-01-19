require('dotenv').config();

const setupClarifai = (imageUrl) => {
    const {CLARIFAI_PAT, CLARIFAI_USER_ID, CLARIFAI_APP_ID} = process.env;
    const MODEL_ID = 'face-detection';
    const raw = JSON.stringify({
      "user_app_id": {
          "user_id": CLARIFAI_USER_ID,
          "app_id": CLARIFAI_APP_ID
      },
      "inputs": [
          {
              "data": {
                  "image": {
                      "url": imageUrl
                  }
              }
          }
      ]
    });
    const requestOptions = {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Authorization': 'Key ' + CLARIFAI_PAT
        },
        body: raw
    };
    return [requestOptions, MODEL_ID]
}
const handleApiCall = (req, res) => {
    const { imageUrl } = req.body;
    const [OPTIONS, MODEL_ID] = setupClarifai(imageUrl);
    fetch("https://api.clarifai.com/v2/models/" + MODEL_ID + "/outputs", OPTIONS)
    .then(response => response.json())
    .then(data => {
        res.json(data);
    })
    .catch(err => {
        if (process.env.APP_DEBUG) {
            console.log('unable to receive api call from clarifai: ', err);
            console.log('ENV: ', process.env);
        }
        res.status(400).json('error receiving api call from clarifai');
    })
}

const handleImage = (req, res, db) => {
    const { id } = req.body;
    db('users').returning('entries').where('id', id).increment('entries', 1)
    .then(data => {
        res.json(data[0].entries);
    })
    .catch(err => {
        if (process.env.APP_DEBUG) {
            console.log('unable to update user info in db: ', err);
            console.log('ENV: ', process.env);
        }
        res.status(400).json('error updating entries attribute');
    })
};

module.exports = {
    handleImage: handleImage,
    handleApiCall: handleApiCall,
}