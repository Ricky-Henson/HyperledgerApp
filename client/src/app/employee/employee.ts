export interface EmployeeRecord {
  id: string;
  firstName: string;
  lastName: string;
  role: string;
}

export class EmployeeViewRecord {
  employeeId = '';
  firstName = '';
  lastName = '';
  speciality = '';
  role = '';

  constructor(readonly employeeRecord: EmployeeRecord) {
    this.employeeId = employeeRecord.id;
    this.firstName = employeeRecord.firstName;
    this.lastName = employeeRecord.lastName;
    this.role = employeeRecord.role;
  }
}
