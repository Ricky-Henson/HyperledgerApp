import { Component, OnInit } from '@angular/core';
// import { ActivatedRoute, Params } from '@angular/router';
import { Observable, Subscription } from 'rxjs';

import { EmployeeService } from '../../employee/employee.service';
import { EmployeeRecord, EmployeeViewRecord } from '../../employee/employee';
import { DisplayVal } from '../../employee/employee';

@Component({
  selector: 'app-employee-list-for-admin',
  templateUrl: './employee-list-for-admin.component.html',
  styleUrls: ['./employee-list-for-admin.component.scss'],
})
export class EmployeeListForAdminComponent implements OnInit {
  public employeeRecordsObs$?: Observable<Array<EmployeeViewRecord>>;
  public headerNames = [
    new DisplayVal(EmployeeViewRecord.prototype.employeeId, 'Employee Id'),
    new DisplayVal(EmployeeViewRecord.prototype.firstName, 'First Name'),
    new DisplayVal(EmployeeViewRecord.prototype.lastName, 'Last Name'),
  ]

  constructor(
    // private readonly route: ActivatedRoute,
    private readonly employeeService: EmployeeService,
  ) {}

  ngOnInit(): void {
    this.refresh();
  }

  public refresh(): void {
    this.employeeRecordsObs$ = this.employeeService.getAllEmployees();
  }
}
