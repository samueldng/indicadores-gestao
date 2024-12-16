import React, { useEffect, useState } from 'react';
import { getIndicadores } from '../../api'; // Atualizando para a função correta
import { Spinner, Alert } from 'react-bootstrap'; // Para feedback visual de carregamento e erro

const Indicadores = () => {
    const [indicadores, setIndicadores] = useState([]);
    const [isLoading, setIsLoading] = useState(true);  // Para mostrar o carregamento
    const [error, setError] = useState(null);  // Para armazenar erros

    useEffect(() => {
        const loadIndicadores = async () => {
            try {
                const data = await getIndicadores(); // Usando a função correta
                setIndicadores(data);
            } catch (error) {
                console.error('Erro ao buscar indicadores:', error);
                setError('Não foi possível carregar os indicadores. Tente novamente.');
            } finally {
                setIsLoading(false);  // Finaliza o estado de carregamento
            }
        };

        loadIndicadores();
    }, []);

    return (
        <div>
            <h2>Lista de Indicadores</h2>
            
            {isLoading && (
                <div className="text-center">
                    <Spinner animation="border" variant="primary" /> Carregando indicadores...
                </div>
            )}

            {error && <Alert variant="danger">{error}</Alert>}  {/* Exibe erro, se houver */}

            {!isLoading && !error && indicadores.length === 0 && (
                <p>Não há indicadores para exibir no momento.</p>
            )}

            {!isLoading && !error && indicadores.length > 0 && (
                <ul>
                    {indicadores.map((indicador) => (
                        <li key={indicador._id}>
                            <strong>{indicador.nome}</strong>: {indicador.descricao || 'Sem descrição'}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default Indicadores;
