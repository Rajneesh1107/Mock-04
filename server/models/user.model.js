const mongoose = require("mongoose");

// creating the user schema..
const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, "please enter your email"],
      unique: true,
    },
    password: {
      type: String,
      required: [true, "please enter your password"],
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

const User = mongoose.model("User", userSchema);

// export the user model
module.exports = User;
