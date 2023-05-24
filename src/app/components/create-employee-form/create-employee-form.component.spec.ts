import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateEmployeeFormComponent } from './create-employee-form.component';

describe('CreateEmployeeFormComponent', () => {
  let component: CreateEmployeeFormComponent;
  let fixture: ComponentFixture<CreateEmployeeFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateEmployeeFormComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateEmployeeFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
