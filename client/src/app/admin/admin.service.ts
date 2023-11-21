import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AdminService {
  private adminURL = 'http://localhost:3001/admin';

  constructor(private http: HttpClient) {}

  public getFileListForAdmin(): Observable<any[]> {
    return this.http.get<any[]>(this.adminURL + '/files');
  }

  public deleteFile(fileName: string): Observable<any> {
    return this.http.delete(this.adminURL + `/files/${fileName}`);
  }

  // ... other admin-related methods
}
