class Employee {
    
    constructor(EmployeeId, firstName, lastName, password, speciality, officeId) {
        this.EmployeeId = EmployeeId;
        this.firstName = firstName;
        this.lastName = lastName;
        this.password = password;
        this.speciality = speciality;  
        this.officeId = officeId;  
        return this;
    }
}
module.exports = Employee;
