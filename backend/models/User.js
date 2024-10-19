const mongoose = require('mongoose');

// Definindo o esquema do usuário
const UserSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true, trim: true },
    password: { type: String, required: true }, // Armazenar como texto simples
    role: { type: String, enum: ['gestor', 'diretor'], required: true }
}, { timestamps: true });

// Método para verificar a senha (sem hash)
UserSchema.methods.isPasswordValid = function(password) {
    return password === this.password; // Comparação direta
};

// Remover o middleware de hash antes de salvar
UserSchema.pre('save', function(next) {
    next(); // Apenas chama o próximo middleware sem modificar a senha
});

// Exportando o modelo
module.exports = mongoose.model('User', UserSchema);
