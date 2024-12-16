import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import authenticate from './middleware/authenticate.js';  // Importando middleware de autenticação
import authRoutes from './routes/auth.js';  // Rota de autenticação
import indicadoresRoutes from './routes/indicadores.js';  // Rota de indicadores

dotenv.config();

// Middleware
const app = express();  // Inicializando o app aqui
app.use(cors());
app.use(express.json());

// Verificando se as variáveis de ambiente estão definidas
if (!process.env.MONGODB_URI) {
    console.error('MONGODB_URI is not defined in .env file');
    process.exit(1);  // Finaliza o processo se a variável não for definida
}

// Conexão com o MongoDB
mongoose.set('strictQuery', false); // Evita warnings de queries no mongoose
mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('MongoDB Connected'))
    .catch(err => {
        console.error('MongoDB connection error:', err);
        process.exit(1);  // Finaliza o processo se a conexão falhar
    });

// Usando as rotas
app.use('/api/auth', authRoutes);  // Usando a rota de autenticação
app.use('/api/indicadores', authenticate, indicadoresRoutes);  // Protegendo a rota de indicadores com o middleware de autenticação

// Rota raiz
app.get('/api', (req, res) => {
    res.send('API está funcionando');
});

// Middleware de tratamento de erros
app.use((err, req, res, next) => {
    console.error(err.stack);
    if (err.name === 'ValidationError') {
        return res.status(400).json({ message: 'Erro de validação', details: err.errors });
    }
    res.status(err.status || 500).json({ message: err.message || 'Algo deu errado!' });
});

// Iniciando o servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
