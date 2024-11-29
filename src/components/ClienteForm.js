import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import "./ClienteForm.css";

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
  const { id } = useParams();

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (id) {
          const response = await axios.get(
            `http://localhost:8000/api/clientes/${id}`
          );

          // Convertimos la fecha al formato "yyyy-MM-dd" si existe
          const clienteData = response.data;
          if (clienteData.fechaAdquisicion) {
            clienteData.fechaAdquisicion =
              clienteData.fechaAdquisicion.split("T")[0];
          }

          setCliente(clienteData);
        }

        const productosResponse = await axios.get(
          "http://localhost:8000/api/productos"
        );
        setProductosDisponibles(productosResponse.data);
      } catch (error) {
        console.error("Error al cargar datos:", error);
      }
    };

    fetchData();
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCliente((prev) => ({ ...prev, [name]: value }));
  };

  const handleAbonoChange = (e) => {
    const { name, value } = e.target;
    setAbono((prev) => ({ ...prev, [name]: parseFloat(value) || 0 }));
  };

  const agregarAbono = () => {
    if (abono.monto && !isNaN(abono.monto)) {
      const fechaActual = new Date().toISOString().split("T")[0];
      const nuevoAbono = { ...abono, fecha: fechaActual };

      const nuevosAbonos = [...cliente.abonos, nuevoAbono];
      const totalAbonos = nuevosAbonos.reduce(
        (total, abono) => total + (parseFloat(abono.monto) || 0),
        0
      );

      setCliente((prev) => ({
        ...prev,
        abonos: nuevosAbonos,
        totalAbonos,
        valorFinal: prev.valorTotalAPagar - totalAbonos,
      }));
      setAbono({ monto: 0, fecha: "" });
    } else {
      alert("Por favor, complete el monto del abono.");
    }
  };

  const eliminarAbono = (index) => {
    const nuevosAbonos = [...cliente.abonos];
    nuevosAbonos.splice(index, 1); // Elimina el abono en la posición "index"

    // Recalcular el total de abonos después de eliminar
    const totalAbonos = nuevosAbonos.reduce(
      (total, abono) => total + (parseFloat(abono.monto) || 0),
      0
    );

    setCliente((prev) => ({
      ...prev,
      abonos: nuevosAbonos,
      totalAbonos,
      valorFinal: prev.valorTotalAPagar - totalAbonos,
    }));
  };

  const asignarProductoACliente = (producto) => {
    const nuevoProducto = {
      ...producto,
      cantidad: 1,
      valorTotal: producto.valorUnitario,
    };
    const nuevosProductos = [...cliente.productos, nuevoProducto];

    const valorTotalAPagar = nuevosProductos.reduce(
      (total, prod) => total + (parseFloat(prod.valorTotal) || 0),
      0
    );

    setCliente((prev) => ({
      ...prev,
      productos: nuevosProductos,
      valorTotalAPagar,
      valorFinal: valorTotalAPagar - prev.totalAbonos,
    }));
  };

  const handleProductoSeleccionado = (e) => {
    const productoId = e.target.value;
    const producto = productosDisponibles.find(
      (prod) => prod._id === productoId
    );

    if (producto) {
      asignarProductoACliente(producto);
      setProductoSeleccionado("");
    } else {
      console.error("Producto no encontrado en productosDisponibles");
    }
  };

  const cambiarCantidadProducto = (index, cantidad) => {
    const nuevosProductos = [...cliente.productos];
    nuevosProductos[index].cantidad = cantidad;
    nuevosProductos[index].valorTotal =
      nuevosProductos[index].cantidad * nuevosProductos[index].valorUnitario;

    const valorTotalAPagar = nuevosProductos.reduce(
      (total, prod) => total + prod.valorTotal,
      0
    );

    setCliente((prev) => ({
      ...prev,
      productos: nuevosProductos,
      valorTotalAPagar,
      valorFinal: valorTotalAPagar - prev.totalAbonos,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const apiCall = id
        ? axios.put(`http://localhost:8000/api/clientes/${id}`, cliente)
        : axios.post("http://localhost:8000/api/clientes", cliente);

      const response = await apiCall;
      console.log("Cliente guardado:", response.data);

      navigate("/clientes/list");
    } catch (error) {
      console.error("Error al guardar cliente:", error);
    }
  };

  const irAPaginaDeProductos = () => {
    navigate("/productos");
  };

  const irAListaDeClientes = () => {
    navigate("/clientes/list");
  };

  return (
    <div className="formulario-clientes-wrapper">
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
        <button type="button" onClick={agregarAbono}>
          Agregar Abono
        </button>

        <h4>Lista de Abonos</h4>
        <ul>
          {cliente.abonos.map((abono, index) => (
            <li key={index}>
              {abono.monto} - {abono.fecha}
              <button type="button" onClick={() => eliminarAbono(index)}>
                Eliminar
              </button>
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
    </div>
  );
};

export default ClienteForm;
