const mongoose = require('mongoose');

const IndicadorSchema = new mongoose.Schema({
    nome: { 
        type: String, 
        required: true,
        trim: true // Remove espaços em branco no início e no final
    },
    valor: { 
        type: Number, 
        required: true,
        min: 0 // Impede valores negativos
    },
    mes: { 
        type: String, 
        required: true,
        enum: [
            'Janeiro', 'Fevereiro', 'Março', 'Abril', 
            'Maio', 'Junho', 'Julho', 'Agosto', 
            'Setembro', 'Outubro', 'Novembro', 'Dezembro'
        ] // Lista de meses permitidos
    },
    ano: { // Adicionando um campo para o ano
        type: Number,
        required: true,
        min: 2000, // Impede anos muito antigos
        max: new Date().getFullYear() // Limita ao ano atual
    }
});

// Método para exibir os dados de forma formatada (opcional)
IndicadorSchema.methods.toJSON = function() {
    const indicador = this;
    const indicadorObject = indicador.toObject();
    return {
        id: indicadorObject._id,
        nome: indicadorObject.nome,
        valor: indicadorObject.valor,
        mes: indicadorObject.mes,
        ano: indicadorObject.ano
    };
};

module.exports = mongoose.model('Indicador', IndicadorSchema);
