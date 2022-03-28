import { useEffect, useState } from "react";
import axios from "axios";
import MainGame from "./MainGame.js";
import Nav from "./Components/Nav/Nav";
import LoginInstructions from "./Components/LoginInstructions/LoginInstructions";
import "./App.css";

const App = () => {
  const [accessToken, setAccessToken] = useState(
    localStorage.getItem("spotify-access-token")
  );

  //If no access token, we search the URL for the code param. With the code param we reach out to our server and get an access token from spotify.  This token is set in localstorage and gives us access to the game.
  useEffect(() => {
    if (!accessToken) {
      const code = new URLSearchParams(window.location.search).get("code");
      if (!code) return;
      axios
        .post("/login", { code })
        .then((res) => {
          setAccessToken(res.data.accessToken);
          window.history.pushState({}, null, "/");
        })
        .catch(() => {
          window.location = "/";
        });
    }
  }, []);

  //Puts access token in local storage
  useEffect(() => {
    if (accessToken === null) return;
    localStorage.setItem("spotify-access-token", accessToken);
  }, [accessToken]);

  //If we have an access token we render the game, otherwise we render login instructions
  return (
    <div id="app">
      <Nav accessToken={accessToken} />
      {accessToken ? (
        <MainGame accessToken={accessToken} />
      ) : (
        <LoginInstructions />
      )}
    </div>
  );
};

export default App;
