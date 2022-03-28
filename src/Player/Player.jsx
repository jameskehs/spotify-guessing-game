import { useEffect, useState } from "react";

const Player = ({ accessToken, trackTime, selectedTrack }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [player, setPlayer] = useState(undefined);
  const [is_paused, setPaused] = useState(false);
  const [is_active, setActive] = useState(false);
  const [device_id, setDeviceID] = useState("");
  console.log(selectedTrack);
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

    play({
      playerInstance: new window.Spotify.Player({ name: "Guessing Game" }),
      spotify_uri: selectedTrack.uri,
    });
  }

  //Start/stop animation on play button
  useEffect(() => {
    if (isPlaying) {
      const button = document.getElementById("play-song-btn");
      button.style.setProperty(
        "animation",
        `rotate ${trackTime}ms ease-in-out forwards`
      );
      button.style.setProperty("pointer-events", "none");
      button.addEventListener("animationend", () => {
        button.style.removeProperty("animation");
        button.style.removeProperty("pointer-events");
      });
    }
  }, [isPlaying, trackTime]);

  return (
    <>
      <button
        id="play-song-btn"
        onClick={() => {
          playSong();
          setIsPlaying(true);
          setTimeout(() => {
            player.togglePlay();
            setIsPlaying(false);
          }, trackTime);
        }}
      >
        <img src="./Img/play-button.png" alt="Play Button" />
      </button>
    </>
  );
};

export default Player;
