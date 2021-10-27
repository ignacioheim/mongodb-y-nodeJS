import mongoose from 'mongoose';

const mensajesCollection = 'mensajes';

const MensajesEsquema = mongoose.Schema({
    email: {type: String, require: true, minLength: 3, maxLenghth: 50},
    mensaje: {type: String, require: true, minLength: 3, maxLenghth: 500},
    hora: {type: String},
});


export const Mensajes = mongoose.model(mensajesCollection, MensajesEsquema);