import { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const loginUser = async () => {
    try {
      const res = await axios.post(
        "http://localhost:8000/api/users/login",
        {
          email,
          password,
        }
      );

      // Save user info
      localStorage.setItem(
        "user",
        JSON.stringify(res.data)
      );

      // Required for ProtectedRoute
      localStorage.setItem(
        "token",
        "loggedin"
      );

      // Redirect to feed
      window.location.replace("/feed");
    } catch (err) {
      console.log(err);
      alert("Login Failed");
    }
  };

  return (
    <div
      style={{
        textAlign: "center",
        marginTop: "100px",
      }}
    >
      <h1>Login</h1>

      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) =>
          setEmail(e.target.value)
        }
      />

      <br />
      <br />

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) =>
          setPassword(e.target.value)
        }
      />

      <br />
      <br />

      <button onClick={loginUser}>
        Login
      </button>

      <br />
      <br />

      <Link to="/register">
        Register Here
      </Link>
    </div>
  );
}

export default Login;
