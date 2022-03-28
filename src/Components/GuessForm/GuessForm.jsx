const GuessForm = ({ guess, setGuess, submitGuess }) => {
  return (
    <form
      id="guess-form"
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
  );
};

export default GuessForm;
