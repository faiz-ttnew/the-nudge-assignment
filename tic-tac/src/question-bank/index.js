import React, { useEffect, useState } from "react";
import { Button, Col, Container, Form, Row } from "react-bootstrap";
import {
  Link,
  useNavigate,
  useParams,
} from "react-router-dom";

function AddQuestion() {
  const param = useParams();

  const [buttonText, setButtonText] = useState("Submit");

  const [inputFields, setInputFields] = useState({
    question: "",
    title: "",
    grid: [
      {
        label: "Simple Past",
        value: "Simple Past",
        sequence: 1,
        question: "",
        answer: "",
        explanation: "",
      },
      {
        label: "Past Continuous",
        value: "Past Continuous",
        sequence: 2,
        question: "",
        answer: "",
        explanation: "",
      },
      {
        label: "Past Perfect",
        value: "Past Perfect",
        sequence: 3,
        question: "",
        answer: "",
        explanation: "",
      },
      {
        label: "Simple Present",
        value: "Simple Present",
        sequence: 4,
        question: "",
        answer: "",
        explanation: "",
      },
      {
        label: "Present Continuous",
        value: "Present Continuous",
        sequence: 5,
        question: "",
        answer: "",
        explanation: "",
      },
      {
        label: "Present Perfect",
        value: "Present Perfect",
        sequence: 6,
        question: "",
        answer: "",
        explanation: "",
      },
      {
        label: "Simple Future",
        value: "Simple Future",
        sequence: 7,
        question: "",
        answer: "",
        explanation: "",
      },
      {
        label: "Future Continuous",
        value: "Future Continuous",
        sequence: 8,
        question: "",
        answer: "",
        explanation: "",
      },
      {
        label: "Future Perfect",
        value: "Future Perfect",
        sequence: 9,
        question: "",
        answer: "",
        explanation: "",
      },
    ],
  });
  const navigate = useNavigate();

  const onChange = (index, event) => {
    let grid = [...inputFields["grid"]];
    grid[index][event.target.name] = event.target.value;
    setInputFields({ ...inputFields, grid });
  };

  const handleChange = (e) => {
    setInputFields({ ...inputFields, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = inputFields.grid.map((item, index) => {
      return { ...item, question: inputFields["question"] };
    });

    const payload = { title: inputFields["title"], grid: res };
    let isValid = true;
    payload.grid.map((e) => {
      if (
        e.label === "" ||
        e.value === "" ||
        e.question === "" ||
        e.answer === ""
      ) {
        isValid = false;
      }
    });

    let response;
    if (!isValid) {
      alert("Please fill all the fields");
    } else {
      if (Object.keys(param).length > 0) {
        response = await fetch(
          `${process.env.REACT_APP_API_URL}/verb/update-verb/${param["id"]}`,
          {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          }
        );
      } else {
        response = await fetch(`${process.env.REACT_APP_API_URL}/verb`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      }

      response = await response.json();
      if (response["success"]) {
        alert(response["message"]);
        navigate("/verb");
      }
    }
  };

  const findVerb = async () => {
    let response = await fetch(
      `${process.env.REACT_APP_API_URL}/verb/find-verb/${param["id"]}`
    );

    response = await response.json();
    response = response["data"][0];

    setInputFields({
      ...inputFields,
      ...response,
      question: response["grid"][0]["question"],
    });
  };

  useEffect(() => {
    if (Object.keys(param).length > 0) {
      findVerb();
      setButtonText("Update");
    } else {
      setButtonText("Submit");
    }
  }, []);

  return (
    <>
      <h3>Add Question</h3>
      <br />
      <Container style={{ width: "80rem" }}>
        <Form onSubmit={handleSubmit}>
          <Row>
            <Col>
              <Form.Group className="mb-3" controlId="formBasicEmail">
                <Form.Label>Verb Title <span className="text-danger">*</span></Form.Label>
                <Form.Control
                  type="text"
                  name="title"
                  value={inputFields.title}
                  onChange={handleChange}
                />
              </Form.Group>
            </Col>
            <Col>
              <Form.Group className="mb-3" controlId="formBasicEmail">
                <Form.Label>Question <span className="text-danger">*</span></Form.Label>
                <Form.Control
                  type="text"
                  name="question"
                  value={inputFields.question}
                  onChange={handleChange}
                />
              </Form.Group>
            </Col>
          </Row>
          {inputFields.grid &&
            inputFields.grid.map((item, ind) => (
              <Row key={ind}>
                <Col>
                  <Form.Group className="mb-3" controlId="formBasicEmail">
                    <Form.Label>Tense</Form.Label>
                    <Form.Control
                      type="text"
                      name="label"
                      placeholder="Lable"
                      value={item.label}
                      readOnly
                    />
                  </Form.Group>
                </Col>
                <Col>
                  <Form.Group className="mb-3" controlId="formBasicEmail">
                    <Form.Label>Answer <span className="text-danger">*</span></Form.Label>
                    <Form.Control
                      type="text"
                      name="answer"
                      value={item.answer}
                      onChange={(event) => onChange(ind, event)}
                    />
                  </Form.Group>
                </Col>
                <Col>
                  <Form.Group className="mb-3" controlId="formBasicEmail">
                    <Form.Label>Explanation</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder=""
                      name="explanation"
                      value={item.explanation}
                      onChange={(event) => onChange(ind, event)}
                    />
                  </Form.Group>
                </Col>
              </Row>
            ))}
          <Button type="submit" variant="primary">
            {buttonText}
          </Button>
        </Form>
        <br />

        <Link to="/verb">Verb list</Link>
        <br />
        <br />
      </Container>
    </>
  );
}

export default AddQuestion;
