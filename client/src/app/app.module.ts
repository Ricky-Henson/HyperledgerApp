import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { AdminComponent } from './admin/admin.component';
import { PatientComponent } from './patient/patient.component';
import { EmployeeComponent } from './employee/employee.component';
import { AuthService } from './core/auth/auth.service';
import { AuthGuard } from './core/auth/auth.guard';
import { TokenInterceptorService } from './core/auth/token-interceptor.service';
import {
  ToolbarButtonComponent,
  ToolbarLinkComponent,
  ToolbarComponent,
} from './sidebar';
import {
  SearchComboComponent,
  SearchService,
  SearchTextComponent,
} from './search';
import { AdminService } from './admin/admin.service';
import { PatientService } from './patient/patient.service';
import { EmployeeService } from './employee/employee.service';
import { PatientEditComponent } from './patient/patient-register/patient-edit.component';
import { EmployeeRegisterComponent } from './employee/employee-register/employee-register.component';
import { PatientHistoryComponent } from './patient/patient-history/patient-history.component';
import { PatientDetailsMedicalEditComponent } from './patient/patient-details-medical-edit/patient-details-medical-edit.component';
import { PatientDetailsPersonalEditComponent } from './patient/patient-details-personal-edit/patient-details-personal-edit.component';
import { EmployeeListForPatientComponent } from './employee/employee-list-for-patient/employee-list-for-patient.component';
import { PatientListForEmployeeComponent } from './employee/patient-list-for-employee/patient-list-for-employee.component';
import { LoadingPipe } from './loading.pipe';

const components = [
  AppComponent,
  LoginComponent,
  AdminComponent,
  PatientComponent,
  PatientEditComponent,
  PatientHistoryComponent,
  PatientDetailsMedicalEditComponent,
  PatientDetailsPersonalEditComponent,
  PatientListForEmployeeComponent,
  EmployeeListForPatientComponent,
  EmployeeComponent,
  EmployeeRegisterComponent,
  ToolbarComponent,
  ToolbarButtonComponent,
  ToolbarLinkComponent,
  SearchComboComponent,
  SearchTextComponent,
];

const pipes = [LoadingPipe];

@NgModule({
  declarations: [...components, ...pipes],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    AppRoutingModule,
    ReactiveFormsModule,
    NgSelectModule,
    NgbTooltipModule,
  ],
  providers: [
    AuthService,
    AuthGuard,
    SearchService,
    AdminService,
    PatientService,
    EmployeeService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptorService,
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
