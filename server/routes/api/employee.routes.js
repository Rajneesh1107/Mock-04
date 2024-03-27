const {
  addEmployee,
  getEmployees,
  getEmployeeDetails,
  deleteEmployee,
  updateEmployee,
} = require("../../controllers/employee.controller");

module.exports = (app) => {
  app.get("/employees", getEmployees);
  app.get("/employee/:id", getEmployeeDetails);

  app.post("/employees", addEmployee);
  app.patch("/employee/:id", updateEmployee);
  app.delete("/employee/:id", deleteEmployee);
};
