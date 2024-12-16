import express from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import Indicador from '../models/Indicador.js';
import authenticate from '../middleware/authenticate.js';
import isDirector from '../middleware/isDirector.js'; // Importando o middleware de verificação de permissão

const router = express.Router();

// Middleware para verificar campos obrigatórios
const validateUserFields = (req, res, next) => {
    const { username, password, role } = req.body;
    if (!username || !password || !role) {
        return res.status(400).json({ message: 'Todos os campos são obrigatórios.' });
    }

    const validRoles = ['gestor', 'diretor', 'seguranca_trabalho']; 
    if (!validRoles.includes(role)) {
        return res.status(400).json({ message: 'Role inválido.' });
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

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const user = new User({ username, password: hashedPassword, role });
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
        if (!user) {
            return res.status(401).json({ message: 'Credenciais inválidas' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
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

// Função para validar dados do indicador (sem data)
const validateIndicadorFields = (req, res, next) => {
    const { nome, descricao, mes, ano, valor } = req.body;
    if (!nome || !descricao || !mes || !ano || !valor) {
        return res.status(400).json({ message: 'Todos os campos do indicador são obrigatórios.' });
    }
    next();
};

// Rota para buscar indicadores
router.get('/indicadores', authenticate, async (req, res) => {
    try {
        const indicadores = await Indicador.find();
        if (!indicadores || indicadores.length === 0) {
            return res.status(404).json({ message: 'Nenhum indicador encontrado.' });
        }
        res.json(indicadores);
    } catch (error) {
        console.error('Erro ao buscar indicadores:', error);
        res.status(500).json({ message: 'Erro ao buscar indicadores' });
    }
});

// Rota para criar indicador (somente diretores podem criar)
router.post('/indicadores', authenticate, isDirector, validateIndicadorFields, async (req, res) => {
    const { nome, descricao, mes, ano, valor } = req.body;

    try {
        const indicador = new Indicador({ nome, descricao, mes, ano, valor });
        await indicador.save();
        res.status(201).json({ message: 'Indicador criado com sucesso', indicador });
    } catch (error) {
        console.error('Erro ao criar indicador:', error);
        res.status(500).json({ message: 'Erro ao criar indicador' });
    }
});

// Rota para editar indicador (somente diretores podem editar)
router.put('/indicadores/:id', authenticate, isDirector, validateIndicadorFields, async (req, res) => {
    const { nome, descricao, mes, ano, valor } = req.body;
    const { id } = req.params;

    try {
        const indicador = await Indicador.findByIdAndUpdate(id, { nome, descricao, mes, ano, valor }, { new: true });
        if (!indicador) {
            return res.status(404).json({ message: 'Indicador não encontrado.' });
        }
        res.json({ message: 'Indicador atualizado com sucesso', indicador });
    } catch (error) {
        console.error('Erro ao editar indicador:', error);
        res.status(500).json({ message: 'Erro ao editar indicador' });
    }
});

// Rota para excluir indicador (somente diretores podem excluir)
router.delete('/indicadores/:id', authenticate, isDirector, async (req, res) => {
    const { id } = req.params;

    try {
        const indicador = await Indicador.findByIdAndDelete(id);
        if (!indicador) {
            return res.status(404).json({ message: 'Indicador não encontrado.' });
        }
        res.json({ message: 'Indicador excluído com sucesso' });
    } catch (error) {
        console.error('Erro ao excluir indicador:', error);
        res.status(500).json({ message: 'Erro ao excluir indicador' });
    }
});

// Rota para registro de usuário
router.post('/register', validateUserFields, registerUser);

// Rota para login de usuário
router.post('/login', loginUser);

export default router;
