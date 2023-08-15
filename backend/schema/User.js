const mongoose = require("mongoose");
const { Schema } = mongoose;

const gridSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String },
  },
  { timestamps: true }
);

exports.User = mongoose.model("User", gridSchema);
