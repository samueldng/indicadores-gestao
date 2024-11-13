const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express(); // Inicialize o app aqui

// Middleware
app.use(cors());
app.use(express.json());

// Verifica se a variável de ambiente está correta
console.log('MONGODB_URI:', process.env.MONGODB_URI);

// Conexão com o MongoDB
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => console.log('MongoDB Connected'))
    .catch(err => console.log('MongoDB connection error:', err));

// Rotas
const authRoutes = require('./routes/auth'); // Adicionando a rota de autenticação
const indicadoresRoute = require('./routes/indicadores');
app.use('/api/auth', authRoutes); // Usando a rota de autenticação
app.use('/api/indicadores', indicadoresRoute);

// Rota principal
app.get('/', (req, res) => {
    res.send('API Running');
});

// Iniciar o servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
