const isEmpty = require("lodash.isempty");
const { User } = require("../schema/User");
const {
  generatePassword,
  validatePassword,
} = require("../utils/PasswordGenerate");
const { randomUUID } = require("crypto");

exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    let existsUser = await User.findOne({
      email,
    });

    if (!isEmpty(existsUser)) {
      res.status(400).json({ message: "User already registered", data: {}, success: false });
    } else {
      // hash the password
      const hashedPassword = await generatePassword(password);

      const user = new User({ ...req.body, password: hashedPassword });
      await user.save({ name, email, password });
      res.status(200).json({ data: {}, message: "User registered", success: true });
    }
  } catch (err) {
    console.log(err);
    res.status(400).json(err);
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    const hashedPassword = await validatePassword(password, user.password);
    if (!user || !hashedPassword) {
      res
        .status(200)
        .json({ message: "credentials not found", data: {}, success: false });
      return;
    } else {
      res.status(201).json({
        data: {id: user._id},
        message: "Loggedin success",
        success: true,
        sessionId: randomUUID(),
      });
    }
  } catch (err) {
    console.log(err);
    res.status(400).json(err);
  }
};
