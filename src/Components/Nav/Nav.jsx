import "./Nav.css";

const Nav = ({ accessToken }) => {
  return (
    <nav>
      {accessToken ? (
        <a
          href="/"
          onClick={() => localStorage.removeItem("spotify-access-token")}
        >
          LOGOUT
        </a>
      ) : (
        <a href={process.env.REACT_APP_SPOTIFY_AUTH_URL}>LOGIN</a>
      )}
    </nav>
  );
};

export default Nav;
