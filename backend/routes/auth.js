const express = require('express');
const bcrypt = require('bcrypt');
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

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({ username, password: hashedPassword, role });
        
        await user.save();
        res.status(201).json({ message: 'Usuário criado com sucesso' });
    } catch (error) {
        res.status(500).json({ message: 'Erro ao criar usuário', error: error.message });
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

        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({ message: 'Credenciais inválidas' });
        }

        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.json({ token });
    } catch (error) {
        res.status(500).json({ message: 'Erro ao realizar login', error: error.message });
    }
});

module.exports = router;
