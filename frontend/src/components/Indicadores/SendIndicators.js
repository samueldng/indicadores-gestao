import React, { useState } from 'react';
import { sendIndicators } from '../../api'; // Certifique-se de que essa função está configurada corretamente
import { Button, Form, Alert, Container, Spinner } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom'; // Importar useNavigate
import DatePicker from 'react-datepicker'; // Importar o DatePicker
import "react-datepicker/dist/react-datepicker.css"; // Estilo para o DatePicker

const SendIndicators = () => {
    const [nome, setNome] = useState('');
    const [valor, setValor] = useState('');
    const [mes, setMes] = useState('');
    const [ano, setAno] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const navigate = useNavigate(); // Usar para navegar entre páginas

    const mesesValidos = [
        'Janeiro', 'Fevereiro', 'Março', 'Abril', 
        'Maio', 'Junho', 'Julho', 'Agosto', 
        'Setembro', 'Outubro', 'Novembro', 'Dezembro'
    ];

    const mesMap = {
        'Janeiro': 0,
        'Fevereiro': 1,
        'Março': 2,
        'Abril': 3,
        'Maio': 4,
        'Junho': 5,
        'Julho': 6,
        'Agosto': 7,
        'Setembro': 8,
        'Outubro': 9,
        'Novembro': 10,
        'Dezembro': 11
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setIsSubmitting(true);

        const valorNum = parseFloat(valor.replace(',', '.'));

        // Validação de valor (deve ser número e positivo)
        if (isNaN(valorNum) || valorNum <= 0) {
            setError('Valor deve ser um número válido e positivo.');
            setIsSubmitting(false);
            return;
        }

        // Garantir que o mês seja formatado corretamente e que é um mês válido
        if (!mesesValidos.includes(mes)) {
            setError('Mês inválido. Por favor, insira um mês válido.');
            setIsSubmitting(false);
            return;
        }

        const mesNumero = mesMap[mes];
        if (mesNumero === undefined) {
            setError('Mês não encontrado no mapeamento.');
            setIsSubmitting(false);
            return;
        }

        // Validação do ano
        if (!ano || isNaN(ano) || ano < 1900 || ano > new Date().getFullYear()) {
            setError('Ano inválido. Por favor, insira um ano válido.');
            setIsSubmitting(false);
            return;
        }

        try {
            await sendIndicators({
                nome, 
                valor: valorNum, 
                mes, 
                ano,
            });

            setSuccess('Indicador enviado com sucesso!');
            setTimeout(() => setSuccess(''), 5000); // Limpa o alerta de sucesso após 5 segundos

            // Limpar campos após o envio
            setNome('');
            setValor('');
            setMes('');
            setAno('');
        } catch (error) {
            const errorMessage = error.response ? error.response.data.message : error.message;
            setError(`Erro ao enviar indicador: ${errorMessage}`);
            setTimeout(() => setError(''), 5000); // Limpa o alerta de erro após 5 segundos

            // Limpa os campos em caso de erro também
            setNome('');
            setValor('');
            setMes('');
            setAno('');
        } finally {
            setIsSubmitting(false);
        }
    };

    // Função de logout
    const handleLogout = () => {
        // Remover o token do sessionStorage
        sessionStorage.removeItem('token');
        // Redirecionar para a página de login
        navigate('/login');
    };

    return (
        <Container style={styles.container}>
            <h2 style={styles.title}>Enviar Indicadores</h2>
            {error && <Alert variant="danger" style={styles.alert}>{error}</Alert>}
            {success && <Alert variant="success" style={styles.successAlert}>{success}</Alert>}
            <Form onSubmit={handleSubmit} style={styles.form}>
                <Form.Group controlId="formNome" style={styles.formGroup}>
                    <Form.Label style={styles.label}>Nome do Indicador</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Nome do Indicador"
                        onChange={(e) => setNome(e.target.value)}
                        required
                        value={nome}
                        style={styles.input}
                    />
                </Form.Group>
                <Form.Group controlId="formValor" style={styles.formGroup}>
                    <Form.Label style={styles.label}>Valor</Form.Label>
                    <Form.Control
                        type="number"
                        placeholder="Valor"
                        onChange={(e) => setValor(e.target.value)}
                        required
                        value={valor}
                        style={styles.input}
                    />
                </Form.Group>
                <Form.Group controlId="formMes" style={styles.formGroup}>
                    <Form.Label style={styles.label}>Mês</Form.Label>
                    <Form.Control
                        as="select"
                        onChange={(e) => setMes(e.target.value)}
                        required
                        value={mes}
                        style={styles.input}
                    >
                        <option value="">Selecione o mês</option>
                        {mesesValidos.map((mes, index) => (
                            <option key={index} value={mes}>
                                {mes}
                            </option>
                        ))}
                    </Form.Control>
                </Form.Group>
                <Form.Group controlId="formAno" style={styles.formGroup}>
                    <Form.Label style={styles.label}>Ano</Form.Label>
                    <DatePicker
                        selected={ano ? new Date(ano, 0) : null}
                        onChange={(date) => setAno(date ? date.getFullYear() : '')}
                        showYearPicker
                        dateFormat="yyyy"
                        maxDate={new Date()} // Restringe para o ano atual ou anterior
                        required
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
                            <Spinner animation="border" size="sm" /> Enviando...
                        </>
                    ) : (
                        'Enviar'
                    )}
                </Button>
            </Form>

            {/* Botão de Logout */}
            <Button
                variant="outline-dark"
                onClick={handleLogout}
                style={styles.logoutButton}
            >
                Sair
            </Button>
        </Container>
    );
};

const styles = {
    container: {
        maxWidth: '600px',
        margin: '20px auto',
        padding: '30px',
        backgroundColor: '#ffffff',
        borderRadius: '10px',
        boxShadow: '0 10px 20px rgba(0, 0, 0, 0.1)',
        position: 'relative', // necessário para o botão ser posicionado no topo direito
    },
    title: {
        color: '#6f42c1',
        textAlign: 'center',
        marginBottom: '20px',
        fontSize: '28px',
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
    successAlert: {
        marginBottom: '20px',
        backgroundColor: '#d4edda',  // Cor de fundo verde claro
        color: '#155724',  // Texto verde
        borderColor: '#c3e6cb',  // Borda verde clara
    },
    logoutButton: {
        position: 'absolute',
        top: '10px',
        right: '10px',
        padding: '5px 10px',
        fontSize: '14px',
        borderRadius: '5px',
        backgroundColor: 'transparent',
        border: '1px solid #000',
        color: '#000',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
        transition: 'background-color 0.3s, color 0.3s',
    },
};

export default SendIndicators;
