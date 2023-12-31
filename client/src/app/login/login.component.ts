import { Component, OnInit, TemplateRef } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { AuthService } from '../core/auth/auth.service';
import { OfficeUser, User } from '../User';
import { BrowserStorageFields, RoleEnum } from '../utils';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  private PWD_CHANGE = 'CHANGE_TMP_PASSWORD';
  public createNewPwd = false;
  public showOfficeList = true;
  public role = '';
  public officeId = 0;
  public username = '';
  public pwd = '';
  public newPwd = '';
  public error = { message: '' };

  constructor(
    private authService: AuthService,
    private router: Router,
    private readonly modal: NgbModal
  ) {}

  ngOnInit(): void {}

  public resetFields(): void {
    this.role = '';
    this.officeId = 0;
    this.username = '';
    this.pwd = '';
    this.newPwd = '';
    this.createNewPwd = false;
    this.error.message = '';
  }

  public loginUser(): void {
    switch (this.role) {
      case RoleEnum.ADMIN:
        this.authService
          .loginAdminUser(
            new OfficeUser(this.role, this.officeId, this.username, this.pwd)
          )
          .subscribe(
            (res: any) => this.afterSuccessfulLogin(res),
            (err: any) => (this.error.message = err.message)
          );
        break;
      case RoleEnum.EMPLOYEE:
        this.authService
          .loginEmployeeUser(
            new OfficeUser(this.role, this.officeId, this.username, this.pwd)
          )
          .subscribe(
            (res: any) => this.afterSuccessfulLogin(res),
            (err: any) => (this.error.message = err.message)
          );
        break;
    }
  }

  private afterSuccessfulLogin(res: any): void {
    if (res.success && res.success === this.PWD_CHANGE) {
      this.createNewPwd = true;

      return;
    } else if (!res.accessToken) {
      this.error.message = 'Token is missing.';

      return;
    }

    const role = this.role;
    const userId = this.username;
    const officeId = this.officeId;
    this.authService.setHeaders(res, role, officeId, userId);

    this.resetFields();

    this.router.navigate(['/', role, userId]);
  }
}
