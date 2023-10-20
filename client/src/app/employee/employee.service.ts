import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class EmployeeService {
  private employeeURL = 'http://localhost:3001/employees';

  constructor(private http: HttpClient) {}

  public createEmployee(data: any): Observable<any> {
    return this.http.post(this.employeeURL + '/register', data);
  }

  public getEmployeesByOfficeId(officeId: number): Observable<any> {
    return this.http.get(this.employeeURL + `/${officeId}/_all`);
  }

  public getEmployeeByOfficeId(officeId: string, docId: any): Observable<any> {
    return this.http.get(this.employeeURL + `/${officeId}/${docId}`);
  }
}
