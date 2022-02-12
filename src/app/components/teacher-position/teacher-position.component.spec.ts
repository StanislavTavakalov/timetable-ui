import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TeacherPositionComponent } from './teacher-position.component';

describe('TeacherPositionComponent', () => {
  let component: TeacherPositionComponent;
  let fixture: ComponentFixture<TeacherPositionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TeacherPositionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TeacherPositionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
