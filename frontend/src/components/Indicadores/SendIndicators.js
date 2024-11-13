import React, { useState } from 'react';
import { sendIndicators } from '../../api'; 
import { Button, Form, Alert, Container } from 'react-bootstrap';

const SendIndicators = () => {
    const [nome, setNome] = useState('');
    const [valor, setValor] = useState('');
    const [mes, setMes] = useState('');
    const [ano, setAno] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setIsSubmitting(true);

        // Conversão do valor para número
        const valorNum = parseFloat(valor);

        if (isNaN(valorNum)) {
            setError('Valor deve ser um número válido.');
            setIsSubmitting(false);
            return;
        }

        try {
            await sendIndicators({ nome, valor: valorNum, mes, ano });
            setSuccess('Indicador enviado com sucesso!');
            // Limpar os campos após o envio
            setNome('');
            setValor('');
            setMes('');
            setAno('');
        } catch (error) {
            setError('Erro ao enviar indicador: ' + (error.response ? error.response.data.message : error.message));
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Container style={styles.container}>
            <h2 style={styles.title}>Enviar Indicadores</h2>
            {error && <Alert variant="danger">{error}</Alert>}
            {success && <Alert variant="success">{success}</Alert>}
            <Form onSubmit={handleSubmit} style={styles.form}>
                <Form.Group controlId="formNome">
                    <Form.Control
                        type="text"
                        placeholder="Nome do Indicador"
                        onChange={(e) => setNome(e.target.value)}
                        required
                        value={nome}
                        style={styles.input}
                    />
                </Form.Group>
                <Form.Group controlId="formValor">
                    <Form.Control
                        type="number"
                        placeholder="Valor"
                        onChange={(e) => setValor(e.target.value)}
                        required
                        value={valor}
                        style={styles.input}
                    />
                </Form.Group>
                <Form.Group controlId="formMes">
                    <Form.Control
                        type="text"
                        placeholder="Mês (ex: 'Janeiro')"
                        onChange={(e) => setMes(e.target.value)}
                        required
                        value={mes}
                        style={styles.input}
                    />
                </Form.Group>
                <Form.Group controlId="formAno">
                    <Form.Control
                        type="number"
                        placeholder="Ano"
                        onChange={(e) => setAno(e.target.value)}
                        required
                        value={ano}
                        style={styles.input}
                    />
                </Form.Group>
                <Button
                    type="submit"
                    variant="primary"
                    disabled={isSubmitting}
                    style={styles.button}
                >
                    {isSubmitting ? 'Enviando...' : 'Enviar'}
                </Button>
            </Form>
        </Container>
    );
};

const styles = {
    container: {
        maxWidth: '600px',
        margin: '20px auto',
        padding: '20px',
        backgroundColor: '#f7f7f7',
        borderRadius: '10px',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
    },
    title: {
        color: '#6f42c1',
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
        backgroundColor: '#ff6900',
        borderColor: '#ff6900',
        transition: 'background-color 0.3s ease',
    },
};

export default SendIndicators;
