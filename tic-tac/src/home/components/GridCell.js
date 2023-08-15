import React, { useEffect, useRef, useState } from "react";
import { Button, Col, Modal, Row } from "react-bootstrap";

import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { useNavigate } from "react-router-dom";
import "../../css/grid.css";

const MySwal = withReactContent(Swal);
let tryAgain = false;

function GridCell({ cellItem, verbDetail, sendDataToParent, resetGrid }) {
  const [show, setShow] = useState(false);

  const [question, setQuestion] = useState("");
  const [cellObj, setCellObj] = useState({});
  const [userAnswer, setUserAnswer] = useState("");
  const [showSentenceView, setShowSentenceView] = useState(false);

  const navigate = useNavigate();

  let userSession = JSON.parse(sessionStorage.getItem("userSession"));

  let apiResponse = "";

  const inputRef = useRef(null);

  const handleOpenModal = (item) => {
    setQuestion(item.question);
    setCellObj(item);

    if (
      item["user_answer"]["is_correct"] !== "" &&
      item["user_answer"]["is_correct"] !== null
    ) {
      setShowSentenceView(true);
    } else {
      setShow(true);
    }
  };

  const handleClose = () => {
    setUserAnswer("");
    setShow(false);
    setShowSentenceView(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (userAnswer.length > 0) {
      let obj = {
        verb_id: verbDetail.verbId,
        user_id: userSession["id"],
        user_session: userSession["userSession"],
        answer: {
          grid_id: cellObj._id.toString(),
          user_answer: userAnswer,
          sequence: cellObj.sequence,
          try_again: tryAgain,
        },
      };
      await submitUserAnswer(obj);

      setShow(false);
      setUserAnswer("");
    } else {
      inputRef.current.focus();
      alert("Please enter");
    }
  };

  const onChange = (event) => {
    setUserAnswer(event.target.value);
  };

  const submitUserAnswer = async (obj) => {
    const res = await fetch(`${process.env.REACT_APP_API_URL}/answer`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(obj),
    });

    apiResponse = await res.json();

    cellItem["user_answer"]["is_correct"] = apiResponse["is_correct"];
    cellItem["user_answer"]["sequesnce"] = cellItem["sequesnce"];
    tryAgain = false;

    if ("userWon" in apiResponse) {
      if (apiResponse["userWon"]["success"] === true) {
        sendDataToParent({
          message: "Good job",
          success: true,
          isShow: true,
          isShowAlert: true,
        });
      } else if (apiResponse["userWon"]["success"] === false) {
        sendDataToParent({
          message: "Well tried",
          success: false,
          isShow: true,
          isShowAlert: true,
        });
      }

      if (apiResponse["userWon"]["verb_answered"] === true) {
        showAlertCompleted();
      } else {
        showAlert(apiResponse["is_correct"]);
      }
    }
  };

  useEffect(() => {
    handleClose();
  }, []);

  function showAlert(isCorrect) {
    MySwal.fire({
      icon: isCorrect ? "success" : "error",
      title:
        isCorrect === false ? (
          <small>
            <del>{userAnswer}</del>
          </small>
        ) : (
          ""
        ),
      html:
        isCorrect === false ? (
          <label>
            {"Answer"}: <small>{cellItem["answer"]}</small>
          </label>
        ) : (
          ""
        ),
      timer: 3000,
      confirmButtonText: "Ok",
    }).then((res) => {
      if (res.isDenied) {
        handleOpenModal(cellItem);
        tryAgain = true;
      }
    });
  }

  function showAlertCompleted() {
    MySwal.fire({
      icon: "success",
      title: "You have completed the quiz",
      timer: 3000,
      showDenyButton: true,
      denyButtonText: `Ok`,
    }).then((res) => {
      if (res.isDenied) {
        navigate("/");
      } else {
        navigate("/");
      }
    });
  }

  return (
    <>
      <Button
        onClick={() => handleOpenModal(cellItem)}
        variant={
          cellItem["user_answer"].is_correct
            ? "success"
            : cellItem["user_answer"].is_correct === false
            ? "danger"
            : "secondary"
        }
        className="my-3 grid-item"
      >
        {cellItem.label}
      </Button>
      <Modal
        show={show}
        onHide={handleClose}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header>
          <Row>
            <Col>
              {" "}
              <Modal.Title>Fill in the blank</Modal.Title>
            </Col>
          </Row>
        </Modal.Header>
        <Modal.Body>
          <label>{question.split("__")[0]} </label> &nbsp;
          <input
            type="text"
            onChange={onChange}
            value={userAnswer}
            autoFocus
            ref={inputRef}
          />
          &nbsp;
          <label> {question.split("__")[1]}</label>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="danger" onClick={handleClose}>
            Close Button
          </Button>
          <Button variant="success" onClick={handleSubmit}>
            Submit
          </Button>
        </Modal.Footer>
      </Modal>

      {/* sentence view modal */}
      <Modal
        show={showSentenceView}
        onHide={handleClose}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header>
          <Row>
            <Col>
              {" "}
              <Modal.Title>Sentence View</Modal.Title>
            </Col>
          </Row>
        </Modal.Header>
        <Modal.Body>
          <div>
            <b>{cellItem.label}: </b>
            <label> {question.split("__")[0]}</label>&nbsp;
            <span>
              <strong>{cellItem["answer"]}</strong>
            </span>
            &nbsp;
            <label> {question.split("__")[1]}</label>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="danger" onClick={handleClose}>
            Close Button
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default GridCell;
