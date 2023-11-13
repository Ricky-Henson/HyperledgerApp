import { Component } from '@angular/core';
import { EmployeeService } from '../../employee.service'; // Adjust the path as necessary
import { AuthService } from '../../../core/auth/auth.service' // Import your authentication service

@Component({
  selector: 'app-employee-file-upload',
  templateUrl: './employee-file-upload.component.html',
  styleUrls: ['./employee-file-upload.component.scss']
})
export class EmployeeFileUploadComponent {
  fileSelected: File | null = null;
  senderID: string;
  receiverID: string;

  constructor(private employeeService: EmployeeService, private authService: AuthService) {
    this.senderID = authService.getUsername(); // Set the senderID to the user ID from your authentication service
    this.receiverID = '';
  }

  onFileSelected(event: Event): void {
    this.fileSelected = (event.target as HTMLInputElement).files?.[0] || null;
  }

  onSenderOfficeSelected(event: Event): void {
    this.senderID = (event.target as HTMLInputElement).value;
  }

  onReceiverOfficeSelected(event: Event): void {
    this.receiverID = (event.target as HTMLInputElement).value;
  }

  onUpload(): void {
    console.log('Upload method triggered');
    if (!this.fileSelected) {
      console.log('No file selected');
      return;
    }

    console.log(`File selected: ${this.fileSelected?.name}`);
    console.log(`Sender ID: ${this.senderID}`);
    console.log(`Receiver ID: ${this.receiverID}`);

    // Perform the file upload
    this.employeeService.UploadFile(this.senderID, this.fileSelected).subscribe({
        next: (response: any) => {
            console.log('File uploaded successfully', response);
            // Handle the response, maybe navigate away or reset the form
        },
        error: (error: any) => {
            console.error('Error uploading file', error);
            // Handle the error, maybe show an error message to the user
        }
    });
  }
}
