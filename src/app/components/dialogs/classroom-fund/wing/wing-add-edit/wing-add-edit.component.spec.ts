import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WingAddEditComponent } from './wing-add-edit.component';

describe('WingAddEditComponent', () => {
  let component: WingAddEditComponent;
  let fixture: ComponentFixture<WingAddEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WingAddEditComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WingAddEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
