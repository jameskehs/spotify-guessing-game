import "dotenv/config";
const Login = () => {
  return (
    <div>
      <a href={process.env.REACT_APP_AUTH_URL}>Login</a>
    </div>
  );
};

export default Login;
