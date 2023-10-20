import { Component, OnInit } from '@angular/core';

import { Observable } from 'rxjs';

import { PatientService } from '../../patient/patient.service';
import {
  DisplayVal,
  PatientEmployeeViewRecord,
  PatientViewRecord,
} from '../../patient/patient';

@Component({
  selector: 'app-patient-list-for-employee',
  templateUrl: './patient-list-for-employee.component.html',
  styleUrls: ['./patient-list-for-employee.component.scss'],
})
export class PatientListForEmployeeComponent implements OnInit {
  public patientRecordsObs$?: Observable<Array<PatientEmployeeViewRecord>>;
  public headerNames = [
    new DisplayVal(PatientViewRecord.prototype.patientId, 'Patient Id'),
    new DisplayVal(PatientViewRecord.prototype.firstName, 'First Name'),
    new DisplayVal(PatientViewRecord.prototype.lastName, 'Last Name'),
  ];

  constructor(private readonly patientService: PatientService) {}

  ngOnInit(): void {
    this.refresh();
  }

  public refresh(): void {
    this.patientRecordsObs$ = this.patientService.fetchAllPatients();
  }
}
