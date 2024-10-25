import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:8000/api/login', {
        email,
        password,
      });
      console.log(response.data);
      // Guardar token en localStorage o contexto
      localStorage.setItem('token', response.data.token);
      navigate('/clientes/list'); // Redirigir a la lista de clientes o dashboard
    } catch (error) {
      console.error('Error al iniciar sesión', error);
    }
  };

  // Función para redirigir a la página de registro
  const handleRegisterRedirect = () => {
    navigate('/register'); // Cambia '/register' por la ruta correspondiente a tu página de registro
  };

  return (
    <div>
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

      {/* Botón para redirigir al registro */}
      <button onClick={handleRegisterRedirect}>¿No tienes cuenta? Regístrate</button>
    </div>
  );
};

export default Login;
