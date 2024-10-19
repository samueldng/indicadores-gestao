const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const router = express.Router();

// Registro de Usuário
router.post('/register', async (req, res) => {
    const { username, password, role } = req.body;

    // Verifica se todos os campos estão presentes
    if (!username || !password || !role) {
        return res.status(400).json({ message: 'Todos os campos são obrigatórios.' });
    }

    try {
        // Verifica se o usuário já existe
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(400).json({ message: 'Nome de usuário já está em uso.' });
        }

        // Cria o usuário sem criptografar a senha
        const user = new User({ username, password, role });

        await user.save();
        res.status(201).json({ message: 'Usuário criado com sucesso' });
    } catch (error) {
        console.error('Erro ao criar usuário:', error); // Log do erro
        res.status(500).json({ message: 'Erro ao criar usuário' });
    }
});

// Login de Usuário
router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    // Verifica se todos os campos estão presentes
    if (!username || !password) {
        return res.status(400).json({ message: 'Usuário e senha são obrigatórios.' });
    }

    try {
        const user = await User.findOne({ username });

        // Verifica se o usuário existe e se a senha é correta
        if (!user || user.password !== password) {
            return res.status(401).json({ message: 'Credenciais inválidas' });
        }

        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.json({ token });
    } catch (error) {
        console.error('Erro ao realizar login:', error); // Log do erro
        res.status(500).json({ message: 'Erro ao realizar login' });
    }
});

module.exports = router;
