import React from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import Register from './components/Auth/Register';
import Login from './components/Auth/Login'; 
import Indicadores from './components/Indicadores/Indicadores';
import SendIndicators from './components/Indicadores/SendIndicators'; 
import SendIndicaSeg from './components/Indicadores/SendIndicaSeg'; // Importando a nova página
import Navigation from './components/Navigation'; 

const App = () => {
    const location = useLocation();

    // Condição para ocultar a navegação
    const hideNavigation = location.pathname === '/login' || location.pathname === '/register' || location.pathname === '/send-indicators';

    return (
        <>
            {!hideNavigation && <Navigation />}
            <Routes>
                <Route path="/register" element={<Register />} />
                <Route path="/login" element={<Login />} />
                <Route path="/indicadores" element={<Indicadores />} />
                <Route path="/send-indicators" element={<SendIndicators />} />
                <Route path="/send-indica-seg" element={<SendIndicaSeg />} /> {/* Rota para enviar indicadores de segurança */}
                <Route path="/" element={<h1>Bem-vindo à API de Indicadores!</h1>} />
            </Routes>
        </>
    );
};

const WrapperApp = () => (
    <Router>
        <App />
    </Router>
);

export default WrapperApp;
