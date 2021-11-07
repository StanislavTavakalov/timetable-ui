import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeaneryDeleteComponent } from './deanery-delete.component';

describe('DeaneryDeleteComponent', () => {
  let component: DeaneryDeleteComponent;
  let fixture: ComponentFixture<DeaneryDeleteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DeaneryDeleteComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DeaneryDeleteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
