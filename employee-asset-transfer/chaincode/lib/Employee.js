class Employee {
    
    constructor(employeeId, firstName, lastName, password, speciality, officeId) {
        this.employeeId = employeeId;
        this.firstName = firstName;
        this.lastName = lastName;
        this.password = password;
        this.speciality = speciality;  // Include speciality here
        this.officeId = officeId;  // Include officeId here
        return this;
    }
}
module.exports = Employee;
