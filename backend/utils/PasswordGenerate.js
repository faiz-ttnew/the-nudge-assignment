const bcrypt = require("bcrypt");

const generatePassword = async (password) => {
  const saltRounds = 10;
  const salt = await bcrypt.genSaltSync(saltRounds);
  const hashedPassword = await bcrypt.hashSync(password, salt);
  return hashedPassword;
};

const validatePassword = async (password, dbPassword) => {
  const matched = await bcrypt.compare(password, dbPassword);
  return matched;
};

module.exports = { generatePassword, validatePassword };
