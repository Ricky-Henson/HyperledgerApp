export interface Timestamp {
  nanos: number;
  seconds: ISeconds;
}

export interface ISeconds {
  high: number;
  low: number;
  unsigned: boolean;
}

export interface PatientRecord {
  patientId: string;
  firstName: string;
  lastName: string;
  address: string;
  age: number;
  emergPhoneNumber: string;
  phoneNumber: string;
  bloodGroup: string;
  allergies: boolean;
  symptoms: string;
  diagnosis: string;
  treatment: string;
  followUp: string;
  employeeType: string;
  changedBy: string;
  Timestamp: Timestamp;
}

/*export interface ResRecord {
  Key: string;
  Record: PatientRecord;
}*/

export class PatientViewRecord {
  patientId = '';
  firstName = '';
  lastName = '';
  address = '';
  age = 0;
  emergPhoneNumber = '';
  phoneNumber = '';
  bloodGroup = '';
  allergies = false;
  symptoms = '';
  diagnosis = '';
  treatment = '';
  followUp = '';
  employeeType = '';
  changedBy = '';
  Timestamp = '';

  constructor(readonly patientRecord: PatientRecord) {
    this.patientId = patientRecord.patientId;
    this.firstName = patientRecord.firstName;
    this.lastName = patientRecord.lastName;
    this.address = patientRecord.address;
    this.age = patientRecord.age;
    this.emergPhoneNumber = patientRecord.emergPhoneNumber;
    this.phoneNumber = patientRecord.phoneNumber;
    this.bloodGroup = patientRecord.bloodGroup;
    this.allergies = patientRecord.allergies;
    this.symptoms = patientRecord.symptoms;
    this.diagnosis = patientRecord.diagnosis;
    this.treatment = patientRecord.treatment;
    this.followUp = patientRecord.followUp;
    this.employeeType = patientRecord.employeeType;
    this.changedBy = patientRecord.changedBy;
    this.Timestamp = patientRecord.Timestamp
      ? new Date(patientRecord.Timestamp.seconds.low * 1000).toDateString()
      : '';
  }
}

export class PatientAdminViewRecord {
  patientId = '';
  firstName = '';
  lastName = '';
  employeeType = '';
  emergPhoneNumber = '';
  phoneNumber = '';

  constructor(readonly patientRecord: PatientRecord) {
    this.patientId = patientRecord.patientId;
    this.firstName = patientRecord.firstName;
    this.lastName = patientRecord.lastName;
    this.employeeType = patientRecord.employeeType;
    this.emergPhoneNumber = patientRecord.emergPhoneNumber;
    this.phoneNumber = patientRecord.phoneNumber;
  }
}

export class PatientEmployeeViewRecord {
  patientId = '';
  firstName = '';
  lastName = '';
  bloodGroup = '';
  allergies = false;
  symptoms = '';
  diagnosis = '';
  treatment = '';
  followUp = '';

  constructor(readonly patientRecord: PatientRecord) {
    this.patientId = patientRecord.patientId;
    this.firstName = patientRecord.firstName;
    this.lastName = patientRecord.lastName;
    this.bloodGroup = patientRecord.bloodGroup;
    this.allergies = patientRecord.allergies;
    this.symptoms = patientRecord.symptoms;
    this.diagnosis = patientRecord.diagnosis;
    this.treatment = patientRecord.treatment;
    this.followUp = patientRecord.followUp;
  }
}

export class DisplayVal {
  keyName: string | number | boolean;
  displayName: string;

  constructor(key: string | number | boolean, value: string) {
    this.keyName = key;
    this.displayName = value;
  }
}
