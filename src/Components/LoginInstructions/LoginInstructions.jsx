import "./LoginInstructions.css";

const LoginInstructions = () => {
  return (
    <div id="login-instructions">
      <h1>Welcome to whatever this is!</h1>
      <p>How well do you know your favorite songs?</p>
      <p>
        This game uses your Spotify library and puts you to the test! You will
        get 5 attempts to guess a snippet of one random song out of your
        library, with each incorrect guess you unlock a longer snippet
      </p>
      <p>Start by clicking "Login" at the top of the page!</p>
      <p>NOTE: This game requires a Spotify Premium membership</p>
    </div>
  );
};

export default LoginInstructions;
