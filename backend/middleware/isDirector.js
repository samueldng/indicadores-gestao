const isDirector = (req, res, next) => {
    // Verifica se o campo 'role' está presente no objeto req.user
    if (!req.user || !req.user.role) {
        return res.status(400).json({ message: 'Erro: Cargo do usuário não encontrado.' });
    }

    const { role } = req.user;

    // Verifica se o cargo do usuário é 'diretor'
    if (role !== 'diretor') {
        return res.status(403).json({ 
            message: `Acesso negado. Somente diretores podem acessar esta rota. Cargo atual: ${role}.` 
        });
    }

    next();  // O usuário é um diretor, então continua para a próxima etapa
};

export default isDirector;
