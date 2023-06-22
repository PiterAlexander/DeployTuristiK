import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListFrequentTravelerComponent } from './list-frequent-traveler.component';

describe('ListFrequentTravelerComponent', () => {
  let component: ListFrequentTravelerComponent;
  let fixture: ComponentFixture<ListFrequentTravelerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListFrequentTravelerComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListFrequentTravelerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
