import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { body, validationResult } from 'express-validator';
import User from '../models/User.js';

// Função de validação para o registro de usuário
const validateUserRegistration = [
    body('username')
        .trim()
        .notEmpty().withMessage('Nome de usuário é obrigatório')
        .isLength({ min: 4 }).withMessage('Nome de usuário deve ter pelo menos 4 caracteres'),
    body('password')
        .trim()
        .isLength({ min: 6 }).withMessage('Senha deve ter pelo menos 6 caracteres')
        .matches(/\d/).withMessage('Senha deve conter pelo menos um número'),
    body('role')
        .trim()
        .notEmpty().withMessage('Função é obrigatória')
        .isIn(['admin', 'user', 'diretor']).withMessage('Função inválida, deve ser "admin", "user" ou "diretor"')
];

// Função de registro de usuário
const registerUser = async (req, res) => {
    // Validação dos campos
    await Promise.all(validateUserRegistration.map(validation => validation.run(req)));

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { username, password, role } = req.body;

    try {
        // Verifica se o usuário já existe
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(400).json({ message: 'Nome de usuário já está em uso.' });
        }

        // Criptografando a senha
        const hashedPassword = await bcrypt.hash(password, 10);

        // Criando o usuário
        const user = new User({ username, password: hashedPassword, role });

        // Salvando o usuário no banco
        await user.save();

        res.status(201).json({
            message: 'Usuário criado com sucesso',
            user: { username: user.username, role: user.role } // Retorna os dados essenciais do usuário
        });
    } catch (error) {
        console.error('Erro ao criar usuário:', error);
        res.status(500).json({ message: 'Erro ao criar usuário', details: error.message });
    }
};

// Função de validação para o login de usuário
const validateUserLogin = [
    body('username').trim().notEmpty().withMessage('Nome de usuário é obrigatório'),
    body('password').trim().notEmpty().withMessage('Senha é obrigatória')
];

// Função de login de usuário
const loginUser = async (req, res) => {
    // Validação dos campos
    await Promise.all(validateUserLogin.map(validation => validation.run(req)));

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { username, password } = req.body;

    try {
        // Verifica se o usuário existe
        const user = await User.findOne({ username });

        // Se o usuário não existir ou as credenciais estiverem erradas
        if (!user) {
            return res.status(401).json({ message: 'Credenciais inválidas' });
        }

        // Comparar a senha fornecida com a senha armazenada no banco
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Credenciais inválidas' });
        }

        // Gerando o token JWT
        const token = jwt.sign(
            { id: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRATION || '1h' } // Expiração configurável
        );

        res.json({
            token,
            user: { username: user.username, role: user.role } // Retorna o token e dados do usuário
        });
    } catch (error) {
        console.error('Erro ao realizar login:', error);
        res.status(500).json({ message: 'Erro ao realizar login', details: error.message });
    }
};

// Exportando as funções para as rotas
export { registerUser, loginUser };
