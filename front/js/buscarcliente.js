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
                <th>Localidad</th>
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
                <td>${cliente.localidad || 'N/A'}</td>
                <td>${cliente.manzana || 'N/A'}</td>
                <td>
                    <button onclick="modificarCliente(this)">Modificar</button>
                    <button onclick="eliminarCliente(this)">Eliminar</button>
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



