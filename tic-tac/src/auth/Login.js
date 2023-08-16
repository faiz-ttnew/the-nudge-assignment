import React, { useEffect, useState } from "react";
import { Button, Card, Col, Container, Row } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";

function Login() {
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  let navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const response = await fetch(
      `${process.env.REACT_APP_API_URL}/user/login`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: credentials.email,
          password: credentials.password,
        }),
      }
    );
    const json = await response.json();
    if (json.success) {
      const sessionData = { userSession: json.sessionId, id: json.data.id };
      sessionStorage.setItem("userSession", JSON.stringify(sessionData));
      navigate("/verb");
    } else {
      alert("Invalid credentials");
      setCredentials({ email: "", password: "" });
    }
  };

  const onChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    if (sessionStorage.getItem("userSession")) {
      navigate("/verb");
    }
  }, []);

  return (
    <>
      <br />
      <Container>
        <Row className="my-5">
          <Col></Col>
          <Col>
            <Card style={{ width: "40rem" }}>
              <Card.Header>
                <h4>Sign In</h4>
              </Card.Header>
              <Card.Body>
                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label htmlFor="email" className="form-label">
                      Email
                    </label>
                    <input
                      type="email"
                      className="form-control"
                      id="email"
                      name="email"
                      value={credentials.email}
                      aria-describedby="emailHelp"
                      onChange={onChange}
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="password" className="form-label">
                      Password
                    </label>
                    <input
                      type="password"
                      className="form-control"
                      id="password"
                      name="password"
                      value={credentials.password}
                      onChange={onChange}
                    />
                  </div>
                  <button type="submit" className="btn btn-primary">
                    Submit
                  </button>
                </form>
                <br />
                <Link to="/register">Register</Link>
              </Card.Body>
            </Card>
          </Col>
          <Col></Col>
        </Row>
      </Container>
    </>
  );
}

export default Login;
