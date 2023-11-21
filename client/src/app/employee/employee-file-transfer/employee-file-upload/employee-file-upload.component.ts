import { Component } from '@angular/core';
import { EmployeeService } from '../../employee.service'; // Adjust the path as necessary
import { AuthService } from '../../../core/auth/auth.service'; // Import your authentication service

@Component({
  selector: 'app-employee-file-upload',
  templateUrl: './employee-file-upload.component.html',
  styleUrls: ['./employee-file-upload.component.scss'],
})
export class EmployeeFileUploadComponent {
  fileSelected: File | null = null;
  senderID: string;
  receiverID: string;
  isLoading = false;
  uploadMessage: string | null = null;

  constructor(
    private employeeService: EmployeeService,
    private authService: AuthService
  ) {
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
    if (!this.fileSelected || !this.senderID || !this.receiverID) {
      console.log('Please ensure all fields are filled');
      // Display an error message to the user
      return;
    }
    this.isLoading = true;

    console.log(`File selected: ${this.fileSelected?.name}`);
    console.log(`Sender ID: ${this.senderID}`);
    console.log(`Receiver ID: ${this.receiverID}`);

    // Perform the file upload
    const formData = new FormData();
    formData.append('file', this.fileSelected);
    formData.append('senderID', this.senderID);
    formData.append('receiverID', this.receiverID);

    this.employeeService
      .UploadFile(this.senderID, this.receiverID, this.fileSelected)
      .subscribe({
        next: (response: any) => {
          console.log('File uploaded successfully', response);
          this.uploadMessage = 'File uploaded successfully';
          this.isLoading = false; // Set isLoading to false when the upload finishes
          setTimeout(() => location.reload(), 2000); // Wait 2 seconds before refreshing

          // Handle the response, maybe navigate away or reset the form
        },
        error: (error: any) => {
          console.error('Error uploading file', error);
          this.uploadMessage = 'Error uploading file';
          this.isLoading = false; // Set isLoading to false when the upload finishes
          setTimeout(() => location.reload(), 2000); // Wait 2 seconds before refreshing

          // Handle the error, maybe show an error message to the user
        },
      });
  }
}
