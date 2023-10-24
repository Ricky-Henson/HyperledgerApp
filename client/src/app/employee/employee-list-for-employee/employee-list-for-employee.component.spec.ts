import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeListForEmployeeComponent } from './employee-list-for-employee.component';

describe('EmployeeListForEmployeeComponent', () => {
  let component: EmployeeListForEmployeeComponent;
  let fixture: ComponentFixture<EmployeeListForEmployeeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EmployeeListForEmployeeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EmployeeListForEmployeeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
