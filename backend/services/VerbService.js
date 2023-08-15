const { Verb } = require("../schema/Verb");
const { UserAnswer } = require("../schema/UserAnswer");
const { default: mongoose } = require("mongoose");

const updateGrid = async (req, res, next) => {
  try {
    const id = req.params.id;
    const { verb_id, grid } = req.body;
    return await Verb.updateOne(
      { _id: verb_id, "grid._id": id },
      {
        $set: {
          "grid.$.answer": grid.answer,
          "grid.$.question": grid.question,
          "grid.$.label": grid.label,
          "grid.$.value": grid.value,
        },
      }
    );
  } catch (err) {
    res.status(400).json(err);
  }
};

const getGrid = async (req, res, next) => {
  try {
    const id = req.params.id;
    const grids = await Verb.find({ _id: id }, { grid: { answer: 0 } });
    return grids;
  } catch (err) {
    res.status(400).json(err);
  }
};

const getAllVerb = async (req, res, next) => {
  const userId = req.params.userId;
  try {
    const userAnswer = await Verb.aggregate([
      {
        $lookup: {
          from: "user_answers",
          localField: "_id",
          foreignField: "verb",
          let: { user: "$user" },
          as: "userVerbAnswers",
          pipeline: [
            {
              $match: {
                $expr: { $eq: ["$user", new mongoose.Types.ObjectId(userId)] }, // Match user ID
              },
            },
          ],
        },
      },
    ]);

    return userAnswer;
  } catch (err) {
    console.log(err);
    res.status(400).json(err);
  }
};

const findVerb = async (req, res, next) => {
  try {
    const id = req.params.id;
    let verb = await Verb.find({ _id: id });
    return verb;
  } catch (err) {
    res.status(400).json(err);
  }
};

const updateVerb = async (req, res, next) => {
  try {
    const id = req.params.id;
    const payload = req.body;
    const update = await Verb.updateOne(
      { _id: id },
      {
        $set: {
          title: payload.title,
          grid: payload.grid,
        },
      }
    );
    return update;
  } catch (err) {
    res.status(400).json(err);
  }
};

module.exports = { updateGrid, getGrid, getAllVerb, findVerb, updateVerb };
