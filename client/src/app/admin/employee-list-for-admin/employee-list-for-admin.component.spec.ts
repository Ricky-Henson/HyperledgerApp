import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeListForAdminComponent } from './employee-list-for-admin.component';

describe('EmployeeListForAdminComponent', () => {
  let component: EmployeeListForAdminComponent;
  let fixture: ComponentFixture<EmployeeListForAdminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EmployeeListForAdminComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EmployeeListForAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
