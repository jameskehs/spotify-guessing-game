import { useEffect, useState, useRef } from "react";
import SpotifyWebApi from "spotify-web-api-node";
import AttemptCounter from "./AttemptCounter/AttemptCounter";
import "./dashboard.css";
import GuessForm from "./GuessForm/GuessForm";
import Player from "./Player/Player";
import RevealAnswer from "./RevealAnswer/RevealAnswer";
const spotifyApi = new SpotifyWebApi({
  clientId: "b19ba0b304904f03862cf481cc44f169",
});

const Dashboard = ({ accessToken }) => {
  const [selectedTrack, setSelectedTrack] = useState({});
  const [allGuesses, setAllGuesses] = useState([{}, {}, {}, {}, {}]);
  const [attempt, setAttempt] = useState(0);
  const [trackTime, setTrackTime] = useState(2500);
  const [guess, setGuess] = useState("");
  const [gameStatus, setGameStatus] = useState({
    isOver: false,
    didWin: false,
  });
  console.log(selectedTrack);
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

  //Removes all punctuation, spacing, and lowercases guess AND correct answer then compares
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
      {/* {gameStatus.isOver && gameStatus.didWin && <WinScreen/>}
      {gameStatus.isOver && !gameStatus.didWin && <LoseScreen/>}
 */}
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

export default Dashboard;
