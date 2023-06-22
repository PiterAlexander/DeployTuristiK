import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateFrequentTravelerFormComponent } from './create-frequent-traveler-form.component';

describe('CreateFrequentTravelerFormComponent', () => {
  let component: CreateFrequentTravelerFormComponent;
  let fixture: ComponentFixture<CreateFrequentTravelerFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateFrequentTravelerFormComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateFrequentTravelerFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
