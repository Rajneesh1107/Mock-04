const {
  hashPassword,
  validatePassword,
  generateAccessToken,
  comparePassword,
} = require("../lib/helper/common"); // Importing hashPassword function from common helper
const { http } = require("../lib/helper/const"); // Importing HTTP status codes
const User = require("../models/user.model"); // Importing User model

exports.userRegister = async (req, res) => {
  let { email, password } = req.body; // Extracting email and password from request body
  console.log(req.body); // Logging request body for debugging purposes
  try {
    // Checking if client has provided email and password
    if (!email || !password) {
      console.log("error, please check email and password is not found");
      res
        .status(http.NOT_FOUND)
        .send({ msg: "error", error: "email and password are required!" }); // Sending error response if email or password is missing
      return;
    }

    // Checking if client is already registered with the same email
    let isExist = await User.findOne({ email });

    if (isExist) {
      res
        .status(http.CONFLICT)
        .send({ msg: "error", error: "user is already registered" }); // Sending conflict error if user is already registered
      return;
    }
    if (!validatePassword(password)) {
      res.status(http.BAD_REQUEST).send({
        msg: "Please create strong password",
        error:
          "Password must contain at least 8 characters, 1 capital letter, 1 number, and 1 special character",
      });
      return;
    }
    // Hashing the user password
    password = hashPassword(password); // Reassigning password variable with hashed password

    // Saving the user details to the database
    let newUser = User({ email, password }); // Creating a new user instance with email and hashed password
    await newUser.save(); // Saving the new user to the database

    // Sending success response to the client for successful registration
    res
      .status(http.CREATED)
      .send({ msg: "registration successful", user: { email } });
  } catch (error) {
    // Handling errors
    console.log("error from catch block while registering a new user:", error);
    res.status(http.INTERNAL_SERVER_ERROR).send({ msg: "error", error }); // Sending internal server error response if an error occurs
  }
};

exports.userLogin = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });

    //check user is registered or not
    if (!user) {
      res
        .status(http.NOT_FOUND)
        .send({ msg: "error", error: "this email is not registered" });
      return;
    }

    //check user enter correct password or not
    if (!comparePassword(password, user.password)) {
      res
        .status(http.UNAUTHORIZED)
        .send({ msg: "error", error: "Please enter correct password" });
      return;
    }

    const payload = {
      userId: user._id,
      email: user.email,
    };

    //generate the access token
    let secretAccessKey = process.env.SECRETE_KEY;
    let accessToken = generateAccessToken(payload, secretAccessKey);

    if (!accessToken) {
      res
        .status(http.INTERNAL_SERVER_ERROR)
        .send({ msg: "error", error: "failed to generate accessToken" });
      return;
    }

    res.status(http.OK).send({ msg: "user has logged in", accessToken });
  } catch (error) {
    console.log("error from login catch block", error);
    res.status(http.INTERNAL_SERVER_ERROR).send({ msg: "error", error });
  }
};
