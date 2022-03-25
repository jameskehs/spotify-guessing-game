import { useEffect, useState } from "react";
import SpotifyPlayer from "react-spotify-web-playback";

const Player = ({ accessToken, trackTime, selectedTrack }) => {
  const [isPlaying, setIsPlaying] = useState(false);

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
          setIsPlaying(true);
          setTimeout(() => {
            setIsPlaying(false);
          }, trackTime);
        }}
      >
        <img src="./Img/play-button.png" alt="Play Button" />
      </button>
      {isPlaying && (
        <SpotifyPlayer
          name="Spotify Guessing Game"
          token={accessToken}
          uris={[selectedTrack.uri]}
          autoPlay={true}
        />
      )}
    </>
  );
};

export default Player;
