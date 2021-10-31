import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeaneriesComponent } from './deaneries.component';

describe('DeaneriesComponent', () => {
  let component: DeaneriesComponent;
  let fixture: ComponentFixture<DeaneriesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DeaneriesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DeaneriesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
