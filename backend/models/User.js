const mongoose = require('mongoose');

// Definindo o esquema do usuário
const UserSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true, trim: true },
<<<<<<< HEAD
    password: { type: String, required: true },
    role: { 
        type: String, 
        enum: ['gestor', 'diretor', 'seguranca_trabalho'], // Adicionando o novo papel
        required: true 
    },
    segurancaTrabalho: { // Novo campo
        type: Boolean,
        default: false
    }
}, { timestamps: true }); // Adiciona timestamps de criação e atualização

// Removido o método de verificação da senha
// UserSchema.methods.isPasswordValid = async function(password) {
//     const bcrypt = require('bcrypt');
//     return await bcrypt.compare(password, this.password);
// };
=======
    password: { type: String, required: true }, // Armazenar como texto simples
    role: { type: String, enum: ['gestor', 'diretor'], required: true }
}, { timestamps: true });

// Método para verificar a senha (sem hash)
UserSchema.methods.isPasswordValid = function(password) {
    return password === this.password; // Comparação direta
};
>>>>>>> 97b7357cef0287d3e5897116481908f9bb0e63a7

// Remover o middleware de hash antes de salvar
UserSchema.pre('save', function(next) {
    next(); // Apenas chama o próximo middleware sem modificar a senha
});

// Exportando o modelo
module.exports = mongoose.model('User', UserSchema);
