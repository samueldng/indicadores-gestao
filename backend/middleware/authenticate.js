const jwt = require('jsonwebtoken');

const authenticate = (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    // Verifica se o token foi fornecido
    if (!token) {
        return res.status(401).json({ message: 'Acesso negado: Token não fornecido' });
    }

    try {
        // Verifica e decodifica o token
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        req.user = verified; // Armazena as informações do usuário verificado no request
        next();
    } catch (error) {
        // Mensagens de erro específicas
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ message: 'Token expirado' });
        } else if (error.name === 'JsonWebTokenError') {
            return res.status(400).json({ message: 'Token inválido' });
        }
        return res.status(500).json({ message: 'Erro ao verificar o token' });
    }
};

module.exports = authenticate;
