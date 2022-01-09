import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClassroomTypeColorPaletteTableComponent } from './classroom-type-color-palette-table.component';

describe('ClassroomTypeColorPaletteTableComponent', () => {
  let component: ClassroomTypeColorPaletteTableComponent;
  let fixture: ComponentFixture<ClassroomTypeColorPaletteTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ClassroomTypeColorPaletteTableComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ClassroomTypeColorPaletteTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
