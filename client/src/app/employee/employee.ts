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

export interface Timestamp {
  nanos: number;
  seconds: ISeconds;
}

export interface ISeconds {
  high: number;
  low: number;
  unsigned: boolean;
}

export class DisplayVal {
  keyName: string | number | boolean;
  displayName: string;

  constructor(key: string | number | boolean, value: string) {
    this.keyName = key;
    this.displayName = value;
  }
}

