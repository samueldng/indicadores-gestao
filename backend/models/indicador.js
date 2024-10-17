const mongoose = require('mongoose');

const IndicadorSchema = new mongoose.Schema({
    nome: { type: String, required: true },
    valor: { type: Number, required: true },
    mes: { type: String, required: true }
});

module.exports = mongoose.model('Indicador', IndicadorSchema);
