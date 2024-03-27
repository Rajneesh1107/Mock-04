const mongoose = require("mongoose");

const employeeSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: [true, "Please enter your firstName"],
    },
    lastName: {
      type: String,
      required: [true, "Please enter your lastName"],
    },
    email: {
      type: String,
      required: [true, "Please enter your email"],
      unique: true,
    },
    department: {
      type: String,
      enum: ["Tech", "Marketing", "Operations"],
      default: "Marketing",
    },
    salary: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

const Employee = mongoose.model("Employee", employeeSchema);
module.exports = Employee;
