import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./ClientesList.css"; // Asegúrate de que el archivo CSS esté importado

function ClientesList() {
  const [clientes, setClientes] = useState([]);

  useEffect(() => {
    const fetchClientes = async () => {
      try {
        const response = await fetch("http://localhost:8000/api/clientes");
        if (!response.ok) {
          throw new Error("Error al obtener los clientes");
        }
        const data = await response.json();
        setClientes(data);
      } catch (error) {
        console.error("Error fetching clientes:", error);
      }
    };

    fetchClientes();
  }, []);

  // Función para eliminar cliente
  const handleDelete = async (id) => {
    try {
      await fetch(`http://localhost:8000/api/clientes/${id}`, {
        method: "DELETE",
      });
      setClientes(clientes.filter((cliente) => cliente._id !== id));
    } catch (error) {
      console.error("Error al eliminar el cliente:", error);
    }
  };

return (
  <div className="clientes-container">
    <div className="clientes-box">
      <h1>Lista de Clientes</h1>
      {clientes.length === 0 ? (
        <p>No hay clientes disponibles.</p>
      ) : (
        <ul className="clientes-list">
          {clientes.map((cliente) => (
            <li key={cliente._id} className="cliente-item">
              <span>{cliente.nombre} - {cliente.barrio}</span>
              <div className="cliente-actions">
                <Link to={`/clientes/form/${cliente._id}`} className="btn-editar">Editar</Link>
                <button
                  onClick={() => handleDelete(cliente._id)}
                  className="btn-eliminar"
                >
                  Eliminar
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
      <Link to="/clientes/form" className="crear-cliente-link">
        Crear nuevo cliente
      </Link>
    </div>
  </div>
);
}

export default ClientesList;
