import "./AttemptCounter.css";

const AttemptCounter = ({ allGuesses }) => {
  return (
    <div id="attempts-container">
      {allGuesses.map((guess, index) => {
        if (index > 4) return "";
        return <div key={index} className={`guess ${guess.correct}`}></div>;
      })}
    </div>
  );
};

export default AttemptCounter;
