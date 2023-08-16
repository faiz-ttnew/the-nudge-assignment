import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Card, Col, Container, Row } from "react-bootstrap";

function Register() {
  const [credentials, setCredentials] = useState({
    email: "",
    password: "",
    name: "",
  });
  let navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const response = await fetch(
      `${process.env.REACT_APP_API_URL}/user/register`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: credentials.name,
          email: credentials.email,
          password: credentials.password,
        }),
      }
    );
    const json = await response.json();
    if (json.success === true) {
      navigate("/login");
    } else {
      alert(json.message);
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
      <Container>
        <Row className="my-5">
          <Col></Col>
          <Col>
            <Card className="text-center" style={{ width: "40rem" }}>
              <Card.Header>
                <h4>Sign Up</h4>
              </Card.Header>
              <Card.Body>
                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label htmlFor="name" className="form-label">
                      Name
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="name"
                      name="name"
                      value={credentials.name}
                      aria-describedby="emailHelp"
                      onChange={onChange}
                    />
                  </div>
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
                <Link to="/">Login</Link>
              </Card.Body>
            </Card>
          </Col>
          <Col></Col>
        </Row>
      </Container>
    </>
  );
}

export default Register;
