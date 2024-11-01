// registropedido.js

let productos = [];

function agregarProducto() {
    const producto = document.getElementById('producto').value;
    const cantidad = document.getElementById('cantidad').value;
    const precio = document.getElementById('precio').value;

    if (!producto || !cantidad || !precio) {
        alert('Todos los campos son requeridos.');
        return;
    }

    const total = cantidad * precio;
    productos.push({ producto, cantidad, precio, total });
    mostrarProductos();
    limpiarCampos();
}

function mostrarProductos() {
    const tbody = document.querySelector('#tablaProductos tbody');
    tbody.innerHTML = ''; // Limpiar la tabla

    productos.forEach((prod, index) => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${prod.producto}</td>
            <td>${prod.cantidad}</td>
            <td>${prod.precio}</td>
            <td>${prod.total}</td>
            <td>
                <button onclick="eliminarProducto(${index})">Eliminar</button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

function eliminarProducto(index) {
    productos.splice(index, 1);
    mostrarProductos();
}

function limpiarCampos() {
    document.getElementById('producto').value = '';
    document.getElementById('cantidad').value = '';
    document.getElementById('precio').value = '';
}

/// guardar pedido
let producto = [];

// Función para agregar un producto al pedido
function agregarProducto() {
    const producto = document.getElementById('producto').value;
    const precio = parseFloat(document.getElementById('precio').value);
    const cantidad = parseInt(document.getElementById('cantidad').value);
    
    if (producto && !isNaN(precio) && !isNaN(cantidad)) {
        const total = precio * cantidad;
        productos.push({ producto, cantidad, precio, total });

        // Actualizar la tabla de productos
        actualizarTabla();
        
        // Limpiar el formulario
        document.getElementById('formNuevoPedido').reset();
    } else {
        alert('Por favor, completa todos los campos correctamente.');
    }
}

// Función para actualizar la tabla de productos
function actualizarTabla() {
    const tablaBody = document.querySelector('#tablaProductos tbody');
    tablaBody.innerHTML = ''; // Limpiar la tabla

    productos.forEach((prod, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${prod.producto}</td>
            <td>${prod.cantidad}</td>
            <td>${prod.precio.toFixed(2)}</td>
            <td>${prod.total.toFixed(2)}</td>
            <td><button onclick="eliminarProducto(${index})">Eliminar</button></td>
        `;
        tablaBody.appendChild(row);
    });
}

// Función para eliminar un producto del pedido
function eliminarProducto(index) {
    productos.splice(index, 1);
    actualizarTabla();
}

// Función para guardar el pedido
// Función para calcular el total del pedido
function calcularTotal() {
    let total = 0;

    // Suponiendo que `productos` es un array de objetos donde cada objeto tiene un campo `precio` y `cantidad`
    productos.forEach(producto => {
        total += producto.precio * producto.cantidad; // Multiplica el precio por la cantidad
    });

    return total.toFixed(2); // Retorna el total formateado a dos decimales
}

// Aquí van otras funciones, como guardarPedido y seleccionarCliente
function guardarPedido() {
    if (productos.length === 0 || !clienteSeleccionado) {
        alert('No hay productos en el pedido o no se ha seleccionado un cliente.');
        return;
    }

    const pedido = {
        dni: clienteSeleccionado.dni,
        productos: productos,
        fecha: new Date().toISOString().split('T')[0],
        total: calcularTotal(),
    };

    fetch('http://localhost:3000/api/pedidos', {  
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(pedido),
    })
    .then(response => {
        if (response.ok) {
            alert('Pedido guardado correctamente.');
            productos = [];
            actualizarTabla();
        } else {
            return response.text().then(errorMessage => {
                alert('Error al guardar el pedido: ' + errorMessage);
            });
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Hubo un problema al guardar el pedido.');
    });
}



//-----------------------------------------------------------
// Función para buscar clientes
const buscarClienteInput = document.getElementById('buscarCliente');
const resultadoDiv = document.getElementById('resultado');

async function fetchClients() {
    try {
        const response = await fetch('http://localhost:3000/api/clientes');
        return await response.json();
    } catch (error) {
        console.error('Error al obtener los clientes:', error);
        return [];
    }
}

async function buscarCliente() {
    const query = buscarClienteInput.value.trim(); // Usamos trim para eliminar espacios
    if (query === '') {
        resultadoDiv.innerHTML = '<p class="error">Por favor, ingresa un término de búsqueda.</p>';
        return; // No realizar la búsqueda si el campo está vacío
    }

    const clients = await fetchClients();

    const filteredClients = clients.filter(client =>
        client.nombre.toLowerCase().includes(query.toLowerCase()) ||
        client.apellido.toLowerCase().includes(query.toLowerCase()) ||
        client.dni.includes(query)
    );

    displayClients(filteredClients);
}

function displayClients(clients) {
    resultadoDiv.innerHTML = ''; // Limpiar resultados previos
    
    const table = document.createElement('table');
    table.innerHTML = `
        <thead>
            <tr>
                <th>Nombre</th>
                <th>Apellido</th>
                <th>DNI</th>
                <th>Teléfono</th>
                <th>Calle</th>
                <th>Número</th>
                <th>Manzana</th>
                <th>Acciones</th>
            </tr>
        </thead>
        <tbody></tbody>
    `;

    const tbody = table.querySelector('tbody');

    if (clients.length === 0) {
        const row = document.createElement('tr');
        const cell = document.createElement('td');
        cell.colSpan = 9; // Ocupa todas las columnas
        cell.textContent = 'No se encontraron resultados.';
        row.appendChild(cell);
        tbody.appendChild(row);
    } else {
        clients.forEach(cliente => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${cliente.nombre}</td>
                <td>${cliente.apellido || 'N/A'}</td>
                <td>${cliente.dni || 'N/A'}</td>
                <td>${cliente.telefono || 'N/A'}</td>
                <td>${cliente.calle || 'N/A'}</td>
                <td>${cliente.numero || 'N/A'}</td>
                <td>${cliente.manzana || 'N/A'}</td>
                <td>
                    <button onclick="seleccionarCliente(this)">Seleccionar</button>
                </td>
            `;
            tbody.appendChild(row);
        });
    }

    resultadoDiv.appendChild(table); // Agregar la tabla al div de resultados
}

function cancelarBusqueda() {
    buscarClienteInput.value = ''; // Limpiar el campo de búsqueda
    resultadoDiv.innerHTML = ''; // Limpiar resultados
}

// Cargar clientes al inicio (opcional)
fetchClients();

// Función boton cancelar
function cancelarBusqueda() {
    document.getElementById("buscarCliente").value = ""; // Limpia el campo de búsqueda
    document.getElementById("resultado").innerHTML = ""; // Limpia el resultado
    document.getElementById("tbodyClientes").innerHTML = ""; // Limpia la tabla de resultados
}
//-----------------------------------------------------------
//------------------------------------------------------
//SELECCIONAR CLIETNE
// Variable para almacenar el cliente seleccionado
let clienteSeleccionado = null;

function seleccionarCliente(button) {
    const row = button.parentNode.parentNode; // Obtener la fila correspondiente
    const nombre = row.cells[0].innerText;
    const apellido = row.cells[1].innerText;
    const dni = row.cells[2].innerText;
    const telefono = row.cells[3].innerText;
    const calle = row.cells[4].innerText;
    const numero = row.cells[5].innerText;
    const manzana = row.cells[6].innerText;

    // Crear un objeto con la información del cliente
    clienteSeleccionado = {
        nombre,
        apellido,
        dni,
        telefono,
        calle,
        numero,
        manzana
    };

    // Mostrar mensaje de confirmación o guardar el ID del cliente
    alert(`Cliente seleccionado: ${nombre} ${apellido} DNI ${dni}`);

    // Aquí podrías actualizar algún campo oculto o variable global para vincular con un pedido
    // Por ejemplo: document.getElementById('clienteId').value = clienteSeleccionado.id; // Si tienes ID
}


////////////////////////
//PEDIDOS

fetch('http://localhost:3000/pedidos')
.then(response => response.json())
.then(data => {
    const tbody = document.querySelector('#pedidos-table tbody');
    data.forEach(pedido => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${pedido.idpedido}</td>
            <td>${pedido.nombre}</td>
            <td>${pedido.apellido}</td>
            <td>${pedido.dni}</td>
            <td>${pedido.calle}</td>
            <td>${pedido.numero}</td>
            <td>${pedido.manzana}</td>
            <td>${pedido.telefono}</td>
            <td>${pedido.idproducto}</td>
            <td>${pedido.cantidad}</td>
            <td>${pedido.precio}</td>
            <td>${pedido.total_detalle}</td>
        `;
        tbody.appendChild(row);
    });
})
.catch(error => console.error('Error al cargar pedidos:', error));
