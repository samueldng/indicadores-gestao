import React, { useState } from 'react';
import { loginUser } from '../../api'; // Verifique o caminho do seu arquivo API
import { Button, Form, Alert, Container, Spinner } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom'; // Importe useNavigate

const Login = () => {
    const [username, setUsername] = useState('');  // Estado para o nome de usuário
    const [password, setPassword] = useState('');  // Estado para a senha
    const [error, setError] = useState('');        // Estado para erros
    const [isSubmitting, setIsSubmitting] = useState(false);  // Estado para controle de submissão
    const navigate = useNavigate(); // Para navegar para outra página após o login

    // Função para lidar com a submissão do formulário
    const handleSubmit = async (event) => {
        event.preventDefault();
        setError('');  // Limpar erros anteriores
        setIsSubmitting(true);

        // Validação simples
        if (!username || !password) {
            setError('Nome de usuário e senha são obrigatórios');
            setIsSubmitting(false);
            return;
        }

        try {
            // Enviar dados para a API de login
            const response = await loginUser({ username, password });

            // Verifique a estrutura da resposta e extraia o token
            const token = response.token;

            // Armazenar o token no sessionStorage
            sessionStorage.setItem('token', token);

            alert('Login bem-sucedido!');
            navigate('/send-indicators'); // Redireciona para a página de envio de indicadores

        } catch (error) {
            // Exibe a mensagem de erro do backend, se disponível
            const errorMessage = error.response?.data?.message || 'Erro ao fazer login, usuário ou senha incorretos.';
            setError(errorMessage);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Container style={styles.container}>
            <h2 style={styles.title}>Login</h2>
            {error && <Alert variant="danger" style={styles.alert}>{error}</Alert>}
            <Form onSubmit={handleSubmit} style={styles.form}>
                <Form.Group controlId="formUsername" style={styles.formGroup}>
                    <Form.Label style={styles.label}>Nome de Usuário</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Nome de usuário"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        style={styles.input}
                    />
                </Form.Group>
                <Form.Group controlId="formPassword" style={styles.formGroup}>
                    <Form.Label style={styles.label}>Senha</Form.Label>
                    <Form.Control
                        type="password"
                        placeholder="Senha"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        style={styles.input}
                    />
                </Form.Group>
                <Button
                    type="submit"
                    variant="primary"
                    disabled={isSubmitting}
                    style={styles.button}
                >
                    {isSubmitting ? (
                        <>
                            <Spinner animation="border" size="sm" /> Entrando...
                        </>
                    ) : (
                        'Entrar'
                    )}
                </Button>
                <p style={styles.linkText}>
                    Não tem uma conta? <a href="/register" style={styles.link}>Registre-se</a>
                </p>
            </Form>
        </Container>
    );
};

// Estilos do componente
const styles = {
    container: {
        maxWidth: '450px',
        margin: '50px auto',
        padding: '30px',
        backgroundColor: '#ffffff',
        borderRadius: '10px',
        boxShadow: '0 10px 20px rgba(0, 0, 0, 0.1)',
        border: '1px solid #e0e0e0',
    },
    title: {
        color: '#333',
        textAlign: 'center',
        marginBottom: '20px',
        fontSize: '28px',
        fontFamily: 'Arial, sans-serif',
    },
    form: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    formGroup: {
        width: '100%',
        marginBottom: '15px',
    },
    label: {
        fontSize: '16px',
        fontWeight: '500',
        color: '#666',
    },
    input: {
        width: '100%',
        padding: '12px',
        fontSize: '14px',
        borderRadius: '8px',
        border: '1px solid #ddd',
        boxShadow: '0 2px 5px rgba(0, 0, 0, 0.05)',
        transition: 'border-color 0.3s ease',
    },
    button: {
        width: '100%',
        marginTop: '20px',
        padding: '14px',
        borderRadius: '8px',
        backgroundColor: '#ff6900',
        borderColor: '#ff6900',
        color: '#fff',
        fontSize: '18px',
        fontWeight: 'bold',
        transition: 'background-color 0.3s ease',
    },
    alert: {
        marginBottom: '20px',
    },
    linkText: {
        textAlign: 'center',
        marginTop: '15px',
        fontSize: '16px',
        color: '#555',
    },
    link: {
        color: '#ff6900',
        textDecoration: 'none',
    },
};

export default Login;
