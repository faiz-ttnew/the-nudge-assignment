import React from "react";
import { Alert, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

function AlertBox({ completionData, tryAgain, completeRest, startOther }) {
  const navigate = useNavigate();

  const handleComplete = (data) => {
    if (data === "Complete rest") {
      completionData = { ...completionData, isShow: false };
      completeRest(false);
    }
    if (data === "Start another") {
      startOther(false);
      navigate("/verb");
    }
    if (data === "Try again") {
      completionData = { ...completionData, isShow: false };

      tryAgain(false, true);
    }
  };

  return (
    <>
      <Alert
        variant={completionData.success === true ? "success" : "danger"}
      >
        <Alert.Heading>{completionData.message}</Alert.Heading>
        {completionData.success === true && (
          <div>
            <Button
              variant="link"
              onClick={() => handleComplete("Complete rest")}
            >
              Complete rest
            </Button>
            &nbsp;&nbsp; &nbsp;
            <Button
              variant="link"
              onClick={() => handleComplete("Start another")}
            >
              Start another
            </Button>
          </div>
        )}
        {completionData.success === false && (
          <div>
            <Button variant="link" onClick={() => handleComplete("Try again")}>
              Try again
            </Button>
            &nbsp;&nbsp; &nbsp;
            <Button
              variant="link"
              onClick={() => handleComplete("Start another")}
            >
              Start another
            </Button>
          </div>
        )}
      </Alert>
    </>
  );
}

export default AlertBox;
