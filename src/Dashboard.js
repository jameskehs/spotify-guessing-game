import { useEffect, useState, useRef } from "react";
import SpotifyWebApi from "spotify-web-api-node";
import SpotifyPlayer from "react-spotify-web-playback";
import AttemptCounter from "./AttemptCounter/AttemptCounter";
import "./dashboard.css";
const spotifyApi = new SpotifyWebApi({
  clientId: "b19ba0b304904f03862cf481cc44f169",
});

const Dashboard = ({ accessToken }) => {
  const [selectedTrack, setSelectedTrack] = useState({});
  const [isPlaying, setIsPlaying] = useState(false);
  const [allGuesses, setAllGuesses] = useState([{}, {}, {}, {}, {}]);
  const [attempt, setAttempt] = useState(0);
  const [trackTime, setTrackTime] = useState(2500);
  const [guess, setGuess] = useState("");
  const [gameOver, setGameOver] = useState(false);

  //Get random track from users library
  useEffect(() => {
    if (!accessToken) return;
    spotifyApi.setAccessToken(accessToken);
    spotifyApi.getMySavedTracks({ limit: 1 }).then((res) => {
      const totalTracks = res.body.total;
      spotifyApi
        .getMySavedTracks({
          limit: 1,
          offset: Math.floor(Math.random() * totalTracks),
        })
        .then((res) => setSelectedTrack(res.body.items[0].track));
    });
  }, [accessToken]);
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
  }, [isPlaying]);
  //Removes all punctuation, spacing, and lowercases guess AND correct answer then compares
  function submitGuess() {
    let correctAnswer = selectedTrack.name
      .replace(/[.,\/#!$%\^&\*;:{}=\-_'`~ ]/g, "")
      .replace(/\s*\(.*?\)\s*/g, "")
      .toLowerCase();
    let formattedGuess = guess
      .replace(/[.,\/#!$%\^&\*;:{}=\-_'`~ ]/g, "")
      .replace(/\s*\(.*?\)\s*/g, "")
      .toLowerCase();
    console.log(correctAnswer);
    const newGuesses = [...allGuesses];

    if (formattedGuess === correctAnswer) {
      alert("You win!");
      newGuesses[attempt] = { guess, correct: "correct" };
      setAllGuesses(newGuesses);
      setAttempt(attempt + 1);
      setGameOver(true);
    } else {
      setTrackTime(trackTime + 1500);
      newGuesses[attempt] = { guess, correct: "wrong" };
      setAttempt(attempt + 1);

      if (attempt >= 5) {
        setGameOver(true);
        return;
      }
      setAllGuesses(newGuesses);
      alert("Try again!");
    }
  }

  return (
    selectedTrack !== undefined &&
    !gameOver && (
      <div id="main-game">
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
        <form
          onSubmit={(e) => {
            e.preventDefault();
            submitGuess();
          }}
        >
          <input
            id="guess-input"
            type="text"
            placeholder="What is the song?"
            value={guess}
            onChange={(e) => setGuess(e.target.value)}
          />
          <button id="submit-guess">Guess</button>
        </form>
        <AttemptCounter allGuesses={allGuesses} />
      </div>
    )
  );
};

export default Dashboard;
