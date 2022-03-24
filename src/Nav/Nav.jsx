import "./Nav.css";
const AUTH_URL =
  "https://accounts.spotify.com/authorize?client_id=b19ba0b304904f03862cf481cc44f169&response_type=code&redirect_uri=http://localhost:3000&scope=streaming%20user-read-email%20user-read-private%20user-library-read%20user-library-modify%20user-read-playback-state%20user-modify-playback-state";

const Nav = ({ accessToken }) => {
  function logout() {
    localStorage.removeItem("spotify-access-token");
    window.location = "/";
  }

  return (
    <nav>
      {accessToken ? (
        <a href="/" onClick={() => logout()}>
          LOGOUT
        </a>
      ) : (
        <a href={AUTH_URL}>LOGIN</a>
      )}
    </nav>
  );
};

export default Nav;