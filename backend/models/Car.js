const mongoose = require('mongoose');

const carSchema = new mongoose.Schema({
    nome: { type: String, required: true },
    estoque: { type: Number, required: true },
    ano: { type: Number, required: true },
    modelo: { type: String, required: true },
    imagem: { type: String, required: true }  // Campo de imagem, que armazena o caminho da imagem
});

const Car = mongoose.model('Car', carSchema);

module.exports = Car;
