import express from 'express';
import Indicador from '../models/Indicador.js';
import authenticate from '../middleware/authenticate.js';

const router = express.Router();

// Definir meses válidos em uma constante para evitar repetição
const mesesValidos = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 
    'Maio', 'Junho', 'Julho', 'Agosto', 
    'Setembro', 'Outubro', 'Novembro', 'Dezembro'
];

// Função utilitária para validar se o mês é válido
const validarMes = (mes) => {
    return mesesValidos.includes(mes);
};

// Middleware de autenticação aplicado a todas as rotas
router.use(authenticate);

// Criar um novo indicador
router.post('/', async (req, res) => {
    const { nome, valor, mes, ano } = req.body;

    // Validação básica
    if (!nome || valor === undefined || !mes || !ano) {
        return res.status(400).json({ message: 'Todos os campos são obrigatórios.' });
    }

    // Validar se o mês é válido
    if (!validarMes(mes)) {
        return res.status(400).json({ message: 'Mês inválido. Use um mês válido.' });
    }

    // Validar valor como número
    if (isNaN(valor)) {
        return res.status(400).json({ message: 'Valor deve ser um número válido.' });
    }

    // Validar ano (exemplo simples de validação)
    const currentYear = new Date().getFullYear();
    if (ano < 2000 || ano > currentYear) {
        return res.status(400).json({ message: 'Ano inválido.' });
    }

    try {
        // Criar o indicador e salvar
        const indicador = new Indicador({ nome, valor, mes, ano });

        // Salvar o indicador no banco de dados
        await indicador.save();

        const userRole = req.user.role; // A role vem do middleware de autenticação

        // Se o usuário não for diretor, enviar mensagem de sucesso simples
        if (userRole !== 'diretor') {
            return res.status(200).json({ message: 'Informações enviadas com sucesso!', indicador });
        }

        // Se for diretor, simular a integração com outro sistema
        // Podemos implementar a função de integração no futuro
        // await enviarParaOutroSistema(indicador); // Exemplo de chamada de integração

        res.status(200).json({
            message: 'Informações enviadas com sucesso! E integração com outro sistema em andamento.',
            indicador
        });

    } catch (error) {
        console.error('Erro ao criar indicador:', error); // Log do erro
        res.status(500).json({ message: 'Erro ao criar indicador', error: error.message });
    }
});

export default router;
