// employee-file-download.component.ts

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EmployeeService } from '../../employee.service';
import { AuthService } from '../../../core/auth/auth.service'; // Import your authentication service
import { saveAs } from 'file-saver'; // Import the function from the module

@Component({
  selector: 'app-employee-file-download',
  templateUrl: './employee-file-download.component.html',
  styleUrls: ['./employee-file-download.component.scss'],
})
export class EmployeeFileDownloadComponent {
  employeeId: string;
  files: any[] = [];
  isLoadingFiles = false;
  isDownloading = false;

  constructor(
    private employeeService: EmployeeService,
    private route: ActivatedRoute,
    private authService: AuthService
  ) {
    this.employeeId = authService.getUsername(); // Set the employeeId to the user ID from your authentication service
  }

  ngOnInit() {
    this.loadFiles();
  }

  loadFiles() {
    this.employeeService.getFileList(this.employeeId).subscribe(
      (data) => {
        this.files = data; // data should already be an array of filenames
      },
      (error) => {
        console.error('Error fetching files', error);
      }
    );
  }

  downloadFile(filename: string) {
    this.isDownloading = true; // Start downloading
    this.employeeService.downloadFile(this.employeeId, filename).subscribe(
      (data) => {
        saveAs(data, filename); // Use the saveAs function to save the file
        this.isDownloading = false; // End downloading
      },
      (error) => {
        console.error('Error downloading file', error);
        this.isDownloading = false; // End downloading
      }
    );
  }
}
