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

  public UploadFile(employeeId: string, file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);
    const headers = {
      'Content-Type': 'multipart/form-data',
    };
    return this.http.post(
      this.employeeURL + `/upload/${employeeId}`,
      formData,
      { headers }
    );
  }
}
