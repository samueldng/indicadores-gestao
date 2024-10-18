// src/components/Indicadores/Indicadores.js
import React, { useEffect, useState } from 'react';
import { getIndicadores } from '../../api'; // Atualizando para a função correta

const Indicadores = () => {
    const [indicadores, setIndicadores] = useState([]);

    useEffect(() => {
        const loadIndicadores = async () => {
            try {
                const data = await getIndicadores(); // Usando a função correta
                setIndicadores(data);
            } catch (error) {
                console.error('Erro ao buscar indicadores:', error);
            }
        };
        loadIndicadores();
    }, []);

    return (
        <div>
            <h2>Lista de Indicadores</h2>
            <ul>
                {indicadores.map((indicador) => (
                    <li key={indicador._id}>{indicador.nome}</li> // Usando _id e nome corretamente
                ))}
            </ul>
        </div>
    );
};

export default Indicadores;
