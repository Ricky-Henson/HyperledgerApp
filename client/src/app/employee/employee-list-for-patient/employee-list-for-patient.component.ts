import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Observable, Subscription } from 'rxjs';

import { EmployeeService } from '../employee.service';
import { EmployeeRecord, EmployeeViewRecord } from '../employee';
import { DisplayVal } from '../../patient/patient';
import { PatientService } from '../../patient/patient.service';

@Component({
  selector: 'app-employee-list-for-patient',
  templateUrl: './employee-list-for-patient.component.html',
  styleUrls: ['./employee-list-for-patient.component.scss'],
})
export class EmployeeListForPatientComponent implements OnInit, OnDestroy {
  public patientID: any;
  public employeeRecords: Array<EmployeeViewRecord> = [];
  public permissions = [];
  public grantObs$?: Observable<any>;
  public revokeObs$?: Observable<any>;
  private allSubs = new Subscription();
  public headerNames = [
    new DisplayVal(EmployeeViewRecord.prototype.employeeId, 'Employee Id'),
    new DisplayVal(EmployeeViewRecord.prototype.firstName, 'First Name'),
    new DisplayVal(EmployeeViewRecord.prototype.lastName, 'Last Name'),
  ];

  constructor(
    private readonly route: ActivatedRoute,
    private readonly employeeService: EmployeeService,
    private readonly patientService: PatientService
  ) {}

  ngOnInit(): void {
    this.allSubs.add(
      this.route.params.subscribe((params: Params) => {
        this.patientID = params.patientId;
        this.refresh();
      })
    );
  }

  ngOnDestroy(): void {
    this.allSubs.unsubscribe();
  }

  public refresh(): void {
    this.employeeRecords = [];
    this.allSubs.add(
      this.patientService.getPatientByKey(this.patientID).subscribe((x) => {
        this.permissions = x.permissionGranted;
        this.fetchEmployeeData();
      })
    );
  }

  public fetchEmployeeData(): void {
    this.allSubs.add(
      this.employeeService.getEmployeesByOfficeId(1).subscribe((x) => {
        const data = x as Array<EmployeeRecord>;
        data.map((y) => this.employeeRecords.push(new EmployeeViewRecord(y)));
      })
    );
    this.allSubs.add(
      this.employeeService.getEmployeesByOfficeId(2).subscribe((x) => {
        const data = x as Array<EmployeeRecord>;
        data.map((y) => this.employeeRecords.push(new EmployeeViewRecord(y)));
      })
    );
    this.allSubs.add(
      this.employeeService.getEmployeesByOfficeId(3).subscribe((x) => {
        const data = x as Array<EmployeeRecord>;
        data.map((y) => this.employeeRecords.push(new EmployeeViewRecord(y)));
      })
    );
  }

  public grant(employeeId: string): void {
    this.allSubs.add(
      this.patientService
        .grantAccessToEmployee(this.patientID, employeeId)
        .subscribe((x) => {
          console.log(x);
          this.refresh();
        })
    );
  }

  public revoke(employeeId: string): void {
    this.allSubs.add(
      this.patientService
        .revokeAccessFromEmployee(this.patientID, employeeId)
        .subscribe((x) => {
          console.log(x);
          this.refresh();
        })
    );
  }

  public isEmployeePresent(employeeId: string): boolean {
    // @ts-ignore
    return this.permissions.includes(employeeId);
  }
}
