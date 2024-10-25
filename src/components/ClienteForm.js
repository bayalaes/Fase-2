import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

const ClienteForm = () => {
  const [cliente, setCliente] = useState({
    nombre: "",
    barrio: "",
    direccion: "",
    telefono: "",
    fechaAdquisicion: "",
    valorTotalAPagar: 0,
    abonos: [],
    totalAbonos: 0,
    valorFinal: 0,
    productos: [],
  });

  const [abono, setAbono] = useState({ monto: 0, fecha: "" });
  const [productosDisponibles, setProductosDisponibles] = useState([]);
  const [productoSeleccionado, setProductoSeleccionado] = useState("");

  const navigate = useNavigate();
  const { id } = useParams(); // Obtiene el ID del cliente si se está editando

  // Cargar datos del cliente si estamos editando
  useEffect(() => {
    const fetchData = async () => {
      try {
        if (id) {
          const response = await axios.get(
            `http://localhost:8000/api/clientes/${id}`
          );
          setCliente(response.data);
        }

        // Cargar productos disponibles para seleccionar
        const productosResponse = await axios.get(
          "http://localhost:8000/api/productos"
        );
        setProductosDisponibles(productosResponse.data);
        console.log("Productos disponibles:", productosResponse.data); // Log de productos disponibles
      } catch (error) {
        console.error("Error al cargar datos:", error);
      }
    };

    fetchData();
  }, [id]);

  // Manejar cambios en el formulario del cliente
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCliente((prev) => ({ ...prev, [name]: value }));
  };

  // Manejar cambios en el formulario de abono
  const handleAbonoChange = (e) => {
    const { name, value } = e.target;
    setAbono((prev) => ({ ...prev, [name]: value }));
  };

  // Añadir abono al cliente
  const agregarAbono = () => {
    if (abono.monto) {
      // Asignar la fecha actual al abono
      const fechaActual = new Date().toISOString().split("T")[0]; // Obtener fecha en formato YYYY-MM-DD
      const nuevoAbono = { ...abono, fecha: fechaActual }; // Añadir fecha actual al abono

      const nuevosAbonos = [...cliente.abonos, nuevoAbono];
      const totalAbonos = nuevosAbonos.reduce(
        (total, abono) => total + parseFloat(abono.monto),
        0
      );
      setCliente((prev) => ({
        ...prev,
        abonos: nuevosAbonos,
        totalAbonos,
        valorFinal: prev.valorTotalAPagar - totalAbonos,
      }));
      setAbono({ monto: 0, fecha: "" }); // Limpiar el formulario de abono
    } else {
      alert("Por favor, complete el monto del abono.");
    }
  };

  // Asignar producto al cliente
  const asignarProductoACliente = (producto) => {
    const nuevoProducto = {
      ...producto,
      cantidad: 1, // Inicializamos la cantidad en 1 por defecto
      valorTotal: producto.valorUnitario, // Valor total igual al valor unitario por defecto
    };
    const nuevosProductos = [...cliente.productos, nuevoProducto];

    // Actualizar el total a pagar
    const valorTotalAPagar = nuevosProductos.reduce(
      (total, prod) => total + prod.valorTotal,
      0
    );

    console.log("Estado del cliente antes de asignar producto:", cliente); // Log antes de actualizar
    setCliente((prev) => ({
      ...prev,
      productos: nuevosProductos,
      valorTotalAPagar,
      valorFinal: valorTotalAPagar - prev.totalAbonos,
    }));
    console.log("Estado del cliente después de asignar producto:", {
      ...cliente,
      productos: nuevosProductos,
    }); // Log después de actualizar
  };

  // Manejar selección de producto
  const handleProductoSeleccionado = (e) => {
    const productoId = e.target.value; // Aquí debería ser el _id
    console.log(
      "Producto ID seleccionado:",
      productoId,
      "Tipo:",
      typeof productoId
    ); // Log del ID seleccionado

    // Imprimir tipos de ID en productosDisponibles
    productosDisponibles.forEach((prod) => {
      console.log(`Producto ID: ${prod._id} - Tipo: ${typeof prod._id}`); // Cambia id a _id
    });

    const producto = productosDisponibles.find(
      (prod) => prod._id === productoId // Cambia id a _id
    );

    console.log("Detalles del producto encontrado:", producto); // Log del producto encontrado

    if (producto) {
      asignarProductoACliente(producto);
      setProductoSeleccionado(""); // Limpiar la selección
    } else {
      console.error("Producto no encontrado en productosDisponibles"); // Log de error si no se encuentra el producto
    }
  };

  // Cambiar la cantidad del producto seleccionado
  const cambiarCantidadProducto = (index, cantidad) => {
    const nuevosProductos = [...cliente.productos];
    nuevosProductos[index].cantidad = cantidad;
    nuevosProductos[index].valorTotal =
      nuevosProductos[index].cantidad * nuevosProductos[index].valorUnitario;

    const valorTotalAPagar = nuevosProductos.reduce(
      (total, prod) => total + prod.valorTotal,
      0
    );

    console.log(
      `Cambiando cantidad del producto en índice ${index} a ${cantidad}`
    ); // Log del índice y la cantidad
    setCliente((prev) => ({
      ...prev,
      productos: nuevosProductos,
      valorTotalAPagar,
      valorFinal: valorTotalAPagar - prev.totalAbonos,
    }));
  };

  // Manejar envío del formulario del cliente
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const apiCall = id
        ? axios.put(`http://localhost:8000/api/clientes/${id}`, cliente) // Actualiza si hay ID
        : axios.post("http://localhost:8000/api/clientes", cliente); // Crea un nuevo cliente

      const response = await apiCall;
      console.log("Cliente guardado:", response.data);

      // Redirige a la lista de clientes después de guardar
      navigate("/clientes/list");
    } catch (error) {
      console.error("Error al guardar cliente:", error);
    }
  };

  // Redirigir a la página de productos
  const irAPaginaDeProductos = () => {
    navigate("/productos");
  };

  // Redirigir a la lista de clientes
  const irAListaDeClientes = () => {
    navigate("/clientes/list");
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>{id ? "Editar Cliente" : "Formulario de Cliente"}</h2>
      <input
        type="text"
        name="nombre"
        placeholder="Nombre"
        value={cliente.nombre}
        onChange={handleInputChange}
        required
      />
      <input
        type="text"
        name="barrio"
        placeholder="Barrio"
        value={cliente.barrio}
        onChange={handleInputChange}
        required
      />
      <input
        type="text"
        name="direccion"
        placeholder="Dirección"
        value={cliente.direccion}
        onChange={handleInputChange}
        required
      />
      <input
        type="text"
        name="telefono"
        placeholder="Teléfono"
        value={cliente.telefono}
        onChange={handleInputChange}
        required
      />
      <input
        type="date"
        name="fechaAdquisicion"
        value={cliente.fechaAdquisicion}
        onChange={handleInputChange}
        required
      />

      <h3>Abonos</h3>
      <input
        type="number"
        name="monto"
        placeholder="Monto del abono"
        value={abono.monto}
        onChange={handleAbonoChange}
        required
      />
      {/* Eliminamos el campo de fecha del formulario de abono */}
      <button type="button" onClick={agregarAbono}>
        Agregar Abono
      </button>

      <h4>Lista de Abonos</h4>
      <ul>
        {cliente.abonos.map((abono, index) => (
          <li key={index}>
            {abono.monto} - {abono.fecha}
          </li>
        ))}
      </ul>

      <h3>Seleccionar Productos</h3>
      <select
        value={productoSeleccionado}
        onChange={handleProductoSeleccionado}
      >
        <option value="">Seleccionar producto</option>
        {productosDisponibles.map((producto) => (
          <option key={producto._id} value={producto._id}>
            {producto.nombre}
          </option>
        ))}
      </select>
      <button type="button" onClick={irAPaginaDeProductos}>
        Ir a Productos
      </button>

      <h4>Lista de Productos</h4>
      <ul>
        {cliente.productos.map((producto, index) => (
          <li key={index}>
            {producto.nombre} - Cantidad:{" "}
            <input
              type="number"
              value={producto.cantidad}
              onChange={(e) =>
                cambiarCantidadProducto(index, parseInt(e.target.value))
              }
            />
            - Valor Total: {producto.valorTotal}
          </li>
        ))}
      </ul>

      <h3>Valor Total a Pagar: {cliente.valorTotalAPagar}</h3>
      <h3>Total Abonos: {cliente.totalAbonos}</h3>
      <h3>Valor Final: {cliente.valorFinal}</h3>

      <button type="submit">Guardar Cliente</button>
      <button type="button" onClick={irAListaDeClientes}>
        Cancelar
      </button>
    </form>
  );
};

export default ClienteForm;
