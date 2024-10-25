import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ProductoPage = () => {
  const [producto, setProducto] = useState({
    nombre: '',
    valorUnitario: 0,
    cantidad: 1,
    valorTotal: 0,
  });

  const [productos, setProductos] = useState([]);

  // Obtener la lista de productos
  useEffect(() => {
    const fetchProductos = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/productos');
        setProductos(response.data);
      } catch (error) {
        console.error('Error al obtener productos:', error);
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
      const response = await axios.post('http://localhost:8000/api/productos', producto);
      // Añadir el nuevo producto a la lista
      setProductos([...productos, response.data]);
      // Limpiar el formulario
      setProducto({
        nombre: '',
        valorUnitario: 0,
        cantidad: 1,
        valorTotal: 0,
      });
    } catch (error) {
      console.error('Error al guardar producto:', error);
    }
  };

  return (
    <div>
      <h2>Crear Producto</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="nombre"
          placeholder="Nombre del producto"
          value={producto.nombre}
          onChange={handleInputChange}
          required
        />
        <input
          type="number"
          name="valorUnitario"
          placeholder="Valor unitario"
          value={producto.valorUnitario}
          onChange={handleInputChange}
          required
        />
        <input
          type="number"
          name="cantidad"
          placeholder="Cantidad"
          value={producto.cantidad}
          onChange={handleInputChange}
          required
        />
        <button type="submit">Guardar Producto</button>
      </form>

      <h2>Lista de Productos</h2>
      <ul>
        {productos.map((prod) => (
          <li key={prod.id}>
            {prod.nombre} - Valor Unitario: {prod.valorUnitario} - Cantidad: {prod.cantidad} - Total: {prod.valorTotal}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ProductoPage;
