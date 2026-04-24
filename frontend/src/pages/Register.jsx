import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/api"; // 🔥 IMPORTANT

import "../styles/auth.css";

const Register = () => {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const register = async () => {
    if (!name || !email || !password)
      return alert("Fill all fields");

    try {
      const res = await API.post("/api/auth/register", {
        name,
        email,
        password,
      });

      alert(res.data.msg || "Registered successfully");

      navigate("/");
    } catch (err) {
      alert(err.response?.data?.msg || "Registration failed");
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-box">

        <h2>Register</h2>

        <input
          placeholder="Name"
          onChange={(e) => setName(e.target.value)}
        />

        <input
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
        />

        <button onClick={register}>Register</button>

        <p onClick={() => navigate("/")}>
          Already have account?
        </p>

      </div>
    </div>
  );
};

export default Register;
