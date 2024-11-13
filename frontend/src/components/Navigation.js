import React from 'react';
import { Link } from 'react-router-dom';
import { Navbar, Nav } from 'react-bootstrap';

const Navigation = () => {
    return (
        <Navbar bg="light" expand="lg">
            <Navbar.Brand as={Link} to="/">Indicadores</Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
                <Nav className="me-auto">
                    <Nav.Link as={Link} to="/register">Registrar</Nav.Link>
                    <Nav.Link as={Link} to="/login">Login</Nav.Link>
                    <Nav.Link as={Link} to="/indicadores">Indicadores</Nav.Link>
                    <Nav.Link as={Link} to="/send-indicators">Enviar Indicadores</Nav.Link>
                    <Nav.Link as={Link} to="/send-indica-seg">Enviar Indicadores de Segurança</Nav.Link> {/* Adicionado */}
                </Nav>
            </Navbar.Collapse>
        </Navbar>
    );
};

export default Navigation;
