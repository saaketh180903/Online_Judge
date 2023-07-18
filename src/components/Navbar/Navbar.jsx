import React, { useEffect, useState } from 'react';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { Link } from 'react-router-dom';

function Navbarfunc() {

  return (
    <>
      <Navbar bg="dark" data-bs-theme="dark">
        <Container>
          <Navbar.Brand>Code Checker</Navbar.Brand>
          <Nav className="me-auto">
            <Nav.Link as={Link} to={'/'}>Problem List</Nav.Link>
            <Nav.Link as={Link} to={'/Login'}>Login</Nav.Link>
            <Nav.Link as={Link} to={'/Signup'}>Signup</Nav.Link>
            <Nav.Link as={Link} to={'/UserProfile'}>UserProfile</Nav.Link>
            <Nav.Link as={Link} to={'/Submissions'}>Submissions</Nav.Link>
          </Nav>
        </Container>
      </Navbar>
    </>
  );
}

export default Navbarfunc;
