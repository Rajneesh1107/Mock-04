const { validatePassword, hashPassword } = require("../lib/helper/common");
const { http } = require("../lib/helper/const");
const Employee = require("../models/employee.model");

// adding a new employee to database
exports.addEmployee = async (req, res) => {
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
    let isExist = await Employee.findOne({ email });

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
    let newUser = Employee({ ...req.body, password }); // Creating a new user instance with email and hashed password
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

// getting all employees with pagination from db
exports.getEmployees = async (req, res) => {
  const page = parseInt(req.query.page) || 1; // Current page number, default to 1
  const limit = parseInt(req.query.limit) || 10; // Number of items per page, default to 10
  const department = req.query.department;
  const salary = req.query.department;

  try {
    let filterObj = {};
    if (department) {
      filterObj.department = department;
    }

    const [employees, total] = await Promise.all([
      Employee.find(filterObj, { createdAt: 0, updatedAt: 0, __v: 0 })
        .skip((page - 1) * limit) // Skip items
        .limit(limit), // Limit number of items
      Employee.countDocuments(), // Count total documents
    ]);

    res.status(http.OK).send({
      msg: "employees data",
      totalEmployee: total,
      totalPages: Math.ceil(total / limit), // Calculate total pages
      currentPage: page,
      employees,
    });
  } catch (error) {
    console.log("error from the getting employee catch block", error); //handling error
  }
};
// getting a single employee details
exports.getEmployeeDetails = async (req, res) => {
  const { id } = req.params;
  try {
    let employee = await Employee.findOne({ _id: id }, { __v: 0 });
    res.status(http.OK).send({
      msg: "employee details",
      employee,
    });
  } catch (error) {
    console.log("error from the getting employee details catch block", error); //handling error
  }
};

// deletion of an employee
exports.deleteEmployee = async (req, res) => {
  let { id } = req.params;

  try {
    let deletedEmployee = await Employee.findByIdAndDelete({ _id: id });
    res
      .status(http.OK)
      .send({ msg: "exployee deleted successful", deletedEmployee });
  } catch (error) {
    console.log("error from deletion catch block", error);
  }
};

// updating an employee
exports.updateEmployee = async (req, res) => {
  let { id } = req.params;

  try {
    let updatedEmployee = await Employee.findByIdAndUpdate(
      { _id: id },
      { ...req.body }
    );
    res
      .status(http.OK)
      .send({ msg: "exployee detail updated successful", updatedEmployee });
  } catch (error) {
    console.log("error from updating catch block", error);
  }
};
