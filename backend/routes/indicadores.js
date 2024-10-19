const express = require('express');
const Indicador = require('../models/Indicador');
const authenticate = require('../middleware/authenticate');

const router = express.Router();

// Aplica o middleware de autenticação a todas as rotas abaixo
router.use(authenticate);

// Criar um novo indicador
router.post('/', async (req, res) => {
    const { nome, valor, mes, ano } = req.body;

    // Validação básica
    if (!nome || valor === undefined || !mes || !ano) {
        return res.status(400).json({ message: 'Todos os campos são obrigatórios.' });
    }

    try {
        const indicador = new Indicador(req.body);
        await indicador.save();
        res.status(201).json(indicador);
    } catch (error) {
        res.status(400).json({ message: 'Erro ao criar indicador', error: error.message });
    }
});

// Obter todos os indicadores
router.get('/', async (req, res) => {
    try {
        const indicadores = await Indicador.find();
        res.json(indicadores);
    } catch (error) {
        res.status(500).json({ message: 'Erro ao obter indicadores', error: error.message });
    }
});

// Atualizar um indicador
router.put('/:id', async (req, res) => {
    const { nome, valor, mes, ano } = req.body;

    // Validação básica
    if (!nome && valor === undefined && !mes && !ano) {
        return res.status(400).json({ message: 'Pelo menos um campo deve ser fornecido para atualização.' });
    }

    try {
        const indicador = await Indicador.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!indicador) {
            return res.status(404).json({ message: 'Indicador não encontrado' });
        }
        res.json(indicador);
    } catch (error) {
        res.status(400).json({ message: 'Erro ao atualizar indicador', error: error.message });
    }
});

// Deletar um indicador
router.delete('/:id', async (req, res) => {
    try {
        const indicador = await Indicador.findByIdAndDelete(req.params.id);
        if (!indicador) {
            return res.status(404).json({ message: 'Indicador não encontrado' });
        }
        res.json({ message: 'Indicador deletado com sucesso' });
    } catch (error) {
        res.status(500).json({ message: 'Erro ao deletar indicador', error: error.message });
    }
});

module.exports = router;
