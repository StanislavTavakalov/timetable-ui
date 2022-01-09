import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClassroomsTableComponent } from './classrooms-table.component';

describe('ClassroomsTableComponent', () => {
  let component: ClassroomsTableComponent;
  let fixture: ComponentFixture<ClassroomsTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ClassroomsTableComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ClassroomsTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
