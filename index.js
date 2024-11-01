const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');
const app = express();
const PORT = 3000;

//Conexión
app.use(cors());
app.use(express.json());

// Configuración de la conexión a la base de datos
const conexion = mysql.createConnection({
    host: "localhost",
    database: "soderia",
    user: "root",
    password: "Nicolino94"
});

// Conectar a la base de datos
conexion.connect(function(err) {
    if (err) {
        throw err;
    } else {
        console.log("Conexión exitosa");
    }
});

// Ruta para cargar clientes
app.post('/api/clientes', (req, res) => {
    console.log(req.body); // Verifica qué datos se reciben
    const { nombre, apellido, dni, calle, numero, localidad, manzana, telefono } = req.body;

    const sql = 'INSERT INTO clientes (nombre, apellido, dni, calle, numero, localidad, manzana, telefono) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';
    const values = [nombre, apellido, dni, calle, numero, localidad, manzana, telefono];

    conexion.query(sql, values, (error, results) => {
        if (error) {
            console.error('Error al insertar en la base de datos:', error);
            return res.status(500).json({ message: 'Error al guardar el cliente', details: error });
        }
        res.status(201).json({ message: 'Cliente registrado exitosamente', id: results.insertId });
    });
});

// Ruta para obtener todos los clientes
app.get('/api/clientes', (req, res) => {
    conexion.query('SELECT * FROM clientes', (err, results) => {
        if (err) {
            return res.status(500).send(err);
        }
        res.json(results);
    });
});

// Ruta para buscar clientes
app.get('/api/clientes/buscar', (req, res) => {
    const { nombre, apellido, calle } = req.query;
    let query = 'SELECT * FROM clientes';
    const params = [];
    const conditions = [];

    // Validación básica de parámetros
    if (nombre && typeof nombre !== 'string') {
        return res.status(400).json({ error: 'El nombre debe ser una cadena de texto' });
    }
    if (apellido && typeof apellido !== 'string') {
        return res.status(400).json({ error: 'El apellido debe ser una cadena de texto' });
    }
    if (calle && typeof calle !== 'string') {
        return res.status(400).json({ error: 'La calle debe ser una cadena de texto' });
    }

    // Construcción de condiciones
    if (nombre) {
        conditions.push('nombre LIKE ?');
        params.push(`%${nombre}%`);
    }
    if (apellido) {
        conditions.push('apellido LIKE ?');
        params.push(`%${apellido}%`);
    }
    if (calle) {
        conditions.push('calle LIKE ?');
        params.push(`%${calle}%`);
    }

    if (conditions.length > 0) {
        query += ' WHERE ' + conditions.join(' OR ');
    }

    // Ejecución de la consulta
    conexion.query(query, params, (err, results) => {
        if (err) {
            console.error('Error en la consulta a la base de datos:', err);
            return res.status(500).json({ error: 'Error interno del servidor' });
        }
        res.json({ status: 'success', results });
    });
});

//Eliminar un cliente
app.delete('/api/clientes/:dni', (req, res) => {
    const { dni } = req.params;

    const query = 'DELETE FROM clientes WHERE dni = ?';
    conexion.query(query, [dni], (err, results) => {
    if (err) {
        return res.status(500).json({ message: 'Error al eliminar el cliente' });
    }
    if (results.affectedRows === 0) {
        return res.status(404).json({ message: 'Cliente no encontrado' });
    }
    return res.status(204).send(); // Eliminación exitosa
});
});

//Modificar un cliente
app.put('/api/clientes/:dni', (req, res) => {
    const { dni } = req.params;
    const { nombre, apellido, calle, numero, localidad, manzana, telefono } = req.body;

    const query = `
        UPDATE clientes 
        SET nombre = ?, apellido = ?, calle = ?, numero = ?, localidad = ?, manzana = ?, telefono = ? 
        WHERE dni = ?`;
    
    conexion.query(query, [nombre, apellido, calle, numero, localidad, manzana, telefono, dni], (err, results) => {
        if (err) {
            return res.status(500).json({ message: 'Error al modificar el cliente' });
        }
        if (results.affectedRows === 0) {
            return res.status(404).json({ message: 'Cliente no encontrado' });
        }
        return res.status(200).json({ message: 'Cliente modificado exitosamente' });
    });
});

