import { useEffect } from "react";
import "./RevealAnswer.css";
import SpotifyPlayer from "react-spotify-web-playback";

const RevealAnswer = ({ accessToken, selectedTrack }) => {
  const { album, artists, name, uri } = selectedTrack;

  return (
    <div id="reveal-answer-card">
      <img src={album.images[0].url} alt={`Album Cover for ${album.name}`} />
      <h2>{name}</h2>
      {artists.map((artist, index) => (
        <p key={index}>{artist.name}</p>
      ))}
    </div>
  );
};

export default RevealAnswer;
