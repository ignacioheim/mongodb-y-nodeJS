import mongoose from 'mongoose';

const productosCollection = 'productos';

const ProductosEsquema = mongoose.Schema({
    titulo: {type: String, require: true, minLength: 3, maxLenghth: 50},
    precio: {type: Number, require: true, min: 0, max: 1000000},
    thumbnail: {type: String, require: true, minLength: 0, maxLenghth: 1000},
});


export const Productos = mongoose.model(productosCollection, ProductosEsquema);