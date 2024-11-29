import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Login.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:8000/api/login", {
        email,
        password,
      });
      console.log(response.data);
      localStorage.setItem("token", response.data.token);
      navigate("/clientes/list");
    } catch (error) {
      console.error("Error al iniciar sesión", error);
    }
  };

  const handleRegisterRedirect = () => {
    navigate("/register");
  };

  // Login.js
return (
  <div className="login-container">
    <div className="login-box">
      <h2>Iniciar Sesión</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Iniciar Sesión</button>
      </form>
      <button className="register-redirect" onClick={handleRegisterRedirect}>
        ¿No tienes cuenta? Regístrate
      </button>
    </div>
  </div>
);
};

export default Login;