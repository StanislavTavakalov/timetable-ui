import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AcademicDegreeComponent } from './academic-degree.component';

describe('AcademicDegreeComponent', () => {
  let component: AcademicDegreeComponent;
  let fixture: ComponentFixture<AcademicDegreeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AcademicDegreeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AcademicDegreeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
