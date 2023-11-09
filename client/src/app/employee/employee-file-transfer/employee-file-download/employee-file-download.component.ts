
import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-employee-file-download',
  templateUrl: './employee-file-download.component.html',
  styleUrls: ['./employee-file-download.component.scss']
})
export class EmployeeFileDownloadComponent implements OnInit {
  files: any[] = [];

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.getFiles();
  }

  getFiles(): void {
    this.http.get<any[]>('/api/files').subscribe(files => {
      this.files = files;
    });
  }
}
