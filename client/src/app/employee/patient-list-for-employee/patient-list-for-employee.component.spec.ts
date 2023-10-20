import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PatientListForEmployeeComponent } from './patient-list-for-employee.component';

describe('PatientListForEmployeeComponent', () => {
  let component: PatientListForEmployeeComponent;
  let fixture: ComponentFixture<PatientListForEmployeeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PatientListForEmployeeComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PatientListForEmployeeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
