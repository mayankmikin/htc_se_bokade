import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CheckOccupancyComponent } from './check-occupancy.component';

describe('CheckOccupancyComponent', () => {
  let component: CheckOccupancyComponent;
  let fixture: ComponentFixture<CheckOccupancyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CheckOccupancyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CheckOccupancyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
