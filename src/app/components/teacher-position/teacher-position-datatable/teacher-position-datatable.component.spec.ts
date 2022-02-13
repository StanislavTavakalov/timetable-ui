import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TeacherPositionDatatableComponent } from './teacher-position-datatable.component';

describe('TeacherPositionDatatableComponent', () => {
  let component: TeacherPositionDatatableComponent;
  let fixture: ComponentFixture<TeacherPositionDatatableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TeacherPositionDatatableComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TeacherPositionDatatableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
