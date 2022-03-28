import { useEffect, useState } from "react";
import "./dashboard.css";
import AttemptCounter from "./Components/AttemptCounter/AttemptCounter";
import GuessForm from "./Components/GuessForm/GuessForm";
import Player from "./Components/Player/Player";
import RevealAnswer from "./Components/RevealAnswer/RevealAnswer";

import axios from "axios";

const MainGame = ({ accessToken }) => {
  const [selectedTrack, setSelectedTrack] = useState({});
  const [allGuesses, setAllGuesses] = useState([{}, {}, {}, {}, {}]);
  const [attempt, setAttempt] = useState(0);
  const [trackTime, setTrackTime] = useState(2500);
  const [guess, setGuess] = useState("");
  const [gameStatus, setGameStatus] = useState({
    isOver: false,
    didWin: false,
  });

  //Sends request to get the total amount of tracks in a users library, then uses the total to make a request to grab a single random track
  useEffect(() => {
    async function getRandomTrack() {
      if (!accessToken) return;
      const {
        data: { total },
      } = await axios.get("https://api.spotify.com/v1/me/tracks?limit=1", {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      console.log(total);
      const {
        data: {
          items: [{ track }],
        },
      } = await axios.get(
        `https://api.spotify.com/v1/me/tracks?limit=1&offset=${Math.floor(
          Math.random() * total
        )}`,
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );
      setSelectedTrack(track);
    }

    getRandomTrack();
  }, [accessToken]);

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
    } else {
      setTrackTime(trackTime + (attempt + 1) * 750);
      newGuesses[attempt] = { guess, correct: "wrong" };
      setAttempt(attempt + 1);

      if (attempt === 4) {
        setTimeout(() => {
          setGameStatus({ isOver: true, didWin: false });
          return;
        }, 500);
      }
      setAllGuesses(newGuesses);
    }
  }

  return (
    <>
      {selectedTrack !== undefined && !gameStatus.isOver && (
        <div id="main-game">
          <Player
            accessToken={accessToken}
            trackTime={trackTime}
            selectedTrack={selectedTrack}
          />
          <GuessForm
            submitGuess={submitGuess}
            guess={guess}
            setGuess={setGuess}
          />
        </div>
      )}
      {gameStatus.isOver && (
        <RevealAnswer selectedTrack={selectedTrack} accessToken={accessToken} />
      )}
      <AttemptCounter allGuesses={allGuesses} />
      {gameStatus.isOver && (
        <div id="restart-game-container">
          <button id="restart-game-btn" onClick={() => (window.location = "/")}>
            Play Again
          </button>
        </div>
      )}
    </>
  );
};

export default MainGame;