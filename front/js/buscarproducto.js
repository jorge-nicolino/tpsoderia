const buscarProductoInput = document.getElementById('buscarProducto');
const resultadoDiv = document.getElementById('resultadoProductos');

async function fetchProductos() {
    try {
        const response = await fetch('http://localhost:3000/api/productos');
        return await response.json();
    } catch (error) {
        console.error('Error al obtener los productos:', error);
        return [];
    }
}

async function buscarProducto() {
    const query = buscarProductoInput.value.trim(); // Usamos trim para eliminar espacios
    if (query === '') {
        resultadoDiv.innerHTML = '<p class="error">Por favor, ingresa un término de búsqueda.</p>';
        return; // No realizar la búsqueda si el campo está vacío
    }

    const productos = await fetchProductos();

    const filteredProductos = productos.filter(producto =>
        producto.producto.toLowerCase().includes(query.toLowerCase()) ||
        producto.precio.includes(query) // Esto puede no ser necesario si solo buscas por nombre
    );

    displayProductos(filteredProductos);
}

function displayProductos(productos) {
    resultadoDiv.innerHTML = ''; // Limpiar resultados previos
    
    const table = document.createElement('table');
    table.innerHTML = `
        <thead>
            <tr>
                <th>Producto</th>
                <th>Precio</th>
                <th>Acciones</th>
            </tr>
        </thead>
        <tbody></tbody>
    `;

    const tbody = table.querySelector('tbody');

    if (productos.length === 0) {
        const row = document.createElement('tr');
        const cell = document.createElement('td');
        cell.colSpan = 3; // Ocupa todas las columnas
        cell.textContent = 'No se encontraron resultados.';
        row.appendChild(cell);
        tbody.appendChild(row);
    } else {
        productos.forEach(producto => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${producto.producto}</td>
                <td>${producto.precio}</td>
                <td>
                    <button onclick="modificarProducto(this)">Modificar</button>
                    <button onclick="eliminarProducto(this)">Eliminar</button>
                </td>
            `;
            tbody.appendChild(row);
        });
    }

    resultadoDiv.appendChild(table); // Agregar la tabla al div de resultados
}

function cancelarBusqueda() {
    buscarProductoInput.value = ''; // Limpiar el campo de búsqueda
    resultadoDiv.innerHTML = ''; // Limpiar resultados
}

// Cargar productos al inicio (opcional)
fetchProductos();
