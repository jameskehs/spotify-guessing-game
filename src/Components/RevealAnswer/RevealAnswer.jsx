import "./RevealAnswer.css";

const RevealAnswer = ({ selectedTrack }) => {
  const { album, artists, name } = selectedTrack;

  return (
    <div id="reveal-answer-card">
      <img
        className="album-art"
        src={album.images[0].url}
        alt={`Album Cover for ${album.name}`}
      />
      <h2>{name}</h2>
      {artists.map((artist, index) => (
        <p key={index}>{artist.name}</p>
      ))}
      <p>{album.name}</p>
    </div>
  );
};

export default RevealAnswer;
