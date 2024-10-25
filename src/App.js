import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import Register from "./components/Register";
import PrivateRoute from "./components/PrivateRoute";
import ClientesPage from "./Pages/ClientesPage"; // Página principal de clientes
import ClientesList from "./components/ClienteList"; // Página de la lista de clientes
import ProductosPage from "./Pages/ProductosPage";
import ClienteForm from "./components/ClienteForm";

function App() {
  return (
    <Router>
      <div>
        <Routes>
          {/* Ruta pública para el login */}
          <Route path="/" element={<Login />} />

          {/* Ruta pública para el registro */}
          <Route path="/register" element={<Register />} />

          {/* Rutas protegidas por PrivateRoute */}
          <Route path="/clientes" element={<PrivateRoute><ClientesPage /></PrivateRoute>} />

          {/* Página de lista de clientes */}
          <Route path="/clientes/list" element={<PrivateRoute><ClientesList /></PrivateRoute>} />

          {/* Formulario de cliente (crear/editar cliente) */}
          <Route path="/clientes/form/:id?" element={<PrivateRoute><ClienteForm /></PrivateRoute>} />

          {/* Página de productos */}
          <Route path="/productos" element={<PrivateRoute><ProductosPage /></PrivateRoute>} />

        </Routes>
      </div>
    </Router>
  );
}

export default App;
