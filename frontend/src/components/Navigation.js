import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Navbar, Nav, Button } from 'react-bootstrap';

const Navigation = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const navigate = useNavigate();

    // Verificar se o token existe e se o usuário está autenticado
    useEffect(() => {
        const token = sessionStorage.getItem('token');
        setIsAuthenticated(!!token);  // Se o token existir, o usuário está autenticado
    }, []);

    // Função para logout
    const handleLogout = () => {
        sessionStorage.removeItem('token');  // Remove o token
        setIsAuthenticated(false);  // Atualiza o estado
        navigate('/login');  // Redireciona para a página de login
    };

    return (
        <Navbar bg="light" expand="lg">
            <Navbar.Brand as={Link} to="/">Indicadores</Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
                <Nav className="me-auto">
                    <Nav.Link as={Link} to="/indicadores">Indicadores</Nav.Link>
                    <Nav.Link as={Link} to="/send-indicators">Enviar Indicadores</Nav.Link>
                    <Nav.Link as={Link} to="/send-indica-seg">Enviar Indicadores de Segurança</Nav.Link>

                    {!isAuthenticated ? (
                        <>
                            <Nav.Link as={Link} to="/register">Registrar</Nav.Link>
                            <Nav.Link as={Link} to="/login">Login</Nav.Link>
                        </>
                    ) : (
                        <>
                            <Button variant="outline-danger" onClick={handleLogout}>Sair</Button>
                        </>
                    )}
                </Nav>
            </Navbar.Collapse>
        </Navbar>
    );
};

export default Navigation;
