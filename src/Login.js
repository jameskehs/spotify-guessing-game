import "dotenv/config";
const Login = () => {
  return (
    <div>
      <a href="https://accounts.spotify.com/authorize?client_id=b19ba0b304904f03862cf481cc44f169&response_type=code&redirect_uri=https://guess-your-library.herokuapp.com/&scope=streaming%20user-read-email%20user-read-private%20user-library-read%20user-library-modify%20user-read-playback-state%20user-modify-playback-state">Login</a>
    </div>
  );
};

export default Login;
