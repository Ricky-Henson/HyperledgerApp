import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';

import { EmployeeService } from '../employee/employee.service';
import { AdminService } from './admin.service';
import { Observable, Subscription } from 'rxjs';
import { DisplayVal, EmployeeViewRecord, EmployeeAdminViewRecord} from '../employee/employee';



@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit, OnDestroy {
  public adminId: any;
  public employeeRecords$?: Observable<Array<EmployeeAdminViewRecord>>
  public fileRecords$?: Observable<Array<string>>;
  private sub?: Subscription;

  public headerNames = [
    new DisplayVal(EmployeeViewRecord.prototype.employeeId, 'Employee ID'),
    new DisplayVal(EmployeeViewRecord.prototype.firstName, 'First Name'),
    new DisplayVal(EmployeeViewRecord.prototype.lastName, 'Last Name'),
  ]

  constructor(
    private readonly route: ActivatedRoute,
    private readonly employeeService: EmployeeService,
    private readonly adminService: AdminService
  ) { }

  ngOnInit(): void {
    this.sub = this.route.params
      .subscribe((params: Params) => {
        this.adminId = params.adminId;
        this.refresh();
        this.loadFiles();
      });
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }

  public refresh(): void {
    this.employeeRecords$ = this.employeeService.getAllEmployees();
  }

  public loadFiles(): void {
    this.fileRecords$ = this.adminService.getFileListForAdmin();
  }

  deleteFile(fileName: string): void {
    this.adminService.deleteFile(fileName).subscribe(() => {
      this.loadFiles();
    });
  }
}
