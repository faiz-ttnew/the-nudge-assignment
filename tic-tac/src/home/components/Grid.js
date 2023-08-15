import { Link, useNavigate } from "react-router-dom";
import GridCell from "./GridCell";
import "../../css/grid.css";
import { useState } from "react";
import { Card, Container, Row } from "react-bootstrap";
import AlertBox from "../../components/AlertBox";

let dataObj = {
  message: "",
  success: false,
  isShow: false,
  isShowAlert: false,
};

function Grid({ questionGrid, verbTitle, verbDetail, getVerb }) {
  const [resetGrid, setResetGrid] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const navigate = useNavigate();

  const sendDataToParent = (data) => {
    dataObj = { ...dataObj, ...data };

    setShowAlert(data.isShowAlert);
  };

  const tryAgain = async (data, resetGrid) => {
    setShowAlert(data);
    setResetGrid(resetGrid);
    tryAgainAnswer();
    dataObj = { ...dataObj, isShow: false };
  };

  const completeRest = (data) => {
    setShowAlert(data);
    dataObj = { ...dataObj, isShow: false };
  };

  const startOther = (status) => {
    setShowAlert(status);
    dataObj = { ...dataObj, isShow: false };
  };

  const tryAgainAnswer = async () => {
    let userSession = JSON.parse(sessionStorage.getItem("userSession"));
    if (userSession["id"]) {
      const res = await fetch(
        `${process.env.REACT_APP_API_URL}/answer/try-again-answer/${userSession["id"]}/${verbDetail["verbId"]}`
      );

      const json = await res.json();
      userSession["userSession"] = json["data"]["sessionId"];
      sessionStorage.setItem("userSession", JSON.stringify(userSession));
      getVerb();
    } else {
      navigate("/");
    }
  };

  return (
    <div>
      {showAlert && (
        <AlertBox
          completionData={dataObj}
          tryAgain={tryAgain}
          completeRest={completeRest}
          startOther={startOther}
        />
      )}
      <Container>
        <Row className="justify-content-center">
          <Card
            border="primary"
            className="justify-content-center"
            style={{ width: "40rem" }}
          >
            <Card.Body>
              <div className="grid-container">
                {questionGrid &&
                  questionGrid.length &&
                  questionGrid.map((item, index) => {
                    return (
                      <GridCell
                        className="grid-item"
                        key={index}
                        cellItem={item}
                        verbTitle={verbTitle ? verbTitle : ""}
                        verbDetail={verbDetail}
                        sendDataToParent={sendDataToParent}
                        resetGrid={resetGrid}
                      />
                    );
                  })}
              </div>
            </Card.Body>
          </Card>
        </Row>
      </Container>
      <Link to="/verb">Cancel</Link>
    </div>
  );
}

export default Grid;
