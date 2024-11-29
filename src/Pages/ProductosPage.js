import React, { useState, useEffect } from "react";
import axios from "axios";
import "./ProductoPage.css";
import { useNavigate } from "react-router-dom"; // Cambiado a useNavigate

const ProductoPage = () => {
  const [producto, setProducto] = useState({
    nombre: "",
    valorUnitario: 0,
    cantidad: 1,
    valorTotal: 0,
  });

  const [productos, setProductos] = useState([]);
  const navigate = useNavigate(); // Usamos useNavigate

  // Obtener la lista de productos
  useEffect(() => {
    const fetchProductos = async () => {
      try {
        const response = await axios.get("http://localhost:8000/api/productos");
        console.log("Productos obtenidos:", response.data); // Verifica la respuesta aquí
        setProductos(response.data);
      } catch (error) {
        console.error("Error al obtener productos:", error);
      }
    };

    fetchProductos();
  }, []);

  // Manejar cambios en el formulario
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProducto({ ...producto, [name]: value });
  };

  // Manejar envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    producto.valorTotal = producto.cantidad * producto.valorUnitario;

    try {
      const response = await axios.post(
        "http://localhost:8000/api/productos",
        producto
      );
      // Añadir el nuevo producto a la lista
      setProductos([...productos, response.data]);
      // Limpiar el formulario
      setProducto({
        nombre: "",
        valorUnitario: 0,
        cantidad: 1,
        valorTotal: 0,
      });
    } catch (error) {
      console.error("Error al guardar producto:", error);
    }
  };

  // Función para eliminar producto
  const handleDelete = async (_id) => {  // Cambié el parámetro id por _id
    if (!_id) {
      console.error("El producto no tiene un id válido.");
      return; // No continuar si no hay un id válido
    }

    try {
      await axios.delete(`http://localhost:8000/api/productos/${_id}`);
      setProductos(productos.filter((prod) => prod._id !== _id)); // Cambié id por _id
    } catch (error) {
      console.error("Error al eliminar producto:", error);
    }
  };

  // Función para regresar a la página de clientes
  const handleRegresar = () => {
    navigate("/clientes/form"); // Redirigir a la página de clientes
  };

  return (
    <div className="producto-page-wrapper">
      <div className="producto-page">
        <h2 className="titulo">Crear Producto</h2>
        <form onSubmit={handleSubmit} className="form-producto">
          <input
            type="text"
            name="nombre"
            placeholder="Nombre del producto"
            value={producto.nombre}
            onChange={handleInputChange}
            required
            className="input"
          />
          <input
            type="number"
            name="valorUnitario"
            placeholder="Valor unitario"
            value={producto.valorUnitario}
            onChange={handleInputChange}
            required
            className="input"
          />
          <input
            type="number"
            name="cantidad"
            placeholder="Cantidad"
            value={producto.cantidad}
            onChange={handleInputChange}
            required
            className="input"
          />
          <button type="submit" className="btn-submit">
            Guardar Producto
          </button>
        </form>

        <button onClick={handleRegresar} className="btn-regresar">
          Regresar a Clientes
        </button>

        <h2 className="titulo">Lista de Productos</h2>
        <ul className="lista-productos">
          {productos.map((prod, index) => (
            <li key={prod._id || index} className="producto-item"> {/* Cambié id por _id */}
              <div className="producto-details">
                <span>Nombre: {prod.nombre}</span>
                <span>Valor Unitario: ${prod.valorUnitario}</span>
                <span>Cantidad: {prod.cantidad}</span>
                <span>Total: ${prod.valorTotal}</span>
              </div>
              <button
                onClick={() => handleDelete(prod._id)}  // Cambié id por _id
                className="btn-eliminar"
              >
                Eliminar
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ProductoPage;
