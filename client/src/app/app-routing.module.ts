import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LoginComponent } from './login/login.component';
import { PatientComponent } from './patient/patient.component';
import { EmployeeComponent } from './employee/employee.component';
import { AdminComponent } from './admin/admin.component';
import { AuthGuard } from './core/auth/auth.guard';
import { PatientEditComponent } from './patient/patient-register/patient-edit.component';
import { EmployeeRegisterComponent } from './employee/employee-register/employee-register.component';
import { PatientHistoryComponent } from './patient/patient-history/patient-history.component';
import { PatientDetailsMedicalEditComponent } from './patient/patient-details-medical-edit/patient-details-medical-edit.component';
import { PatientDetailsPersonalEditComponent } from './patient/patient-details-personal-edit/patient-details-personal-edit.component';
import { EmployeeListForPatientComponent } from './employee/employee-list-for-patient/employee-list-for-patient.component';
import { PatientListForEmployeeComponent } from './employee/patient-list-for-employee/patient-list-for-employee.component';

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
    path: 'patient/edit/:self',
    component: PatientEditComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'patient/:patientId/details/personal/edit',
    component: PatientDetailsPersonalEditComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'patient/:patientId/details/medical/edit',
    component: PatientDetailsMedicalEditComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'patient/:patientId/employees/list',
    component: EmployeeListForPatientComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'patient/:patientId',
    component: PatientComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'patient/:patientId/history',
    component: PatientHistoryComponent,
    canActivate: [AuthGuard],
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
    path: 'employee/:employeeId/patients',
    component: PatientListForEmployeeComponent,
    canActivate: [AuthGuard],
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
