import React from "react";
import { Button, Container, Navbar } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

function NavBar() {
    const navigate = useNavigate()
    const logout = ()=> {
        sessionStorage.clear('userSession');
        navigate('/');
    }
  return (
    <>
      <Navbar className="bg-body-tertiary">
        <Container>
          <Navbar.Brand>Word Quiz</Navbar.Brand>
          <Navbar.Toggle />
          <Navbar.Collapse className="justify-content-end">
            <Navbar.Text>
              <Button onClick={logout}>Logout</Button>
            </Navbar.Text>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </>
  );
}

export default NavBar;
