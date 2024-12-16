import Indicador from '../models/Indicador.js';

const mesMap = {
    'Janeiro': '01',
    'Fevereiro': '02',
    'Março': '03',
    'Abril': '04',
    'Maio': '05',
    'Junho': '06',
    'Julho': '07',
    'Agosto': '08',
    'Setembro': '09',
    'Outubro': '10',
    'Novembro': '11',
    'Dezembro': '12',
};

// Função para simular integração com outro sistema
const enviarParaOutroSistema = async (indicador) => {
    // Simulação de envio para outro sistema
    console.log('Enviando indicador para outro sistema:', indicador);
    // Aqui você pode adicionar a lógica real de integração, como chamadas HTTP para uma API externa
};

const enviarIndicador = async (req, res) => {
    const { nome, valor, mes, ano } = req.body;

    try {
        // Validar os campos
        if (!nome || typeof nome !== 'string' || nome.trim() === '') {
            return res.status(400).json({ message: 'Nome é obrigatório e deve ser uma string' });
        }

        if (typeof valor !== 'number' || valor < 0) {
            return res.status(400).json({ message: 'Valor é obrigatório, deve ser um número não negativo' });
        }

        if (!mes || typeof mes !== 'string' || !mesMap[mes]) {
            return res.status(400).json({ message: 'Mês é obrigatório e deve ser um mês válido' });
        }

        // Validar o ano - Certificar que seja um número válido e dentro de um intervalo
        const anoAtual = new Date().getFullYear();
        if (!ano || typeof ano !== 'number' || ano < 2000 || ano > anoAtual) {
            return res.status(400).json({ message: `Ano é obrigatório e deve ser um ano válido entre 2000 e ${anoAtual}` });
        }

        // Criar um novo indicador sem o campo 'data'
        const indicador = new Indicador({ nome, valor, mes, ano });

        // Salvar o indicador no banco de dados
        await indicador.save();

        // Verificar se o usuário está autenticado e tem a role de 'diretor'
        const userRole = req.user?.role; // 'role' vem do middleware de autenticação

        if (!userRole) {
            return res.status(403).json({ message: 'Você não tem permissão para realizar esta ação' });
        }

        // Se for diretor, integrar com outro sistema
        if (userRole === 'diretor') {
            try {
                await enviarParaOutroSistema(indicador);
                return res.status(200).json({ message: 'Informações enviadas com sucesso! E integração com outro sistema em andamento.' });
            } catch (integrationError) {
                console.error('Erro na integração com outro sistema:', integrationError);
                return res.status(500).json({ message: 'Erro na integração com o sistema externo', details: integrationError.message });
            }
        }

        // Se o usuário não for diretor, enviar alerta de sucesso
        res.status(200).json({ message: 'Informações enviadas com sucesso!' });

    } catch (error) {
        console.error('Erro ao enviar indicador:', error);
        res.status(500).json({ message: 'Erro ao enviar indicador', details: error.message });
    }
};

export { enviarIndicador };
