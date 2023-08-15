const { UserAnswer } = require("../schema/UserAnswer");
const isEmpty = require("lodash.isempty");
const { Verb } = require("../schema/Verb");
const { default: mongoose } = require("mongoose");

const saveUserAnswer = async (req, res, next) => {
  try {
    const { verb_id, user_id, answer, user_session } = req.body;
    let { grid_id: grid, user_answer, sequence, try_again, id } = answer;
    user_answer = user_answer.toLocaleLowerCase().trim();
    let addUserAnswer;

    const userAnswer = await checkUserAnswer({
      verb_id,
      grid_id: grid,
      user_answer,
    });

    let findUserAnswered = await findUserInAnswer(req);

    if (
      findUserAnswered.isAnswered === true ||
      findUserAnswered.isAnswered === false
    ) {
      if (!findUserAnswered.isAnswered) {
        const addUserAnswer = await UserAnswer.updateOne(
          { _id: findUserAnswered._id },
          {
            $push: {
              answer: {
                grid: grid,
                is_correct: userAnswer.is_correct,
                sequence: userAnswer.sequence,
                user_answer,
              },
            },
          }
        );
        return {
          message: "User answer saved",
          is_correct: userAnswer.is_correct,
          value: addUserAnswer,
        };
      } else {
        //try again
        if (try_again === true) {
          addUserAnswer = await UserAnswer.updateOne(
            { _id: findUserAnswered._id, "answer.grid": grid },
            {
              $set: {
                "answer.$.user_answer": user_answer,
                "answer.$.is_correct": userAnswer.is_correct,
              },
            }
          );
          return {
            message: "User answer saved",
            is_correct: userAnswer.is_correct,
            value: addUserAnswer,
          };
        } else {
          return {
            message: "User answer already saved",
            is_correct: "",
            value: addUserAnswer,
          };
        }
      }
    } else {
      addUserAnswer = await UserAnswer.create({
        user: user_id,
        verb: verb_id,
        user_session: user_session,
        answer: [
          {
            grid,
            sequence,
            user_answer,
            is_correct: userAnswer.is_correct,
          },
        ],
      });
    }
    return {
      message: "User answer saved",
      is_correct: userAnswer.is_correct,
      value: addUserAnswer,
    };
  } catch (err) {
    console.log(err);
    res.status(400).json(err);
  }
};

const checkUserAnswer = async (questionInfo) => {
  const { verb_id, grid_id, user_answer } = questionInfo;

  let checkAnswer = await Verb.findOne(
    { _id: verb_id },
    { grid: { $elemMatch: { _id: grid_id } } },
    { "grid.answer": 1 }
  );

  const DBAnswer = checkAnswer["grid"][0]["answer"];
  const sequence = checkAnswer["grid"][0]["sequence"];
  if (
    DBAnswer.toLocaleLowerCase().trim() ==
    user_answer.toLocaleLowerCase().trim()
  ) {
    return { is_correct: true, sequence };
  } else return { is_correct: false, sequence };
};

const findUserInAnswer = async (req) => {
  const { verb_id, user_id, answer, user_session } = req.body;
  const { grid_id } = answer;

  const userAnswers = await UserAnswer.findOne({
    // $and: [{ verb: verb_id, "answer.grid": grid_id, user: user_id }],
    $and: [{ verb: verb_id, user: user_id, user_session: user_session }],
  });

  if (isEmpty(userAnswers)) {
    return { isAnswered: null, _id: null };
  } else {
    let isAnswered = userAnswers?.answer.some(
      (item) => item.grid.toHexString() === grid_id
    );

    return { isAnswered, _id: userAnswers._id };
  }
};

