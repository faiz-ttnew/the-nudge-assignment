import React from "react";
import { Alert, Col, Container, Row } from "react-bootstrap";

function VerbCell({verbTitle}) {
  return (
    <div>
      <Container fluid>
        <Row className="justify-content-md-center">
          <Col xs lg="2">
            <Alert variant="dark">
              <p>
                Verb: <b>{verbTitle}</b>
              </p>
            </Alert>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default VerbCell;
