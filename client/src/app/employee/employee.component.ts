import {
  Component,
  OnDestroy,
  OnInit,
  ViewChild,
  ElementRef,
} from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';

import { Observable, Subscription } from 'rxjs';

import { RoleEnum } from '../utils';
import { AuthService } from '../core/auth/auth.service';

import { EmployeeViewRecord } from './employee';
import { EmployeeService } from './employee.service';

@Component({
  selector: 'app-employee',
  templateUrl: './employee.component.html',
  styleUrls: ['./employee.component.scss'],
})
export class EmployeeComponent implements OnInit, OnDestroy {
  public employeeId: any;
  public employeeRecordObs?: Observable<EmployeeViewRecord>;
  private sub?: Subscription;
  @ViewChild('fileUpload') fileUpload!: ElementRef;
  uploadedFilePath: string = '';
  originalFileName: string = '';

  constructor(
    private readonly route: ActivatedRoute,
    private readonly employeeService: EmployeeService,
    private readonly authService: AuthService
  ) {}

  ngOnInit(): void {
    this.sub = this.route.params.subscribe((params: Params) => {
      this.employeeId = params.employeeId;
      // console.log(this.employeeId);
      this.refresh();
    });
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }

  public refresh(): void {
    this.employeeRecordObs = this.employeeService.getEmployeeByKey(
      this.employeeId
    );
  }

  public isEmployee(): boolean {
    return this.authService.getRole() === RoleEnum.EMPLOYEE;
  }

  public uploadFile(): void {
    const file = this.fileUpload.nativeElement.files[0];
    this.employeeService.uploadFile(file).subscribe(
      (response) => {
        this.uploadedFilePath = 'http://localhost:3001' + response.filePath; // store the file path
        this.originalFileName = response.originalName; // store the original file name
        console.log('Uploaded File Path: ' + this.uploadedFilePath);
        console.log('Original File Name: ' + this.originalFileName);
        console.log(response);
      },
      (error) => console.error('Error:', error)
    );
  }
}
