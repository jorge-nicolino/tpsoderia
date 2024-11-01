// Cargar clientes al inicio
document.addEventListener('DOMContentLoaded', () => {
    cargarClientes();
});

// Función para cargar clientes desde la API
function cargarClientes() {
    const apiUrl = 'http://localhost:3000/api/clientes';

    fetch(apiUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error('Error en la red');
            }
            return response.json();
        })
        .then(data => {
            mostrarClientes(data);
        })
        .catch(error => {
            console.error('Error al obtener los clientes:', error);
        });
}

// Función para mostrar los clientes en la tabla
function mostrarClientes(clientes) {
    const tbody = document.querySelector('#tablaClientes tbody');
    tbody.innerHTML = ''; // Limpiar la tabla

    clientes.forEach(cliente => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
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
        tbody.appendChild(tr);
    });
}

// Función para eliminar un cliente
function eliminarCliente(button) {
    const fila = button.closest('tr');
    const dni = fila.children[2].innerText; //DNI tercera columna

    Swal.fire({
        title: "¿Estás seguro?",
        text: "¡No podrás revertir esto!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Sí, ¡elimínalo!"
    }).then((resultado) => {
        if (resultado.isConfirmed) {
            fetch(`http://localhost:3000/api/clientes/${dni}`, {
                method: 'DELETE',
            })
            .then(response => {
                if (response.ok) {
                    fila.remove(); // Eliminar la fila de la tabla
                    Swal.fire({
                        title: "¡Eliminado!",
                        text: "El cliente ha sido eliminado.",
                        icon: "success"
                    });
                    cargarClientes(); // Recargar la lista de clientes 
                } else {
                    Swal.fire('Error', 'Error al eliminar el cliente', 'error');
                }
            })
            .catch(error => console.error('Error:', error));
        }
    });
}

// Función para modificar un cliente
function modificarCliente(button) {
    const fila = button.closest('tr');
    const nombre = fila.children[0].innerText; //primera columna
    const apellido = fila.children[1].innerText; //segunda columna
    const dni = fila.children[2].innerText; //columna
    const telefono = fila.children[3].innerText; //cuarta columna
    const calle = fila.children[4].innerText; //quinta columna
    const numero = fila.children[5].innerText; //sexta columna
    const localidad = fila.children[6].innerText; //séptima columna
    const manzana = fila.children[7].innerText; //ctava columna

    Swal.fire({
        title: "Modificar Cliente",
        html: `
            <label for="nombre">Nombre:</label>
            <input id="nombre" class="swal2-input" value="${nombre}">
            <label for="apellido">Apellido:</label>
            <input id="apellido" class="swal2-input" value="${apellido}">
            <label for="dni">DNI:</label>
            <input id="dni" class="swal2-input" value="${dni}" readonly>
            <label for="telefono">Teléfono:</label>
            <input id="telefono" class="swal2-input" value="${telefono}">
            <label for="calle">Calle:</label>
            <input id="calle" class="swal2-input" value="${calle}">
            <label for="numero">Número:</label>
            <input id="numero" class="swal2-input" value="${numero}">
            <label for="localidad">Localidad:</label>
            <input id="localidad" class="swal2-input" value="${localidad}">
            <label for="manzana">Manzana:</label>
            <input id="manzana" class="swal2-input" value="${manzana}">
        `,
        focusConfirm: false,
        showCancelButton: true,
        preConfirm: () => {
            return {
                dni, // Se incluye el DNI 
                nombre: document.getElementById('nombre').value,
                apellido: document.getElementById('apellido').value,
                telefono: document.getElementById('telefono').value,
                calle: document.getElementById('calle').value,
                numero: document.getElementById('numero').value,
                localidad: document.getElementById('localidad').value,
                manzana: document.getElementById('manzana').value,
            };
        }
    }).then((resultado) => {
        if (resultado.isConfirmed) {
            const { nombre, apellido, telefono, calle, numero, localidad, manzana } = resultado.value;

            fetch(`http://localhost:3000/api/clientes/${dni}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ nombre, apellido, dni, telefono, calle, numero, localidad, manzana })
            })
            .then(response => {
                if (response.ok) {
                    // Actualiza los valores en la tabla
                    fila.children[0].innerText = nombre; // Nombre
                    fila.children[1].innerText = apellido; // Apellido
                    fila.children[2].innerText = dni; // DNI
                    fila.children[3].innerText = telefono; // Teléfono
                    fila.children[4].innerText = calle; // Calle
                    fila.children[5].innerText = numero; // Número
                    fila.children[6].innerText = localidad; // Localidad
                    fila.children[7].innerText = manzana; // Manzana

                    Swal.fire('¡Modificado!', 'El cliente ha sido modificado.', 'success');
                } else {
                    Swal.fire('Error', 'Error al modificar el cliente', 'error');
                }
            })
            .catch(error => console.error('Error:', error));
        }
    });
}

// Función para cancelar la edición
function cancelarEdicion() {
    document.getElementById('formularioModificar').style.display = 'none';
}

// Función boton cancelar
function cancelarBusqueda() {
    document.getElementById("buscarCliente").value = ""; // Limpia el campo de búsqueda
    document.getElementById("resultado").innerHTML = ""; // Limpia el resultado
    document.getElementById("tbodyClientes").innerHTML = ""; // Limpia la tabla de resultados
}

