const express = require("express");
const app = express();
const PORT = process.env.PORT || 5000;
require("dotenv").config();
const cors = require("cors");
const spotifyWebApi = require("spotify-web-api-node");

app.use(cors());
app.use(express.json());

const path = require("path");
app.use(express.static(path.join(__dirname, "build")));

app.post("/refresh", (req, res) => {
  const refreshToken = req.body.refreshToken;
  const spotifyApi = new spotifyWebApi({
    redirectUri: process.env.REACT_APP_SPOTIFY_REDIRECT_URI,
    clientId: process.env.REACT_APP_SPOTIFY_CLIENT,
    clientSecret: process.env.REACT_APP_SPOTIFY_SECRET,
    refreshToken,
  });

  spotifyApi
    .refreshAccessToken()
    .then((data) => {
      res.json({ accessToken: data.body.access_token });
    })
    .catch((err) => {
      console.log(err);
      res.sendStatus(400);
    });
});

app.post("/login", (req, res) => {
  const code = req.body.code;
  const spotifyApi = new spotifyWebApi({
    redirectUri: process.env.REACT_APP_SPOTIFY_REDIRECT_URI,
    clientId: process.env.REACT_APP_SPOTIFY_CLIENT,
    clientSecret: process.env.REACT_APP_SPOTIFY_SECRET,
  });

  spotifyApi
    .authorizationCodeGrant(code)
    .then((data) =>
      res.json({
        accessToken: data.body.access_token,
        refreshToken: data.body.refresh_token,
        expiresIn: data.body.expires_in,
      })
    )
    .catch((err) => {
      console.log(err);
      res.sendStatus(400);
    });
});

app.use((req, res, next) => {
  res.sendFile(path.join(__dirname, "build", "index.html"));
});
app.listen(PORT, () => {
  console.log(`App is up on ${PORT}`);
});
