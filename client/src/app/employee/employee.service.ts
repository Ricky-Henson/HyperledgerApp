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

  public UploadFile(senderID: string, receiverID: string, file: File): Observable<any> {
    const formData = new FormData();
    formData.append('senderID', senderID); // Append senderID first
    formData.append('receiverID', receiverID); // Append receiverID next
    formData.append('file', file); // Finally, append the file

    return this.http.post(`${this.employeeURL}/${senderID}/upload`, formData);
}


  public getFileList(key: string): Observable<any> {
    return this.http.get(this.employeeURL + `/${key}` + `/download`);
  }

  public downloadFile(key: string, fileName: string): Observable<any> {
    return this.http.get(this.employeeURL + `/${key}` + `/download/${fileName}`, {
      responseType: 'blob',
    });
  }
  
}
