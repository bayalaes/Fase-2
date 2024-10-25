import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function ClientesList() {
  const [clientes, setClientes] = useState([]);

  useEffect(() => {
    // Función para obtener la lista de clientes
    const fetchClientes = async () => {
      try {
        const response = await fetch("http://localhost:8000/api/clientes"); // URL de tu API
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

  return (
    <div>
      <h1>Lista de Clientes</h1>
      {clientes.length === 0 ? (
        <p>No hay clientes disponibles.</p> // Mensaje si no hay clientes
      ) : (
        <ul>
          {clientes.map((cliente) => (
            <li key={cliente._id}>
              {" "}
              {/* Asegúrate de que '_id' es el campo correcto */}
              {cliente.nombre} - {cliente.barrio}{" "}
              {/* Mostrar el barrio si es un campo del cliente */}
              <Link to={`/clientes/form/${cliente._id}`}>Editar</Link>{" "}
              {/* Cambiado a _id */}
            </li>
          ))}
        </ul>
      )}

      <Link to="/clientes/form">Crear nuevo cliente</Link>
    </div>
  );
}

export default ClientesList;
