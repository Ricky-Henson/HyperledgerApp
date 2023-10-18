import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DoctorService {
  private doctorURL = 'http://localhost:3001/doctors';

  constructor(private http: HttpClient) {}

  public createDoctor(data: any): Observable<any> {
    return this.http.post(this.doctorURL + '/register', data);
  }

  public getDoctorsByOfficeId(officeId: number): Observable<any> {
    return this.http.get(this.doctorURL + `/${officeId}/_all`);
  }

  public getDoctorByOfficeId(officeId: string, docId: any): Observable<any> {
    return this.http.get(this.doctorURL + `/${officeId}/${docId}`);
  }
}
