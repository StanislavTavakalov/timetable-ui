import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClassroomTypeColorPaletteComponent } from './classroom-type-color-palette.component';

describe('ClassroomTypeColorPaletteComponent', () => {
  let component: ClassroomTypeColorPaletteComponent;
  let fixture: ComponentFixture<ClassroomTypeColorPaletteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ClassroomTypeColorPaletteComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ClassroomTypeColorPaletteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
