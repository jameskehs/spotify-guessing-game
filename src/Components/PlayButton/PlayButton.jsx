import { useEffect } from "react";

const PlayButton = ({
  trackTime,
  playSong,
  playerReady,
  player,
  isPlaying,
  setIsPlaying,
}) => {
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
      {playerReady && (
        <button
          id="play-song-btn"
          onClick={() => {
            playSong();
            setIsPlaying(true);
            setTimeout(() => {
              player.pause();
              setIsPlaying(false);
            }, trackTime);
          }}
        >
          <img src="./Img/play-button.png" alt="Play Button" />
        </button>
      )}
    </>
  );
};

export default PlayButton;
