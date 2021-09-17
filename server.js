import modulo from './archivo.js'
import express from 'express'
import handlebars from 'express-handlebars';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

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

router.get('/listar', (req,res) => { 
    if(listProducts.length>0) {
        //console.log(listProducts.title)
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

// router.get('/', function(req, res) {
//     res.render('index', { datos: json(listProducts) });
// });

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

router.post('/guardar', (req,res) => {
    let title = req.body.title
    let price = req.body.price
    let thumbnail = req.body.thumbnail
    let item = new modulo.Product(title, price,thumbnail) 
    item.addProducts();
    item.addId();
    res.redirect('listar')
}) 

router.put('/actualizar/:id', (req,res)=>{
    let params = req.params;
    if (parseInt(params.id)>0 && parseInt(params.id)<=listProducts.length) {
        let producto = listProducts.filter(function(p){return p.id == parseInt(params.id)});    
        producto[0].title = req.body.title;     
        producto[0].price = req.body.price;
        producto[0].thumbnail = req.body.thumbnail
        res.json({producto})
    } else {
        res.json({error: 'Producto no encontrado'})
    }
})

router.delete('/borrar/:id', (req,res)=>{
    let params = req.params;
    if (parseInt(params.id)>0 && parseInt(params.id)<=listProducts.length) {
        let producto = listProducts.filter(function(p){return p.id == parseInt(params.id)});
        listProducts.pop(producto)
        res.json({producto})
    } else {
        res.json({error: 'Producto no encontrado'})
    }
})