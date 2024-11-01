// Función para mostrar los pedidos en la tabla
function mostrarPedidos(pedidos) {
    const tablaBody = document.querySelector('#tablaProductos tbody');
    tablaBody.innerHTML = ''; // Limpiar tabla antes de mostrar los resultados

    pedidos.forEach(pedido => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${pedido.nombre}</td>
            <td>${pedido.apellido}</td>
            <td>${pedido.direccion}</td>
            <td>${pedido.manzana}</td>
            <td>${JSON.stringify(pedido.detalle)}</td> <!-- O formatear según lo que contenga detalle -->
            <td>${pedido.total.toFixed(2)}</td>
            <td><button onclick="eliminarPedido(${pedido.id})">Eliminar</button></td>
        `;
        tablaBody.appendChild(row);
    });
}

// Función para eliminar un pedido (ejemplo)
function eliminarPedido(id) {
    fetch(`tu_endpoint_para_eliminar_pedido/${id}`, { method: 'DELETE' })
        .then(response => {
            if (response.ok) {
                alert('Pedido eliminado correctamente.');
                obtenerPedidos(); // Recargar la lista de pedidos
            } else {
                alert('Error al eliminar el pedido.');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Hubo un problema al eliminar el pedido.');
        });
}

// Llamar a la función para obtener los pedidos cuando la página cargue
document.addEventListener('DOMContentLoaded', obtenerPedidos);

