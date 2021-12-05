import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClassroomAddEditComponent } from './classroom-add-edit.component';

describe('ClassroomAddEditComponent', () => {
  let component: ClassroomAddEditComponent;
  let fixture: ComponentFixture<ClassroomAddEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ClassroomAddEditComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ClassroomAddEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
