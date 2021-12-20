import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResizeableClassroomComponent } from './resizeable-classroom.component';

describe('ResizeableClassroomComponent', () => {
  let component: ResizeableClassroomComponent;
  let fixture: ComponentFixture<ResizeableClassroomComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ResizeableClassroomComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ResizeableClassroomComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
