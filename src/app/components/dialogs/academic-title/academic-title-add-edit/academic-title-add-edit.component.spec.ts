import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AcademicTitleAddEditComponent } from './academic-title-add-edit.component';

describe('AcademicTitleAddEditComponent', () => {
  let component: AcademicTitleAddEditComponent;
  let fixture: ComponentFixture<AcademicTitleAddEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AcademicTitleAddEditComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AcademicTitleAddEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
