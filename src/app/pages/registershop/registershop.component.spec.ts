import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistershopComponent } from './registershop.component';

describe('RegistershopComponent', () => {
  let component: RegistershopComponent;
  let fixture: ComponentFixture<RegistershopComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RegistershopComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RegistershopComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
