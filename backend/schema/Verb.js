const mongoose = require("mongoose");
const { Schema } = mongoose;

const verbSchema = new Schema(
  {
    title: { type: String, require: true, unique: true },
    grid: [
      {
        label: { type: String, require: true },
        value: { type: String, require: true },
        sequence: { type: Number, require: true },
        question: { type: String, require: true },
        answer: { type: String, require: true },
        explanation: { type: String },
      },
    ],
  },
  { timestamps: true }
);

exports.Verb = mongoose.model("Verb", verbSchema);
