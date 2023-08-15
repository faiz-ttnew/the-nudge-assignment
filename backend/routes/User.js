const express = require("express");
const { login, register } = require("../controller/AuthController");

const router = express.Router();

router.post("/register", register).post("/login", login);

exports.router = router;
