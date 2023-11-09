import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class EmployeeService {
  private employeeURL = 'http://localhost:3001/employee';

  constructor(private http: HttpClient) {}

  public createEmployee(data: any): Observable<any> {
    return this.http.post(this.employeeURL + '/register', data);
  }

  public getAllEmployees(): Observable<any> {
    return this.http.get(this.employeeURL + '/_all');
  }

  public getEmployeeByKey(key: string): Observable<any> {
    return this.http.get(this.employeeURL + `/${key}`);
  }

  public UploadFile(key: string, file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);
  
    // The Content-Type header should not be set manually; Angular will handle it.
    return this.http.post(this.employeeURL + `/${key}` + `/upload`, formData);
  }
}
