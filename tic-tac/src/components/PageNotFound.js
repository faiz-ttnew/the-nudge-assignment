import React from "react";
import { Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

function PageNotFound() {
  const navigate = useNavigate();

  const redirectToHome = () => {
    navigate('/verb');
  };


  return (
    <div>
      <h1>Page Not Found</h1>
      <br />
      <br />
      <Button onClick={redirectToHome}>Home</Button>
    </div>
  );
}

export default PageNotFound;
