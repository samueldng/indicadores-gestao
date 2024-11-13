const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express(); // Inicialize o app aqui

// Middleware
app.use(cors());
app.use(express.json());

<<<<<<< HEAD
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
=======
// Conexão com o MongoDB
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB Connected'))
    .catch(err => {
        console.error('MongoDB connection error:', err);
        process.exit(1); // Finaliza o processo se a conexão falhar
    });

// Rota raiz
>>>>>>> 97b7357cef0287d3e5897116481908f9bb0e63a7
app.get('/', (req, res) => {
    res.send('API Running');
});

<<<<<<< HEAD
// Iniciar o servidor
=======
// Importando as rotas
const authRoutes = require('./routes/auth'); // Verifique o caminho

// Usando as rotas
app.use('/api/auth', authRoutes);

// Middleware de tratamento de erros
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(err.status || 500).json({ message: err.message || 'Algo deu errado!' });
});

// Inicia o servidor
>>>>>>> 97b7357cef0287d3e5897116481908f9bb0e63a7
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
