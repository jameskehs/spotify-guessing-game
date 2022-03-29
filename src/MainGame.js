import { useEffect, useState } from "react";
import "./MainGame.css";
import AttemptCounter from "./Components/AttemptCounter/AttemptCounter";
import GuessForm from "./Components/GuessForm/GuessForm";
import PlayButton from "./Components/PlayButton/PlayButton";
import RevealAnswer from "./Components/RevealAnswer/RevealAnswer";
import axios from "axios";

const MainGame = ({ accessToken, refreshAccessToken }) => {
  const [selectedTrack, setSelectedTrack] = useState({});
  const [allGuesses, setAllGuesses] = useState([{}, {}, {}, {}, {}]);
  const [attempt, setAttempt] = useState(0);
  const [trackTime, setTrackTime] = useState(2500);
  const [guess, setGuess] = useState("");
  const [gameStatus, setGameStatus] = useState({
    isOver: false,
    didWin: false,
  });
  const [player, setPlayer] = useState(undefined);
  const [device_id, setDeviceID] = useState("");
  const [playerReady, setPlayerReady] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  let totalTracks = undefined;
  //Loads the spotify player, puts player in state
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://sdk.scdn.co/spotify-player.js";
    script.async = true;

    document.body.appendChild(script);

    window.onSpotifyWebPlaybackSDKReady = () => {
      const player = new window.Spotify.Player({
        name: "Guess Your Library",
        getOAuthToken: (cb) => {
          cb(accessToken);
        },
        volume: 0.5,
      });

      setPlayer(player);

      player.addListener("ready", ({ device_id }) => {
        setDeviceID(device_id);
        setPlayerReady(true);
      });

      player.addListener("not_ready", ({ device_id }) => {
        console.log("Device ID has gone offline", device_id);
      });

      player.addListener("player_state_changed", (state) => {
        console.log(state);
      });

      player.connect();
    };

    window.addEventListener("beforeunload", function (e) {
      e.preventDefault();
      player.disconnect();
    });
  }, []);

  // On initial load, getRandomTrack()
  useEffect(() => {
    getRandomTrack();
  }, []);

  //Sends request to get the total amount of tracks in a users library, then uses the total to make a request to grab a single random track
  async function getRandomTrack() {
    try {
      if (!accessToken) return;
      if (totalTracks === undefined) {
        const {
          data: { total },
        } = await axios.get("https://api.spotify.com/v1/me/tracks?limit=1", {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        totalTracks = total;
      }
      const {
        data: {
          items: [{ track }],
        },
      } = await axios.get(
        `https://api.spotify.com/v1/me/tracks?limit=1&offset=${Math.floor(
          Math.random() * totalTracks
        )}`,
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );
      setSelectedTrack(track);
    } catch (e) {
      if (e.response.data.error.message === "The access token expired") {
        refreshAccessToken();
      }
    }
  }

  // Removes punctuation, spacing, and lowercases user guess and correct answer. Compares guess to answer. Updates allGuesses array with "guess" and "Correct".
  // "Correct" is not a boolean because the value is used as a CSS classname on the attempt counter, this can be changed to a boolean, we will have to update logic in AttemptCounter.jsx
  // If player did not guess correctly but still has more attempts, increase snippet time. If game is over, sets game status (isOver and didWin).
  // Attempt counter starts at 0 (Attempt 1 = 0, Attempt 2 = 1, Attempt 3 = 2, etc.)
  // If more attempts remain, increase attempt count + 1
  function submitGuess() {
    let correctAnswer = selectedTrack.name
      .replace(/[\.,\/#!$%\^&\*;:{}=\-_'’`~ ]/g, "")
      .replace(/\s*\(.*?\)\s*/g, "")
      .toLowerCase();
    let formattedGuess = guess
      .replace(/[\.,\/#!$%\^&\*;:{}=\-_'’`~ ]/g, "")
      .replace(/\s*\(.*?\)\s*/g, "")
      .toLowerCase();
    const newGuesses = [...allGuesses];
    setGuess("");
    if (formattedGuess === correctAnswer) {
      newGuesses[attempt] = { guess, correct: "correct" };
      setAllGuesses(newGuesses);
      setGameStatus({ isOver: true, didWin: true });
      playSong();
    } else {
      setTrackTime(trackTime + (attempt + 1) * 750);
      newGuesses[attempt] = { guess, correct: "wrong" };
      setAttempt(attempt + 1);

      if (attempt === 4) {
        setTimeout(() => {
          setGameStatus({ isOver: true, didWin: false });
          playSong();
          return;
        }, 500);
      }
      setAllGuesses(newGuesses);
    }
  }

  //Makes request to play the selectedTrack uri
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
    if (player === undefined) return;
    player.activateElement();
    play({
      playerInstance: new window.Spotify.Player({ name: "Guessing Game" }),
      spotify_uri: selectedTrack.uri,
    });
    blockControls();
  }

  function blockControls() {
    navigator.mediaSession.metadata = new MediaMetadata({});
    navigator.mediaSession.setActionHandler("play", function () {
      return;
    });
    navigator.mediaSession.setActionHandler("pause", function () {
      return;
    });
    navigator.mediaSession.setActionHandler("seekbackward", function () {
      /* Code excerpted. */
    });
    navigator.mediaSession.setActionHandler("seekforward", function () {
      /* Code excerpted. */
    });
    navigator.mediaSession.setActionHandler("previoustrack", function () {
      /* Code excerpted. */
    });
    navigator.mediaSession.setActionHandler("nexttrack", function () {
      /* Code excerpted. */
    });
  }

  //Resets all game states back to initial and chooses new song
  function resetGame() {
    player.pause();
    getRandomTrack();
    setAllGuesses([{}, {}, {}, {}, {}]);
    setAttempt(0);
    setTrackTime(2500);
    setGameStatus({
      isOver: false,
      didWin: false,
    });
  }

  return (
    <>
      {selectedTrack !== undefined && !gameStatus.isOver && (
        <div id="main-game">
          <PlayButton
            trackTime={trackTime}
            selectedTrack={selectedTrack}
            player={player}
            playSong={playSong}
            playerReady={playerReady}
            isPlaying={isPlaying}
            setIsPlaying={setIsPlaying}
          />
          <GuessForm
            submitGuess={submitGuess}
            guess={guess}
            setGuess={setGuess}
            isPlaying={isPlaying}
          />
        </div>
      )}
      {gameStatus.isOver && <RevealAnswer selectedTrack={selectedTrack} />}
      <AttemptCounter allGuesses={allGuesses} />
      {gameStatus.isOver && (
        <div id="restart-game-container">
          <button id="restart-game-btn" onClick={() => resetGame()}>
            Play Again
          </button>
        </div>
      )}
    </>
  );
};

export default MainGame;
