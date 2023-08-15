const verbRouter = require("../routes/Verb");
const answerRouter = require("../routes/UserAnswer");
const userRouter = require("../routes/User");

exports.routeConfig = async (application) => {
  application.use("/verb", verbRouter.router);
  application.use("/answer", answerRouter.router);
  application.use("/user", userRouter.router);

  return application;
};
