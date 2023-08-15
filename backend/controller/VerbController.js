const { Verb } = require("../schema/Verb");
const isEmpty = require("lodash.isempty");
const {
  updateGrid,
  getGrid,
  getAllVerb,
  findVerb,
  updateVerb,
} = require("../services/VerbService");
const { getUserAnswer } = require("../services/UserAnswerService");

exports.createVerb = async (req, res) => {
  try {
    const { title, grid } = req.body;
    let checkVerb = await Verb.findOne({
      title,
    });

    if (!isEmpty(checkVerb)) {
      res.status(400).json({ message: "Verb already taken", data: {} });
    } else {
      const verb = await Verb.create({ title: title, grid: grid });
      res
        .status(201)
        .json({ data: {}, message: "Verb created", success: true });
    }
  } catch (err) {
    res.status(400).json(err);
  }
};

exports.getVerb = async (req, res, next) => {
  try {
    const userId = JSON.parse(req.params.sessionId).id;
    const userSession = JSON.parse(req.params.sessionId).userSession;
    const verbId = req.params.verbId;

    let userAnswer = await getUserAnswer({ userId, verbId, userSession }, next);
    userAnswer = userAnswer.data[0];

    let verbs = await Verb.findOne({ _id: verbId });
    let parsed = JSON.parse(JSON.stringify(verbs));

    let manipulated = parsed["grid"].map((gridItem) => {
      let value;
      let answer;
      if (userAnswer) {
        answer = userAnswer["answer"].find((ans) => {
          if (ans.grid.toString() === gridItem._id.toString()) {
            return ans;
          }
        });
      }

      if (!isEmpty(answer)) {
        value = {
          ...gridItem,
          user_answer: {
            sequence: answer.sequence,
            is_correct: answer.is_correct,
            grid_id: answer.grid,
            id: answer._id,
          },
        };
      } else {
        value = {
          ...gridItem,
          user_answer: {
            sequence: "",
            is_correct: "",
            grid_id: "",
          },
        };
      }
      return value;
    });
    parsed.grid = manipulated;
    verbs = { ...parsed };
    res.status(200).json({ message: "Verb found", data: verbs });
  } catch (err) {
    console.log(err);
    res.status(400).json(err);
  }
};

exports.getGrid = async (req, res, next) => {
  res
    .status(200)
    .json({ message: "Grid found", data: await getGrid(req, res, next) });
};

exports.updateGrid = async (req, res, next) => {
  res
    .status(200)
    .json({ message: "Grid updated", data: await updateGrid(req, res, next) });
};

exports.getAllVerb = async (req, res, next) => {
  res
    .status(200)
    .json({ message: "Verb found", data: await getAllVerb(req, res, next) });
};

exports.findVerb = async (req, res, next) => {
  res.status(200).json({
    message: "Verb found",
    success: true,
    data: await findVerb(req, res, next),
  });
};

exports.updateVerb = async (req, res, next) => {
  res.status(200).json({
    message: "Updated success",
    success: true,
    data: await updateVerb(req, res, next),
  });
};