const getUserAnswer = async (obj, next) => {
  try {
    const { userId, verbId, userSession } = obj;
    const userAnswer = await UserAnswer.aggregate([
      {
        $match: {
          // $and: [
          //   {
          user: new mongoose.Types.ObjectId(userId),
          verb: new mongoose.Types.ObjectId(verbId),
          user_session: userSession,
          answer: { $exists: true },
          //   },
          // ],
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
    return { data: userAnswer, success: true };
  } catch (err) {
    return { data: err, success: false };
  }
};

const userAllAnswers = async (obj, next) => {
  try {
    const { userId } = obj;
    const userAnswer = await UserAnswer.aggregate([
      {
        $match: {
          user: new mongoose.Types.ObjectId(userId),
          answer: { $exists: true },
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
    return { data: userAnswer, success: true };
  } catch (err) {
    return { data: err, success: false };
  }
};

const checkUserWon = async (obj, next) => {
  try {
    const { userId, verbId, user_session } = obj;
    const userAnswer = await UserAnswer.aggregate([
      {
        $match: {
          user: new mongoose.Types.ObjectId(userId),
          verb: new mongoose.Types.ObjectId(verbId),
          user_session: user_session,
        },
      },
      {
        $project: {
          user: 1,
          verb: 1,
          verb_answered: 1,
          completed_time: 1,
          createdAt: 1,
          updatedAt: 1,
          is_won: 1,
          answer: 1,
          user_session: 1,
          // answer: { $slice: ["$answer", 9] }, // Limit to 4 answer per question
        },
      },
    ]);

    let ansArray = [];
    let directionResponse = {};
    let allAnsCorrect = false;
    if (userAnswer[0]["answer"].length == 3) {
      //to check all answers are true
      allAnsCorrect = userAnswer[0]["answer"].every(
        (item) => item.is_correct === true
      );

      let sequenceCount = 0;
      for (let i = 0; i <= 2; i++) {
        sequenceCount += userAnswer[0]["answer"][i]["sequence"];
        ansArray.push(userAnswer[0]["answer"][i]["sequence"]); //preparing array to check its direction
      }

      directionResponse = checkDirection("horizontal", ansArray, sequenceCount);
      if (directionResponse.success === false) {
        directionResponse = checkDirection("vertical", ansArray, sequenceCount);
      }
      if (directionResponse.success === false) {
        directionResponse = checkDirection("diagonal", ansArray, sequenceCount);
      }

      await UserAnswer.updateOne(
        {
          verb: new mongoose.Types.ObjectId(verbId),
          user: new mongoose.Types.ObjectId(userId),
          user_session: user_session,
        },
        { $set: { is_won: allAnsCorrect } }
      );

      directionResponse["success"] = allAnsCorrect;
    }

    if (userAnswer[0]["answer"].length == 9) {
      const resp = await UserAnswer.updateOne(
        {
          verb: new mongoose.Types.ObjectId(verbId),
          user: new mongoose.Types.ObjectId(userId),
          user_session: user_session,
        },
        { $set: { verb_answered: false } }
      );

      // delete directionResponse["success"];
      // delete directionResponse["direction"];
      directionResponse["verb_answered"] = true;
    }

    return {
      data: directionResponse,
      success: true,
    };
  } catch (err) {
    return { data: err, success: false };
  }
};

const checkDirection = (type, valuesToCheck, sequenceCount) => {
  const matrixArray = [1, 2, 3, 4, 5, 6, 7, 8, 9];

  // 3x3 grid
  // const grid = [
  //   [1, 2, 3],
  //   [4, 5, 6],
  //   [7, 8, 9],
  // ];

  let response = { direction: "", success: "" };
  switch (type) {
    case "vertical":
      const columnIndexes = valuesToCheck.map(
        (value) => matrixArray.indexOf(value) % 3
      );

      if (columnIndexes.every((index) => index === columnIndexes[0])) {
        response["direction"] = "vertical";
        response["success"] = true;
      } else {
        response["direction"] = "vertical";
        response["success"] = false;
      }
      break;
    case "horizontal":
      const rowIndexes = valuesToCheck.map((value) =>
        Math.floor(matrixArray.indexOf(value) / 3)
      );

      if (rowIndexes.every((index) => index === rowIndexes[0])) {
        //same horizontal
        response["direction"] = "horizontal";
        response["success"] = true;
      } else {
        response["direction"] = "horizontal";
        response["success"] = false;
      }
      break;
    case "diagonal":
      const indexes = valuesToCheck.map((value) => matrixArray.indexOf(value));

      if (indexes.every((index) => index >= 0 && index < 9)) {
        const isMainDiagonal = indexes.every((index, i) => index === i * 4);
        const isAntiDiagonal = indexes.every((index, i) => index === 2 + i * 2);

        if (isMainDiagonal) {
          // return "The values belong to the main diagonal";
          response["direction"] = "diagonal";
          response["success"] = true;
        } else if (isAntiDiagonal) {
          // return "The values belong to the anti-diagonal";
          response["direction"] = "diagonal";
          response["success"] = true;
        } else {
          // return "The values do not belong to the same diagonal";
          response["direction"] = "diagonal";
          response["success"] = false;
        }
      } else {
        // return "Some values are not within the matrix";
        response["direction"] = "diagonal";
        response["success"] = false;
      }
      break;
    default:
      console.log("defeult");
      break;
  }
  return response;
};

module.exports = {
  saveUserAnswer,
  getUserAnswer,
  userAllAnswers,
  checkUserWon,
};
