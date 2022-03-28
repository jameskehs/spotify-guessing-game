import { useEffect, useState } from "react";
import "./RevealAnswer.css";

const RevealAnswer = ({ accessToken, selectedTrack }) => {
  const [player, setPlayer] = useState(undefined);
  const [device_id, setDeviceID] = useState("");

  const { album, artists, name, uri } = selectedTrack;
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://sdk.scdn.co/spotify-player.js";
    script.async = true;

    document.body.appendChild(script);

    window.onSpotifyWebPlaybackSDKReady = () => {
      const player = new window.Spotify.Player({
        name: "Web Playback SDK",
        getOAuthToken: (cb) => {
          cb(accessToken);
        },
        volume: 0.5,
      });

      setPlayer(player);

      player.addListener("ready", ({ device_id }) => {
        setDeviceID(device_id);
        console.log("Ready with Device ID", device_id);
      });

      player.addListener("not_ready", ({ device_id }) => {
        console.log("Device ID has gone offline", device_id);
      });

      player.connect();
    };
  }, []);

  function playSong() {
    const play = ({
      spotify_uri,
      playerInstance: {
        _options: {},
      },
    }) => {
      fetch(
        `https://api.spotify.com/v1/me/player/play?device_id=${device_id}`,
        {
          method: "PUT",
          body: JSON.stringify({ uris: [spotify_uri] }),
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
    };
    player.activateElement();
    play({
      playerInstance: new window.Spotify.Player({ name: "Guessing Game" }),
      spotify_uri: uri,
    });
  }

  setTimeout(() => {
    playSong();
  }, 2000);

  return (
    <div id="reveal-answer-card">
      <img src={album.images[0].url} alt={`Album Cover for ${album.name}`} />

      <h2>{name}</h2>
      {artists.map((artist, index) => (
        <p key={index}>{artist.name}</p>
      ))}
    </div>
  );
};

export default RevealAnswer;
