import { Component, OnDestroy } from '@angular/core';

import { Subscription } from 'rxjs';

import { AuthService } from './core/auth/auth.service';
import { RoleEnum } from './utils';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnDestroy {
  title = 'client';
  private sub?: Subscription;

  constructor(public authService: AuthService) {}

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }

  public isEmployee(): boolean {
    return this.authService.getRole() === RoleEnum.EMPLOYEE;
  }

  public isAdmin(): boolean {
    return this.authService.getRole() === RoleEnum.ADMIN;
  }

  public getUsername(): string {
    return this.authService.getUsername();
  }

  public getOfficeId(): string {
    return this.authService.getOfficeId();
  }

  public logoutUser(): void {
    this.sub = this.authService.logout().subscribe(
      (res: any) => this.authService.logoutUser(),
      (err: any) => console.error(err)
    );
  }
}
