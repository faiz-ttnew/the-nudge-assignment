import React, { useEffect, useState } from "react";
import { Alert, Card, Container } from "react-bootstrap";
import "../css/grid.css";
import VerbListItem from "./components/VerbListItem";
import { Link, useNavigate } from "react-router-dom";
import NavBar from "../components/NavBar";

function Verb() {
  const navigate = useNavigate();
  const [verbList, setVerbList] = useState([]);
  const userSession = JSON.parse(sessionStorage.getItem("userSession"));

  const getAllVerb = async () => {
    const res = await fetch(
      `${process.env.REACT_APP_API_URL}/verb/get-all-verb/${userSession["id"]}`
    );

    const result = await res.json();
    setVerbList(result.data);
  };

  useEffect(() => {
    if (sessionStorage.getItem("userSession")) {
      getAllVerb();
    } else {
      navigate("/login");
    }
  }, []);

  return (
    <div>
      <NavBar />
      <Container>
        <br />
        <Card border="primary">
          <Card.Header>
            <h4>Verb List</h4>
          </Card.Header>
          <Card.Body>
            {verbList.length === 0 && (
              <Alert variant="danger">
                No Verb to display! Please create a new verb
              </Alert>
            )}
            <div className="grid-container1">
              {verbList.length > 0 &&
                verbList.map((item, index) => {
                  return (
                    <div className="grid-item1" key={index}>
                      <VerbListItem verbItem={item} />
                    </div>
                  );
                })}
            </div>
          </Card.Body>
        </Card>
      </Container>

      <br />
      <Link to="/add-question">Add Question</Link>
    </div>
  );
}

export default Verb;