//---------------------------------------------------------------------------------------------------------------

// Ruta para obtener todos los productos
app.get('/api/productos', (req, res) => {
    const nombre = req.query.nombre;
    let query = 'SELECT * FROM productos';
    const params = [];

    if (nombre) {
        query += ' WHERE nombre LIKE ?';
        params.push(`%${nombre}%`);
    }

    conexion.query(query, params, (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(results);
    });
});

// Ruta para buscar productos
app.get('/api/productos/buscar', (req, res) => {
    const { nombre, categoria } = req.query; // Puedes añadir más parámetros si lo necesitas
    let query = 'SELECT * FROM productos';
    const params = [];
    
    if (nombre || categoria) {
        query += ' WHERE ';
        const conditions = [];

        if (nombre) {
            conditions.push('nombre LIKE ?');
            params.push(`%${nombre}%`);
        }
        if (categoria) {
            conditions.push('categoria LIKE ?'); // Asegúrate de tener este campo en tu base de datos
            params.push(`%${categoria}%`);
        }

        query += conditions.join(' OR ');
    }

    conexion.query(query, params, (err, results) => {
        if (err) {
            console.error('Error en la consulta a la base de datos:', err);
            return res.status(500).json({ error: 'Error interno del servidor' });
        }
        res.json({ status: 'success', results });
    });
});

// Iniciar el servidor
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});

//-------------------------------------------------------------------------------------------------------------
//GUARDAR PEDIDO
app.post('/api/pedidos', (req, res) => {
    const { dni, productos, fecha, total } = req.body;

    // Primero, obtener el idcliente usando el DNI
    conexion.query('SELECT idcliente FROM clientes WHERE dni = ?', [dni], (err, results) => {
        if (err) {
            return res.status(500).send(err);
        }
        if (results.length === 0) {
            return res.status(404).send('Cliente no encontrado.');
        }

        const idcliente = results[0].idcliente;

        // Insertar el pedido
        conexion.query('INSERT INTO pedidos (idcliente, fecha, total) VALUES (?, ?, ?)', [idcliente, fecha, total], (err, result) => {
            if (err) {
                return res.status(500).send(err);
            }

            const idpedido = result.insertId;

            // Insertar los detalles del pedido, incluyendo el nombre del producto
            const detallePedidos = productos.map(producto => [
                idpedido,
                producto.id, // Asegúrate de que cada producto tenga un ID
                producto.nombre, // Suponiendo que tienes el nombre del producto aquí
                producto.cantidad,
                producto.precio,
            ]);

            // Modificar la consulta para incluir el nombre del producto
            conexion.query('INSERT INTO detalle_pedido (idpedido, idproducto, producto, cantidad, precio) VALUES ?', [detallePedidos], (err) => {
                if (err) {
                    return res.status(500).send(err);
                }
                res.status(200).send('Pedido guardado correctamente.');
            });
        });
    });
});

// Ruta para obtener los pedidos y sus clientes
app.get('/pedidos', (req, res) => {
    const query = `
        SELECT p.*, c.nombre, c.apellido, c.dni, c.calle, c.numero, c.manzana, c.telefono, 
               dp.idproducto, dp.cantidad, dp.precio, (dp.cantidad * dp.precio) AS total_detalle
        FROM pedidos p
        JOIN clientes c ON p.idcliente = c.idcliente
        JOIN detalle_pedido dp ON p.idpedido = dp.idpedido
        LIMIT 0, 1000;
    `;

    conexion.query(query, (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(results);
    });
});

