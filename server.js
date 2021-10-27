import modulo from './archivo.js'
import express from 'express'
import handlebars from 'express-handlebars';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { Server } from "socket.io";;
import mongoose from 'mongoose';
import {Productos}  from './models/productos.js';
import {Mensajes}  from './models/mensajes.js';
import moment from 'moment';
moment.locale('es')


// 0. CONEXIONES

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

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


app.use('/api/productos', router)

const URI = 'mongodb://localhost:27017/ecommerce';

mongoose.connect(URI, 
    { 
        useNewUrlParser: true,
        useUnifiedTopology: true 
    })    
console.log('Conectado a la base de datos de Mongo');

// 1. LISTAR PRODUCTOS

let listProducts = modulo.products;

// 1.a Cuento la cantidad 
let countProd = await Productos.count()
//console.log(countProd);
let productos = await Productos.find()


router.get('/listar', async (req,res) => { 
    if(countProd>0) {
        let products = await Productos.find().lean()
        console.log(products);
        res.render('view', {
            datos: products,
            listExists: true
        })
    } else {
        res.render('view',{
            data: "No hay productos cargados."
        })
    }
}) 


router.get('/listar/:id', async (req,res) => {
     let id = req.params.id
     //console.log(id);
    if (countProd>0) {
        let producto = await Productos.findOne({_id: id})
        res.json({producto})
    } else {
        res.json({error: 'Producto no encontrado'})
    }
}) 

router.get('/guardar', (req,res)=>{
    res.render('home');
})

// 3. GUARDAR PRODUCTOS
router.post('/guardar', async (req,res) => {
    let titulo = req.body.title
    let precio = req.body.price
    let thumbnail = req.body.thumbnail
    let item = new modulo.Product(titulo, precio,thumbnail) 
    item.addProducts();
    
    res.redirect('guardar')
    //// CREACIÓN DE TABLA DE PRODUCTOS ////
    let product = await Productos.create({titulo: titulo, precio: precio, thumbnail: thumbnail})
    console.log(product);    
}) 

// 4. ACTUALIZAR DATOS DE PRODUCTOS
router.put('/actualizar/:id', async (req,res)=>{
    let id = req.params.id;
       if (countProd>0) {
           let producto = await Productos.updateOne({_id: id}, {$set: {precio: 300}})
           res.json({producto})
    } else {
        res.json({error: 'Producto no encontrado'})
    }
})

// 5. BORRAR PRODUCTOS
router.delete('/borrar/:id', async (req,res)=>{
    let params = req.params.id;
    if (countProd>0) {
        let producto = await Productos.deleteOne({_id: id})
        res.json({producto})
    } else {
        res.json({error: 'Producto no encontrado'})
    }
})


// 6. CENTRO DE MENSAJES

const io = new Server(server);


io.on("connection", async (socket) => {
    console.log("Usuario conectado");
    let productos = await Productos.find()
    io.sockets.emit('productos', productos)
    socket.on('nuevo', async data=>{
        //mensajes.push(data); 
        let horaFecha = moment().format('MMMM Do YYYY, h:mm:ss a')
        let msg = await Mensajes.create({email: data.email, mensaje: data.mensaje, hora: horaFecha})
        let mensajesMongo = await Mensajes.find()
        io.sockets.emit('mensajes', mensajesMongo)              
    })
  });
