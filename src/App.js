import Dashboard from "./Dashboard";
import { useEffect, useState } from "react";
import axios from "axios";
import Nav from "./Nav/Nav";
import LoginInstructions from "./LoginInstructions/LoginInstructions";
import "./App.css";

function App() {
  const [accessToken, setAccessToken] = useState(
    localStorage.getItem("spotify-access-token")
  );

  useEffect(() => {
    if (!accessToken) {
      const code = new URLSearchParams(window.location.search).get("code");
      if (!code) return;
      axios
        .post("/login", { code })
        .then((res) => {
          setAccessToken(res.data.accessToken);
          localStorage.setItem("spotify-access-token", res.data.accessToken);
          window.history.pushState({}, null, "/");
        })
        .catch(() => {
          window.location = "/";
        });
    }
  }, []);

  useEffect(() => {
    if (accessToken === null) return;
    localStorage.setItem("spotify-access-token", accessToken);
  }, [accessToken]);

  return (
    <div id="app">
      <Nav accessToken={accessToken} />
      {accessToken ? (
        <Dashboard accessToken={accessToken} />
      ) : (
        <LoginInstructions />
      )}
    </div>
  );
}

export default App;
