import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../LoginPage.css";

export default function Login() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();

    if (!name.trim() || !email.trim()) return;

    localStorage.setItem(
      "agent",
      JSON.stringify({ name, email })
    );

    navigate("/api/messages"); 
  };

  return (
    <div className="login-container">
      <form className="login-card" onSubmit={handleLogin}>
        <h2 className="login-title">CS Messaging System</h2>
        {/* <p>Agent Login</p> */}

        <input
          className="login-input"
          type="text"
          placeholder="Agent Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <input
          className="login-input"
          type="email"
          placeholder="Agent Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <button className="login-button" type="submit">
          Enter Main Page
        </button>
      </form>
    </div>

  );
}
