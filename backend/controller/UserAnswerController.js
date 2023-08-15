const { UserAnswer } = require("../schema/UserAnswer");
const {
  saveUserAnswer,
  checkUserWon,
} = require("../services/UserAnswerService");
const { default: mongoose } = require("mongoose");
const { Verb } = require("../schema/Verb");
const { randomUUID } = require("crypto");

exports.saveUserAnswer = async (req, res, next) => {
  const saveAnswer = await saveUserAnswer(req, res, next);

  const { verb_id: verbId, user_id: userId, answer, user_session } = req.body;

  let userWon = await checkUserWon({ userId, verbId,user_session }, next);

  res.status(200).json({
    message: saveAnswer?.message,
    data: saveAnswer?.value,
    is_correct: saveAnswer?.is_correct,
    userWon: userWon.data,
  });
};

exports.getUserAnswer = async (req, res) => {
  try {
    const userId = req.params.user_id;
    const verbId = req.params.verb_id;

    const grids = await UserAnswer.aggregate([
      {
        $match: {
          user: new mongoose.Types.ObjectId(userId),
          verb: new mongoose.Types.ObjectId(verbId),
        },
      },
      {
        $set: {
          answer: {
            $sortArray: {
              input: "$answer",
              sortBy: { sequence: 1 },
            },
          },
        },
      },
    ]);

    res.status(200).json({ message: "User answer found", grids });
  } catch (err) {
    res.status(400).json(err);
  }
};

exports.getUserAnswerTryAgain = async (req, res) => {
  try {
    const userId = req.params.user_id;
    const verbId = req.params.verb_id;

    const grids = await UserAnswer.updateOne(
      {
        user: new mongoose.Types.ObjectId(userId),
        verb: new mongoose.Types.ObjectId(verbId),
      },
      { $set: { answer: [], is_won: null } }
    );

    res.status(200).json({ message: "User trying to again", grids });
  } catch (err) {
    res.status(400).json(err);
  }
};

exports.userAnswerTryAgain = async (req, res) => {
  try {
    const userId = req.params.user_id;
    const verbId = req.params.verb_id;

    const sessionId = randomUUID();

    res
      .status(200)
      .json({ message: "User trying to again", data: { sessionId } });
  } catch (err) {
    console.log(err);
    res.status(400).json(err);
  }
};
