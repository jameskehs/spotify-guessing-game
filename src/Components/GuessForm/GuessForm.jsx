const GuessForm = ({ guess, setGuess, submitGuess, isPlaying }) => {
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
        autoComplete="off"
        disabled={isPlaying}
      />
      <button id="submit-guess" disabled={isPlaying}>
        Guess
      </button>
    </form>
  );
};

export default GuessForm;
