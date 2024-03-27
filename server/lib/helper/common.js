require("dotenv").config({});
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// hashed the user passsword before saving db
exports.hashPassword = (plainPassword) => {
  //saltRound
  const saltRound = parseInt(process.env.SALT_ROUND);

  const hash = bcrypt.hashSync(plainPassword, saltRound);
  return hash;
};

//compare function is for comparing for hashed password;
exports.comparePassword = (myPlaintextPassword, hashedPassword) => {
  const isCorrect = bcrypt.compareSync(myPlaintextPassword, hashedPassword);
  return isCorrect;
};

//password validation fucntion
exports.validatePassword = (password) => {
  if (password.trim().length < 8) {
    return false;
  }

  //check Password has contain upperCase character;

  if (!/[A-Z]/.test(password)) {
    return false;
  }

  //check Password has contain lowerCase character;
  if (!/[a-z]/.test(password)) {
    return false;
  }

  // check Password has contain numerial character;
  if (!/[0-9]/.test(password)) {
    return false;
  }

  //check password has contain special character
  if (!/[!@#$%^&*]/.test(password)) {
    return false;
  }

  `if password length is greater than or equal to 8 and 
   password contain upperCase,lowerCase, numeric and special characters then  
   return true;
  `;
  return true;
};

//generating accessToken
exports.generateAccessToken = (payload, secret) => {
  // Options for the token
  const options = {
    expiresIn: "1d", // Token will expire in 1day
  };

  // Generate the accessToken
  const token = jwt.sign(payload, secret, options);

  return token;
};

//verify access token
exports.verifyAccessToken = (token, secretKey) => {
  try {
    let decoded = jwt.verify(token, secretKey);
    return decoded;
  } catch (error) {
    // console.log(error);
    return false;
  }
};
