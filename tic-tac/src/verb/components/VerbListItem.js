import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button, Card } from "react-bootstrap";
import "../../css/grid.css"

function VerbListItem({ verbItem }) {
  const navigate = useNavigate();

  let userSession = JSON.parse(sessionStorage.getItem("userSession"));
  if (!userSession || !userSession["id"] || !userSession["userSession"]) {
    navigate("/");
  }

  const HandleNavigate = (id) => {
    navigate(`/grid/${id}`);
  };

  return (
    <>
      <Card className="text-center">
        <Card.Header>{verbItem.title}</Card.Header>
        <Card.Body>
          <Button
            variant={"primary"}
            onClick={() => HandleNavigate(verbItem._id)}
          >
            Start
          </Button>
        </Card.Body>
        <Card.Footer><Link to={`/update-question/${verbItem._id}`} >Edit</Link></Card.Footer>
      </Card>
    </>
  );
}

export default VerbListItem;
