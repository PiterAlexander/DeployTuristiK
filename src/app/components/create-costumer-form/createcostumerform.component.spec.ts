import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreatecostumerformComponent } from './createcostumerform.component';

describe('CreatecostumerformComponent', () => {
  let component: CreatecostumerformComponent;
  let fixture: ComponentFixture<CreatecostumerformComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreatecostumerformComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreatecostumerformComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
