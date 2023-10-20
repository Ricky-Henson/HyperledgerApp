import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeListForPatientComponent } from './employee-list-for-patient.component';

describe('EmployeeListForPatientComponent', () => {
  let component: EmployeeListForPatientComponent;
  let fixture: ComponentFixture<EmployeeListForPatientComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EmployeeListForPatientComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EmployeeListForPatientComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
