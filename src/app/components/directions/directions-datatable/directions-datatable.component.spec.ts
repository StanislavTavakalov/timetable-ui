import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DirectionsDatatableComponent } from './directions-datatable.component';

describe('DirectionsDatatableComponent', () => {
  let component: DirectionsDatatableComponent;
  let fixture: ComponentFixture<DirectionsDatatableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DirectionsDatatableComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DirectionsDatatableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
