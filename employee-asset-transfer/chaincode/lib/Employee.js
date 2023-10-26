class Employee {

    constructor(employeeId, firstName, lastName, speciality)
    {
        this.employeeId = employeeId;
        this.firstName = firstName;
        this.lastName = lastName;
        this.speciality = speciality;
        // this.permissionGranted = [];
        return this;
    }
}
module.exports = Employee