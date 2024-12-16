import jwt from 'jsonwebtoken';

const authenticate = (req, res, next) => {
    // Verifica se o token foi fornecido no cabeçalho Authorization
    const token = req.header('Authorization')?.trim().replace(/^Bearer\s+/, '');

    // Se não foi fornecido, retorna erro 401
    if (!token) {
        return res.status(401).json({ message: 'Acesso negado: Token não fornecido' });
    }

    try {
        // Verifica se a chave secreta está configurada no ambiente
        const jwtSecret = process.env.JWT_SECRET;
        if (!jwtSecret) {
            return res.status(500).json({ message: 'Erro interno: Chave secreta não configurada' });
        }

        // Tenta verificar e decodificar o token
        const decoded = jwt.verify(token, jwtSecret);

        // Armazena as informações do usuário decodificadas no objeto req.user
        req.user = { ...decoded, tokenType: 'Bearer' };  // Adicionando tipo de token (se necessário)

        // Passa o controle para o próximo middleware ou rota
        next();
    } catch (error) {
        console.error('Erro ao verificar o token:', error);

        // Se o token estiver expirado
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({
                message: 'Token expirado',
                expiredAt: error.expiredAt ? error.expiredAt : 'Desconhecido', // Hora de expiração
            });
        }

        // Se o token for inválido
        if (error.name === 'JsonWebTokenError') {
            return res.status(400).json({
                message: 'Token inválido. Certifique-se de que o token está correto.',
                errorDetails: error.message // Mensagem do erro para depuração
            });
        }

        // Em caso de erro inesperado
        return res.status(500).json({
            message: 'Erro ao verificar o token',
            errorDetails: error.message // Para fornecer mais informações sobre o erro
        });
    }
};

export default authenticate;
