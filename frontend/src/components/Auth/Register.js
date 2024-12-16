import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Importe o useNavigate
import { registerUser } from '../../api'; // Verifique o caminho do seu arquivo API
import { Button, Form, Alert, Container, Spinner } from 'react-bootstrap';

const Register = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const navigate = useNavigate(); // Instancia do useNavigate

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setIsSubmitting(true);

        try {
            await registerUser({ username, password, role });
            setSuccess('Usuário registrado com sucesso!');
            setUsername('');
            setPassword('');
            setRole('');

            // Redireciona para a página de login após 3 segundos
            setTimeout(() => {
                navigate('/login'); // Caminho para a página de login
            }, 3000); // Aguarda 3 segundos antes de redirecionar
        } catch (error) {
            setError('Erro ao registrar usuário: ' + error.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Container style={styles.container}>
            <h2 style={styles.title}>Registro de Usuário</h2>
            {error && <Alert variant="danger">{error}</Alert>}
            {success && <Alert variant="success">{success}</Alert>}
            <Form onSubmit={handleSubmit} style={styles.form}>
                <Form.Group controlId="formUsername" style={styles.formGroup}>
                    <Form.Label style={styles.label}>Nome de Usuário</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Nome de usuário"
                        onChange={(e) => {
                            setUsername(e.target.value);
                            setError(''); // Limpar erro ao digitar
                        }}
                        required
                        value={username}
                        style={styles.input}
                    />
                </Form.Group>
                <Form.Group controlId="formPassword" style={styles.formGroup}>
                    <Form.Label style={styles.label}>Senha</Form.Label>
                    <Form.Control
                        type="password"
                        placeholder="Senha"
                        onChange={(e) => {
                            setPassword(e.target.value);
                            setError(''); // Limpar erro ao digitar
                        }}
                        required
                        value={password}
                        style={styles.input}
                    />
                </Form.Group>
                <Form.Group controlId="formRole" style={styles.formGroup}>
                    <Form.Label style={styles.label}>Papel</Form.Label>
                    <Form.Control
                        as="select"
                        onChange={(e) => {
                            setRole(e.target.value);
                            setError(''); // Limpar erro ao selecionar
                        }}
                        required
                        value={role}
                        style={styles.input}
                    >
                        <option value="">Selecione um papel</option>
                        <option value="gestor">Gestor</option>
                        <option value="diretor">Diretor</option>
                        <option value="seguranca_trabalho">Segurança do Trabalho</option>
                    </Form.Control>
                </Form.Group>
                <Button
                    type="submit"
                    variant="primary"
                    disabled={isSubmitting}
                    style={styles.button}
                >
                    {isSubmitting ? (
                        <>
                            <Spinner animation="border" size="sm" /> Registrando...
                        </>
                    ) : (
                        'Registrar'
                    )}
                </Button>
            </Form>
        </Container>
    );
};

const styles = {
    container: {
        maxWidth: '400px', // Ajustado para manter a consistência do login
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
        marginBottom: '20px',
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
};

export default Register;
