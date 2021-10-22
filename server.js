import modulo from './archivo.js'
import express from 'express'
import handlebars from 'express-handlebars';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { Server } from "socket.io";
import sqlite3 from './options/SQLite3.js';
import mysql from './options/mariaDB.js';
import knexMod from 'knex';

// 0. CONEXIONES

const knex = knexMod(sqlite3);
const knexMy = knexMod(mysql);


const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

//import handlebars  from 

const app = express();
const PORT = 8080;
const router = express.Router();

const server = app.listen(PORT,()=>{
    console.log(`Estoy escuchando desde el puerto ${server.address().port}`)
})
server.on("error", error => console.log(`Error en servidor ${error}`))

app.use(express.static('public'));

app.engine('hbs', handlebars({
    extname: '.hbs',
    defaultLayout: 'index.hbs',
    layoutsDir: path.join(__dirname, '/views/layouts'),
    partialsDir: path.join(__dirname, '/views/partials')
}))
app.set('view engine', 'hbs')
app.set('views', './views')


app.use(express.json());
app.use(express.urlencoded({extended:true}));

let listProducts = modulo.products;

app.use('/api/productos', router)


// 1. LISTAR PRODUCTOS
router.get('/listar', (req,res) => { 
    if(listProducts) {
        //console.log(listProducts.title)
        knexMy.from('articulos').select('*')
        .then(items => {
            console.log(items);
            knexMy.destroy();
        })
        .catch(e=>{
            console.log('Error en Select:', e);
            knexMy.destroy();
        });
        res.render('view', {
            datos: listProducts,
            listExists: true
        });
    } else {
        res.render('view',{
            data: "No hay productos cargados."
        })
    }
}) 

// 2. LISTAR PRODUCTO INDIVIDUAL
router.get('/listar/:id', (req,res) => {
    let params = req.params;
    if (parseInt(params.id)>0 && parseInt(params.id)<=listProducts.length) {
        let producto = listProducts.filter(function(p){return p.id == parseInt(params.id)});
        res.json({producto})
    } else {
        res.json({error: 'Producto no encontrado'})
    }
}) 

router.get('/guardar', (req,res)=>{
    res.render('home');
})

// 3. GUARDAR PRODUCTOS
router.post('/guardar', (req,res) => {
    let titulo = req.body.title
    let precio = req.body.price
    let thumbnail = req.body.thumbnail
    let item = new modulo.Product(titulo, precio,thumbnail) 
    item.addProducts();
    //item.addId();
    res.redirect('guardar')
    //// CREACIÓN DE TABLA DE PRODUCTOS ////
    knexMy.schema.createTableIfNotExists('articulos', table => {
        table.increments('id'),
        table.string('titulo'),
        table.decimal('precio'),
        table.string('thumbnail')
    })
    //// INSERTAR PRODUCTOS EN TABLA
    .then(()=>{
        console.log('Insertando artículos.');
        return knexMy('articulos').insert({titulo, precio, thumbnail});
    })
    .catch(e=>{
        console.log('Error en proceso:', e);
        knexMy.destroy();
    });
}) 

// 4. ACTUALIZAR DATOS DE PRODUCTOS
router.put('/actualizar/:id', (req,res)=>{
    let params = req.params.id;
    if (listProducts) {
        knexMy.from('articulos').where('id', '=', 2).update({precio: 120})
        .then(() => {
            console.log('Artículo actualizado.')
            knexMy.destroy();
        })
        .catch(e=>{
            console.log('Error en Update:', e);
            knexMy.destroy();
        });

    } else {
        res.json({error: 'Producto no encontrado'})
    }
})

// 5. BORRAR PRODUCTOS
router.delete('/borrar/:id', (req,res)=>{
    let params = req.params.id;
    if (listProducts) {
        knexMy.from('articulos').where('id', '=', params).del()
        .then(() => {
            console.log('Artículo borrado.');
            knexMy.destroy();
        })
        .catch(e=>{
            console.log('Error en Delete:', e);
            knexMy.destroy();
        });
    } else {
        res.json({error: 'Producto no encontrado'})
    }
})


// 6. CENTRO DE MENSAJES
const io = new Server(server);

let mensajes = [];

io.on("connection", (socket) => {
    console.log("Usuario conectado");
    io.sockets.emit('productos', listProducts)
    socket.on('nuevo', data=>{
        mensajes.push(data);
        io.sockets.emit('mensajes', mensajes)
        let email = mensajes.map(e=>e.email)
        let mensaje = mensajes.map(e=>e.mensaje)
        let today = new Date();
        let hora = today.toLocaleTimeString();
        (async ()=>{
            try {
                await knex.schema.dropTableIfExists('centro_mensajes');
                console.log('Tabla borrada.');
        
                await knex.schema.createTable('centro_mensajes', table => {
                        table.increments('id'),
                        table.string('email'),
                        table.string('mensaje'),                        
                        table.string('hora')
                    });
                console.log('Tabla de mensajes creada creada.');

                await knex('centro_mensajes').insert({email, mensaje, hora});
                console.log('Mensaje insertado.');
        
                let mensajes = await knex.from('centro_mensajes').select('*');
                console.log('Mostrando mensaje.');
                for (let mensaje of mensajes) {
                    console.log(`${mensaje['id']}. ${mensaje['email']} - ${mensaje['mensaje']} - ${mensaje['hora']}`);
                }
                knex.destroy();
            }
        
            catch(e) {
                console.log('Error en proceso:', e);
                knex.destroy();
            }
        })();
    })
  });
