const express = require("express");
const {
  saveUserAnswer,
  getUserAnswer,
  getUserAnswerTryAgain,
  userAnswerTryAgain
} = require("../controller/UserAnswerController");

const router = express.Router();

router
  .post("/", saveUserAnswer)
  .get("/:user_id/:verb_id", getUserAnswer)
  .get("/try-again/:user_id/:verb_id", getUserAnswerTryAgain)
  .get("/try-again-answer/:user_id/:verb_id", userAnswerTryAgain);

exports.router = router;
