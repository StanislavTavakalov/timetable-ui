import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeaneryAddEditComponent } from './deanery-add-edit.component';

describe('DeaneryAddEditComponent', () => {
  let component: DeaneryAddEditComponent;
  let fixture: ComponentFixture<DeaneryAddEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DeaneryAddEditComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DeaneryAddEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
