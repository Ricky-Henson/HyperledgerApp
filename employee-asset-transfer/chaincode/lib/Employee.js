const crypto = require("crypto");

class Employee {
  constructor(employeeId, firstName, lastName, password, speciality, officeId) {
    this.employeeId = employeeId;
    this.firstName = firstName;
    this.lastName = lastName;
    this.password = crypto.createHash("sha256").update(password).digest("hex");
    this.speciality = speciality;
    this.officeId = officeId;
    return this;
  }
}
module.exports = Employee;
