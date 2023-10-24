import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LoginComponent } from './login/login.component';
import { EmployeeComponent } from './employee/employee.component';
import { AdminComponent } from './admin/admin.component';
import { AuthGuard } from './core/auth/auth.guard';
import { EmployeeRegisterComponent } from './employee/employee-register/employee-register.component';
import { EmployeeListForEmployeeComponent } from './employee/employee-list-for-employee/employee-list-for-employee.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'employee/register',
    component: EmployeeRegisterComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'employee/:employeeId',
    component: EmployeeComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'employee/:employeeId/employees',
    component: EmployeeListForEmployeeComponent,
    canActivate: [ AuthGuard ]
  },
  {
    path: 'admin/:adminId',
    component: AdminComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
