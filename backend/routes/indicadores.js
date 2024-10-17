const express = require('express');
const Indicador = require('../models/Indicador');

const router = express.Router();

// Criar um novo indicador
router.post('/', async (req, res) => {
    try {
        const indicador = new Indicador(req.body);
        await indicador.save();
        res.status(201).send(indicador);
    } catch (error) {
        res.status(400).send(error);
    }
});

// Obter todos os indicadores
router.get('/', async (req, res) => {
    try {
        const indicadores = await Indicador.find();
        res.send(indicadores);
    } catch (error) {
        res.status(500).send(error);
    }
});

module.exports = router;
