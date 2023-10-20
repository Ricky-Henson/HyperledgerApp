import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { Subscription } from 'rxjs';

import { EmployeeService } from '../employee.service';
import { AuthService } from '../../core/auth/auth.service';

@Component({
  selector: 'app-employee-new',
  templateUrl: './employee-register.component.html',
  styleUrls: ['./employee-register.component.scss'],
})
export class EmployeeRegisterComponent implements OnInit, OnDestroy {
  public form: FormGroup;
  public error: any = null;

  public officeList = [
    { id: '1', name: 'Office 1' },
    { id: '2', name: 'Office 2' },
    { id: '3', name: 'Office 3' },
  ];
  private sub?: Subscription;

  constructor(
    private readonly fb: FormBuilder,
    private readonly router: Router,
    private readonly authService: AuthService,
    private readonly employeeService: EmployeeService
  ) {
    this.form = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      officeId: ['', Validators.required],
      speciality: ['', Validators.required],
      username: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.refresh();
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }

  public refresh(): void {
    this.form.reset();
  }

  public getAdminUsername(): string {
    return this.authService.getUsername();
  }

  public save(): void {
    console.log(this.form.value);
    this.sub = this.employeeService
      .createEmployee(this.form.value)
      .subscribe((x) => {
        const employeeRegResponse = x;
        if (employeeRegResponse.error) {
          this.error = employeeRegResponse.error;
        }
        this.router.navigate(['/', 'admin', this.getAdminUsername()]);
      });
  }
}
