document.getElementById('formNuevoCliente').addEventListener('submit', function(event) {
    event.preventDefault(); // Evitar el envío del formulario por defecto

    const formData = new FormData(this);
    const data = Object.fromEntries(formData.entries());

    console.log(data); // Agrega esta línea para ver qué datos se están enviando

    fetch('http://localhost:3000/api/clientes', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then(response => {
        if (!response.ok) throw new Error('Error en la respuesta del servidor');
        return response.json();
    })
    .then(data => {
        Swal.fire({
            title: 'Éxito',
            text: data.message,
            icon: 'success',
            confirmButtonText: 'Ok'
        });
        document.getElementById('formNuevoCliente').reset(); // Limpiar el formulario
    })
    .catch(error => {
        Swal.fire({
            title: 'Error',
            text: error.message,
            icon: 'error',
            confirmButtonText: 'Ok'
        });
    });
});





