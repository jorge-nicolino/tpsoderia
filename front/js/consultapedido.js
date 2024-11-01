// consultapedidos.js

document.addEventListener('DOMContentLoaded', () => {
    cargarPedidos();
});

function cargarPedidos() {
    fetch('http://localhost:3000/api/pedidos')
        .then(response => response.json())
        .then(data => mostrarPedidos(data))
        .catch(error => console.error('Error al cargar pedidos:', error));
}

function mostrarPedidos(pedidos) {
    const tbody = document.querySelector('#tablaPedidos tbody');
    tbody.innerHTML = ''; // Limpiar la tabla

    pedidos.forEach(pedido => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${pedido.id}</td>
            <td>${pedido.cliente}</td>
            <td>${pedido.producto}</td>
            <td>${pedido.cantidad}</td>
            <td>${pedido.precio.toFixed(2)}</td>
            <td>${(pedido.cantidad * pedido.precio).toFixed(2)}</td>
            <td>
                <button onclick="modificarPedido(${pedido.id})">Modificar</button>
                <button onclick="eliminarPedido(${pedido.id})">Eliminar</button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

// Implementa las funciones modificarPedido y eliminarPedido según tus necesidades
function modificarPedido(id) {
    // Lógica para modificar el pedido
}

function eliminarPedido(id) {
    fetch(`http://localhost:3000/api/pedidos/${id}`, {
        method: 'DELETE'
    })
    .then(response => {
        if (response.ok) {
            cargarPedidos(); // Recargar pedidos después de eliminar
        } else {
            console.error('Error al eliminar el pedido');
        }
    })
    .catch(error => console.error('Error:', error));
}
