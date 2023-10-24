import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Observable, Subscription } from 'rxjs';

import { EmployeeService } from '../employee.service';
import { EmployeeRecord, EmployeeViewRecord } from '../employee';
import { DisplayVal } from '../../employee/employee';

@Component({
  selector: 'app-employee-list-for-employee',
  templateUrl: './employee-list-for-employee.component.html',
  styleUrls: ['./employee-list-for-employee.component.scss'],
})
export class DoctorListForPatientComponent implements OnInit, OnDestroy {
  public employeeID: any;
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
  ) {}

  ngOnInit(): void {
    this.allSubs.add(
      this.route.params.subscribe((params: Params) => {
        this.employeeID = params.employeeID;
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
      this.employeeService.getEmployeesByOfficeId(this.employeeID).subscribe((x) => {
        this.permissions = x.permissionGranted;
        this.fetchDoctorData();
      })
    );
  }

  public fetchDoctorData(): void {
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

  public isEmployeePresent(employeeID: string): boolean {
    // @ts-ignore
    return this.permissions.includes(employeeID);
  }
}
