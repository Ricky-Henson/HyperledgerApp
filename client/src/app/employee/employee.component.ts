import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';

import { Observable, Subscription } from 'rxjs';

import { RoleEnum } from '../utils';
import { AuthService } from '../core/auth/auth.service';

import { EmployeeViewRecord } from './employee';
import { EmployeeService } from './employee.service';

@Component({
  selector: 'app-employee',
  templateUrl: './employee.component.html',
  styleUrls: ['./employee.component.scss'],
})
export class EmployeeComponent implements OnInit, OnDestroy {
  public employeeId: any;
  public employeeRecordObs?: Observable<EmployeeViewRecord>;
  private sub?: Subscription;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly employeeService: EmployeeService,
    private readonly authService: AuthService
  ) {}

  ngOnInit(): void {
    this.sub = this.route.params.subscribe((params: Params) => {
      this.employeeId = params.employeeId;
      this.refresh();
    });
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }

  public refresh(): void {
    this.employeeRecordObs = this.employeeService.getEmployeeByOfficeId(
      this.authService.getOfficeId(),
      this.employeeId
    );
  }

  public isEmployee(): boolean {
    return this.authService.getRole() === RoleEnum.EMPLOYEE;
  }
}
