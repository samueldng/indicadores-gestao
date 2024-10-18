import React, { useState } from 'react';
import { loginUser } from '../../api'; // Ajuste este import para o seu arquivo API
import { Button, Form, Alert, Container } from 'react-bootstrap';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsSubmitting(true);

        try {
            await loginUser({ username, password });
            alert('Login bem-sucedido!'); // Redirecione ou faça outra ação aqui
        } catch (error) {
            setError('Erro ao fazer login: ' + error.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Container style={styles.container}>
            <h2 style={styles.title}>Login</h2>
            {error && <Alert variant="danger">{error}</Alert>}
            <Form onSubmit={handleSubmit} style={styles.form}>
                <Form.Group controlId="formUsername">
                    <Form.Control
                        type="text"
                        placeholder="Nome de usuário"
                        onChange={(e) => setUsername(e.target.value)}
                        required
                        value={username}
                        style={styles.input}
                    />
                </Form.Group>
                <Form.Group controlId="formPassword">
                    <Form.Control
                        type="password"
                        placeholder="Senha"
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        value={password}
                        style={styles.input}
                    />
                </Form.Group>
                <Button
                    type="submit"
                    variant="primary"
                    disabled={isSubmitting}
                    style={styles.button}
                >
                    {isSubmitting ? 'Entrando...' : 'Entrar'}
                </Button>
                <p style={styles.linkText}>
                    Não tem uma conta? <a href="/register">Registre-se</a>
                </p>
            </Form>
        </Container>
    );
};

const styles = {
    container: {
        maxWidth: '400px',
        margin: '20px auto',
        padding: '20px',
        backgroundColor: '#f7f7f7', // Um cinza suave
        borderRadius: '10px',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
    },
    title: {
        color: '#6f42c1', // Roxo
        textAlign: 'center',
        marginBottom: '20px',
    },
    form: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    input: {
        width: '100%',
        marginBottom: '10px',
        borderRadius: '5px',
        border: '1px solid #ccc',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
    },
    button: {
        marginTop: '10px',
        width: '100%',
        borderRadius: '5px',
        backgroundColor: '#ff6900', // Laranja
        borderColor: '#ff6900', // Laranja
        transition: 'background-color 0.3s ease',
    },
    linkText: {
        textAlign: 'center',
        marginTop: '10px',
    },
};

export default Login;
