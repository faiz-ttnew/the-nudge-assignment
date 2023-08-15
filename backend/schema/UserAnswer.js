const mongoose = require("mongoose");
const { Schema } = mongoose;

const userAnswerSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, required: true },
    verb: { type: Schema.Types.ObjectId, ref: "Verb", required: true },
    verb_answered: { type: Boolean, default: null },
    completed_time: { type: Number, default: null },
    is_won: { type: Boolean, default: null },
    user_session: { type: String, default: null },
    answer: [
      {
        grid: { type: Schema.Types.ObjectId, ref: "Verb", required: true },
        is_correct: { type: Boolean, default: false },
        sequence: { type: Number, required: true },
        session_time: { type: Number, default: null },
        user_answer: { type: String, required: true },
      },
    ],
  },
  { timestamps: true }
);

exports.UserAnswer = mongoose.model("User_Answer", userAnswerSchema);
