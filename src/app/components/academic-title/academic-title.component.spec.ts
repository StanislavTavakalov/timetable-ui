import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AcademicTitleComponent } from './academic-title.component';

describe('AcademicTitleComponent', () => {
  let component: AcademicTitleComponent;
  let fixture: ComponentFixture<AcademicTitleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AcademicTitleComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AcademicTitleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
