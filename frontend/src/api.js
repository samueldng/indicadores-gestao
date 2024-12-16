import axios from 'axios';

// Cria uma instância do Axios com a URL base
const api = axios.create({
    baseURL: 'http://localhost:5000/api',  // URL base para todas as requisições da API
});

// Função para tratar erros de forma centralizada
const handleApiError = (error) => {
    let message = 'Erro desconhecido.';
    if (error.response) {
        message = error.response.data?.message || 'Erro desconhecido da API.';
    } else if (error.request) {
        message = 'Erro de comunicação com a API: sem resposta.';
    } else {
        message = 'Erro ao fazer a requisição: ' + error.message;
    }
    alert(message);  // Exibe o erro para o usuário
    // Logar o erro completo para depuração
    console.error(error);
    throw new Error(message);
};

// Função para registrar um novo usuário
export const registerUser = async (userData) => {
    try {
        const response = await api.post('/auth/register', userData);
        return response.data;  // Retorna os dados da resposta após sucesso
    } catch (error) {
        handleApiError(error);
    }
};

// Função para fazer login
export const loginUser = async (credentials) => {
    try {
        const response = await api.post('/auth/login', credentials);

        // Certifique-se de que o token foi retornado
        const { token } = response.data;

        if (token) {
            // Armazenar o token no sessionStorage
            sessionStorage.setItem('token', token);
            console.log('Token armazenado com sucesso:', token); // Log de verificação
        } else {
            throw new Error('Token não retornado pela API');
        }

        return response.data;  // Retorna os dados da resposta após sucesso
    } catch (error) {
        handleApiError(error);
    }
};

// Função para obter todos os indicadores (requisição autenticada)
export const getIndicadores = async () => {
    try {
        const token = sessionStorage.getItem('token');
        
        // Se não houver token ou ele for inválido
        if (!token) {
            throw new Error('Token não fornecido. Por favor, faça login novamente.');
        }

        const response = await api.get('/indicadores', {
            headers: {
                Authorization: `Bearer ${token}` // Adiciona o token ao cabeçalho
            }
        });
        return response.data; // Retorna os dados da resposta
    } catch (error) {
        handleApiError(error);
    }
};

// Função para enviar um novo indicador com autenticação via token
export const sendIndicators = async (indicatorData) => {
    try {
        // Obter o token JWT do sessionStorage
        const token = sessionStorage.getItem('token');

        // Verificar se o token é válido
        if (!token || token.split('.').length !== 3) {
            throw new Error('Token de autenticação inválido ou malformado. Faça login novamente.');
        }

        // Enviar a requisição com o token JWT no cabeçalho
        const response = await api.post('/indicadores', indicatorData, {
            headers: {
                Authorization: `Bearer ${token}`, // Adiciona o token ao cabeçalho
            }
        });

        return response.data;  // Retorna a resposta do servidor após o envio
    } catch (error) {
        handleApiError(error);
    }
};

// Interceptando todas as requisições para adicionar o token no cabeçalho
api.interceptors.request.use((config) => {
    const token = sessionStorage.getItem('token');
    if (token) {
        // Adiciona o token ao cabeçalho de todas as requisições
        config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
}, (error) => {
    // Caso o interceptor falhe, o erro será retornado
    return Promise.reject(error);
});

// Adicionando um interceptor de resposta para tratar erros de autenticação
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            // Token expirado ou inválido, redireciona o usuário para o login
            alert('Sessão expirada. Por favor, faça login novamente.');
            sessionStorage.removeItem('token');  // Limpa o token armazenado
            window.location.href = '/login';  // Redireciona para a tela de login
        } else {
            handleApiError(error);  // Chama a função de tratamento de erro para outros casos
        }
        return Promise.reject(error);
    }
);
