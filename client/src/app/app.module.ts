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
import { EmployeeService } from './employee/employee.service';
import { EmployeeRegisterComponent } from './employee/employee-register/employee-register.component';
import { EmployeeListForEmployeeComponent } from './employee/employee-list-for-employee/employee-list-for-employee.component';
import { LoadingPipe } from './loading.pipe';

const components = [
  AppComponent,
  LoginComponent,
  AdminComponent,
  EmployeeComponent,
  EmployeeRegisterComponent,
  EmployeeListForEmployeeComponent,
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
