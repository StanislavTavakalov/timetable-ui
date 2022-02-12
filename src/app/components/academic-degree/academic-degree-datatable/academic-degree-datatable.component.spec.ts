import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AcademicDegreeDatatableComponent } from './academic-degree-datatable.component';

describe('AcademicDegreeDatatableComponent', () => {
  let component: AcademicDegreeDatatableComponent;
  let fixture: ComponentFixture<AcademicDegreeDatatableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AcademicDegreeDatatableComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AcademicDegreeDatatableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
