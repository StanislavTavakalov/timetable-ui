import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeaneriesTableComponent } from './deaneries-table.component';

describe('DeaneriesTableComponent', () => {
  let component: DeaneriesTableComponent;
  let fixture: ComponentFixture<DeaneriesTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DeaneriesTableComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DeaneriesTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
