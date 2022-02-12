import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AcademicTitleDatatableComponent } from './academic-title-datatable.component';

describe('AcademicTitleDatatableComponent', () => {
  let component: AcademicTitleDatatableComponent;
  let fixture: ComponentFixture<AcademicTitleDatatableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AcademicTitleDatatableComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AcademicTitleDatatableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
