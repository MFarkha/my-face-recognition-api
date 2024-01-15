const setupClarifai = (imageUrl) => {
    const PAT = '8e814405291e431ab755b4e1a34acf90';
    // Specify the correct user_id/app_id pairings
    // Since you're making inferences outside your app's scope
    const USER_ID = 'famaten';
    const APP_ID = 'my-smart-brain-app';
    const MODEL_ID = 'face-detection';
    const IMAGE_URL = imageUrl;
    const raw = JSON.stringify({
      "user_app_id": {
          "user_id": USER_ID,
          "app_id": APP_ID
      },
      "inputs": [
          {
              "data": {
                  "image": {
                      "url": IMAGE_URL
                  }
              }
          }
      ]
    });
    const requestOptions = {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Authorization': 'Key ' + PAT
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
        // console.log(err);
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
        res.status(400).json('error updating entries attribute');
    })
};

module.exports = {
    handleImage: handleImage,
    handleApiCall: handleApiCall,
}