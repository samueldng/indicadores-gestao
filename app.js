const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const jwt = require('jsonwebtoken');

const app = express();

// Middleware
app.use(cors({
    origin: 'http://localhost:3000',  // Permitir apenas o frontend rodando em localhost:3000
    credentials: true,  // Permite enviar cookies com credenciais
}));
app.use(express.json());

// Conexão com o MongoDB
mongoose.connect(process.env.MONGODB_URI, { 
    useNewUrlParser: true, 
    useUnifiedTopology: true 
})
.then(() => console.log('MongoDB Connected'))
.catch(err => console.error('MongoDB connection error:', err));

// Middleware de autenticação
const authenticate = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1]; // Extrai o token do cabeçalho Authorization

    if (!token) {
        return res.status(403).json({ message: 'Token não fornecido.' });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(401).json({ message: 'Token inválido ou expirado.' });
        }

        req.user = decoded;  // Armazena as informações do usuário no req.user
        next();  // Chama o próximo middleware ou rota
    });
};

// Rotas
const authRoutes = require('./backend/routes/auth');
const indicadorRoutes = require('./backend/routes/indicadores');

// Usar as rotas
app.use('/api/auth', authRoutes);  // Rota para login e registro
app.use('/api/indicadores', authenticate, indicadorRoutes);  // Protege a rota de indicadores com autenticação

// Middleware de tratamento de erros (opcional, mas recomendado)
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Algo deu errado!' });
});

// Inicia o servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
