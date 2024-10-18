// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Register from './components/Auth/Register';
import Login from './components/Auth/Login'; // Importando o componente de Login
import Indicadores from './components/Indicadores/Indicadores';

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/register" element={<Register />} />
                <Route path="/login" element={<Login />} /> {/* Rota para Login */}
                <Route path="/indicadores" element={<Indicadores />} />
                <Route path="/" element={<h1>Bem-vindo à API de Indicadores!</h1>} />
            </Routes>
        </Router>
    );
}

export default App;
