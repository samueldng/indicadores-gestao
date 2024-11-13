const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const router = express.Router();

// Middleware para verificar campos obrigatórios
const validateUserFields = (req, res, next) => {
    const { username, password, role } = req.body;
    if (!username || !password || !role) {
        return res.status(400).json({ message: 'Todos os campos são obrigatórios.' });
    }
    next();
};

// Função para registro de usuário
const registerUser = async (req, res) => {
    const { username, password, role } = req.body;

    try {
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(400).json({ message: 'Nome de usuário já está em uso.' });
        }

        // Removido o hashing da senha (segurança reduzida)
        const user = new User({ username, password, role });

        await user.save();
        res.status(201).json({ message: 'Usuário criado com sucesso' });
    } catch (error) {
        console.error('Erro ao criar usuário:', error);
        res.status(500).json({ message: 'Erro ao criar usuário' });
    }
};

// Função para login de usuário
const loginUser = async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: 'Usuário e senha são obrigatórios.' });
    }

    try {
        const user = await User.findOne({ username });

        // Verificação simples da senha
        if (!user || user.password !== password) {
            return res.status(401).json({ message: 'Credenciais inválidas' });
        }

        const token = jwt.sign(
            { id: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        res.json({ token });
    } catch (error) {
        console.error('Erro ao realizar login:', error);
        res.status(500).json({ message: 'Erro ao realizar login' });
    }
};

// Definindo as rotas
router.post('/register', validateUserFields, registerUser);
router.post('/login', loginUser);

// Rota para buscar indicadores
router.get('/indicadores', async (req, res) => {
    try {
        const indicadores = await Indicador.find(); // Certifique-se de que o modelo Indicador esteja importado corretamente
        res.json(indicadores);
    } catch (error) {
        console.error('Erro ao buscar indicadores:', error);
        res.status(500).json({ message: 'Erro ao buscar indicadores' });
    }
});

module.exports = router;
