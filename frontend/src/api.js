import axios from 'axios';

// Cria uma instância do Axios com a URL base
const api = axios.create({
    baseURL: 'http://localhost:5000/api',
});

// Função para registrar um novo usuário
export const registerUser = async (userData) => {
    return await api.post('/auth/register', userData);
};

// Função para fazer login
export const loginUser = async (credentials) => {
    return await api.post('/auth/login', credentials);
};

// Função para obter todos os indicadores
export const getIndicadores = async () => {
    const response = await api.get('/indicadores');
    return response.data; // Retorna os dados da resposta
};

// Adicione mais funções conforme necessário
