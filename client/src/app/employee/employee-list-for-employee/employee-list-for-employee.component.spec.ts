import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeListForEmployee } from './employee-list-for-employee.component';

describe('EmployeeListForEmployee', () => {
  let component: EmployeeListForEmployee;
  let fixture: ComponentFixture<EmployeeListForEmployee>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EmployeeListForEmployee ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EmployeeListForEmployee);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
