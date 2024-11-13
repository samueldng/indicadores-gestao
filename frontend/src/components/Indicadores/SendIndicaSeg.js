import React, { useState } from 'react';
import { sendIndicators } from '../../api'; 
import { Button, Form, Alert, Container } from 'react-bootstrap';

const SendIndicaSeg = () => {
    const [qtdIncidentes, setQtdIncidentes] = useState('');
    const [qtdAdvertencias, setQtdAdvertencias] = useState('');
    const [qtdDS, setQtdDS] = useState('');
    const [temasDS, setTemasDS] = useState('');
    const [informacoesDesconformidades, setInformacoesDesconformidades] = useState('');
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

        // Validação simples
        const incidentesNum = parseInt(qtdIncidentes);
        const advertenciasNum = parseInt(qtdAdvertencias);
        const dsNum = parseInt(qtdDS);

        if (isNaN(incidentesNum) || isNaN(advertenciasNum) || isNaN(dsNum)) {
            setError('Todos os campos de quantidade devem ser números válidos.');
            setIsSubmitting(false);
            return;
        }

        try {
            await sendIndicators({
                qtdIncidentes: incidentesNum,
                qtdAdvertencias: advertenciasNum,
                qtdDS: dsNum,
                temasDS,
                informacoesDesconformidades,
                mes,
                ano
            });
            setSuccess('Indicadores de segurança do trabalho enviados com sucesso!');
            // Limpar os campos após o envio
            setQtdIncidentes('');
            setQtdAdvertencias('');
            setQtdDS('');
            setTemasDS('');
            setInformacoesDesconformidades('');
            setMes('');
            setAno('');
        } catch (error) {
            setError('Erro ao enviar indicadores: ' + (error.response ? error.response.data.message : error.message));
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Container style={styles.container}>
            <h2 style={styles.title}>Enviar Indicadores de Segurança do Trabalho</h2>
            {error && <Alert variant="danger">{error}</Alert>}
            {success && <Alert variant="success">{success}</Alert>}
            <Form onSubmit={handleSubmit} style={styles.form}>
                <Form.Group controlId="formQtdIncidentes">
                    <Form.Control
                        type="number"
                        placeholder="Quantidade de Incidentes"
                        onChange={(e) => setQtdIncidentes(e.target.value)}
                        required
                        value={qtdIncidentes}
                        style={styles.input}
                    />
                </Form.Group>
                <Form.Group controlId="formQtdAdvertencias">
                    <Form.Control
                        type="number"
                        placeholder="Quantidade de Advertências"
                        onChange={(e) => setQtdAdvertencias(e.target.value)}
                        required
                        value={qtdAdvertencias}
                        style={styles.input}
                    />
                </Form.Group>
                <Form.Group controlId="formQtdDS">
                    <Form.Control
                        type="number"
                        placeholder="Quantidade de DS"
                        onChange={(e) => setQtdDS(e.target.value)}
                        required
                        value={qtdDS}
                        style={styles.input}
                    />
                </Form.Group>
                <Form.Group controlId="formTemasDS">
                    <Form.Control
                        type="text"
                        placeholder="Temas dos DS"
                        onChange={(e) => setTemasDS(e.target.value)}
                        required
                        value={temasDS}
                        style={styles.input}
                    />
                </Form.Group>
                <Form.Group controlId="formInformacoesDesconformidades">
                    <Form.Control
                        as="textarea"
                        placeholder="Informações sobre Desconformidades Prediais"
                        onChange={(e) => setInformacoesDesconformidades(e.target.value)}
                        required
                        value={informacoesDesconformidades}
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

export default SendIndicaSeg;
