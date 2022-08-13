const { stringify } = require('querystring');
var request = require('request'); // "Request" library
var SpotifyWebApi = require('spotify-web-api-node');
const express = require('express');
const { resolve } = require('path');
const { rejects } = require('assert');
var cors = require('cors')
const { CLIENT_ID, CLIENT_SECRET, SERVER_PORT, YT_APP_KEY } = require('./CONFIG')

const app = express()
app.use(cors());

const port = SERVER_PORT

// const Spotify = require('spotify-web-api-js');


const client_id = CLIENT_ID; // Your client id
const client_secret = CLIENT_SECRET; // Your secret
var spotifyApi = new SpotifyWebApi();

const GetYTURLFromSearchStr = async (searchString) => {
    return new Promise((resolve, reject) => {
    let videoURL;
    parameters = {
        part: 'snippet',
        key: YT_APP_KEY,
        type: 'video',
        order: 'relevance',
        q: searchString
    }

    options = {
        url: 'https://www.googleapis.com/youtube/v3/search?' + stringify(parameters, '&')
    }

    request.get(options, function (error, response, body) {
        if(!error){
            let videoId = JSON.parse(body).items[0].id.videoId;
            videoURL = "https://youtube.com/watch?v=" + videoId;
            resolve(videoURL);
        }
        else {reject(error);}
        })
    });
}


const AuthSpotify = async (client_id, client_secret) => {
    return new Promise((resolve, reject) => {
        let authOptions = {
            url: 'https://accounts.spotify.com/api/token',
            headers: {
                'Authorization': 'Basic ' + (new Buffer.from(client_id + ':' + client_secret).toString('base64'))
            },
            form: {
                grant_type: 'client_credentials'
            },
            json: true
        };

        request.post(authOptions, function (error, response, body) {

            if (!error) {
                let token = body.access_token;
                spotifyApi.setAccessToken(token);
                resolve();
            }

            else {
                reject(error);
            }
        });

    });

}


const GetTrackInfo = (trackId) => {

    return new Promise((resolve, reject) => {
        spotifyApi.getTrack(trackId).then((data) => {
            var body = data.body;
            var artists = body['artists'].map((artist) => { return artist.name });
            let result = body['album']['name'] + ' ' + body['name'] + ' ' + artists;
            GetYTURLFromSearchStr(result).then((url) => { resolve(url); });

        },
            (err) => {
                console.error(err);
                reject(err);
            }
        );
    })
}

app.get('/:trackId', (req, res) => {

    AuthSpotify(client_id, client_secret).then(
        () => {
            console.log(req.params.trackId);
            GetTrackInfo(req.params.trackId).then(
                (url) => {console.log(url); res.json({ytUrl: url})}
            );
        }
    )
}
);

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})