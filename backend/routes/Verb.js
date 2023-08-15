const express = require("express");
const {
  createVerb,
  getVerb,
  getGrid,
  updateGrid,
  getAllVerb,
  findVerb,
  updateVerb
} = require("../controller/VerbController");

const router = express.Router();

router.get("/find-verb/:id", findVerb);
router.get("/get-all-verb/:userId", getAllVerb);
router.get("/:verbId/:sessionId", getVerb);
router.post("/", createVerb);
router.get("/get-grid/:id", getGrid);
router.patch("/update-verb/:id", updateVerb);
router.patch("/update-grid/:id", updateGrid);

exports.router = router;
