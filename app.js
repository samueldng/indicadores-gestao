const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Conexão com o MongoDB
mongoose.connect(process.env.MONGODB_URI, { 
    useNewUrlParser: true, 
    useUnifiedTopology: true 
})
.then(() => console.log('MongoDB Connected'))
.catch(err => console.error('MongoDB connection error:', err));

// Rotas
const authRoutes = require('./backend/routes/auth');
const indicadorRoutes = require('./backend/routes/indicadores'); // Corrigido para o nome correto do arquivo

app.use('/api/auth', authRoutes);
app.use('/api/indicadores', indicadorRoutes);

// Inicia o servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
