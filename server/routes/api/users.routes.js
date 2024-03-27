const {
  userRegister,
  userLogin,
} = require("../../controllers/user.controller");

module.exports = (app) => {
  app.post("/signup", userRegister);
  app.post("/login", userLogin);
};
