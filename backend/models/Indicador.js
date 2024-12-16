import mongoose from 'mongoose';

// Mapa de meses
const mesMap = {
    'Janeiro': '01',
    'Fevereiro': '02',
    'Março': '03',
    'Abril': '04',
    'Maio': '05',
    'Junho': '06',
    'Julho': '07',
    'Agosto': '08',
    'Setembro': '09',
    'Outubro': '10',
    'Novembro': '11',
    'Dezembro': '12',
};

// Schema para o Indicador
const IndicadorSchema = new mongoose.Schema({
    nome: { 
        type: String, 
        required: true,
        trim: true,
        maxlength: 255 
    },
    valor: { 
        type: Number, 
        required: true,
        min: 0 
    },
    mes: { 
        type: String, 
        required: true,
        enum: Object.keys(mesMap), // Usando o mapa de meses diretamente
    },
    ano: { 
        type: Number,
        required: true,
        min: 2000, 
        max: new Date().getFullYear(), 
    },
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
        ano: indicadorObject.ano,
    };
};

export default mongoose.model('Indicador', IndicadorSchema);
