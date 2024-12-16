import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

// Definindo o esquema do usuário
const UserSchema = new mongoose.Schema({
    username: { 
        type: String, 
        required: [true, 'O nome de usuário é obrigatório'], 
        unique: [true, 'O nome de usuário já está em uso'],
        trim: true,
        maxlength: [255, 'O nome de usuário não pode ter mais de 255 caracteres']
    },
    password: { 
        type: String, 
        required: [true, 'A senha é obrigatória'],
        minlength: [6, 'A senha deve ter pelo menos 6 caracteres']
    },
    role: { 
        type: String, 
        enum: ['gestor', 'diretor', 'seguranca_trabalho'], // Papéis válidos
        required: [true, 'O papel (role) é obrigatório']
    },
    segurancaTrabalho: { // Novo campo
        type: Boolean,
        default: false // Definido como false por padrão
    }
}, { timestamps: true }); // Adiciona timestamps de criação e atualização

// Método para verificar a senha (usando bcrypt para verificação segura)
UserSchema.methods.isPasswordValid = async function(password) {
    return await bcrypt.compare(password, this.password); // Comparação segura usando bcrypt
};

// Middleware para criptografar a senha antes de salvar no banco de dados
UserSchema.pre('save', async function(next) {
    // Verifica se a senha foi modificada antes de aplicar o hash
    if (this.isModified('password')) {
        this.password = await bcrypt.hash(this.password, 10); // Criptografa a senha antes de salvar
    }
    next();
});

// Método para exibir os dados do usuário sem a senha (opcional)
UserSchema.methods.toJSON = function() {
    const user = this;
    const userObject = user.toObject();
    delete userObject.password; // Remove a senha do objeto retornado
    return userObject;
};

// Exportando o modelo
export default mongoose.model('User', UserSchema);
