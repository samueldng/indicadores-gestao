const mongoose = require('mongoose');

// Definindo o esquema do usuário
const UserSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true, trim: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['gestor', 'diretor'], required: true }
}, { timestamps: true }); // Adiciona timestamps de criação e atualização

// Método para verificar a senha (pode ser útil mais tarde)
UserSchema.methods.isPasswordValid = async function(password) {
    const bcrypt = require('bcrypt');
    return await bcrypt.compare(password, this.password);
};

// Exportando o modelo
module.exports = mongoose.model('User', UserSchema);
