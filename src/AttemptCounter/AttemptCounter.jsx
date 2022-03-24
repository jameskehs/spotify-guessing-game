import "./AttemptCounter.css";

const AttemptCounter = ({ allGuesses }) => {
  console.log(allGuesses);
  return (
    <div id="attempts-container">
      {allGuesses.map((guess) => {
        return <div className={`guess ${guess.correct}`}></div>;
      })}
    </div>
  );
};

export default AttemptCounter;
