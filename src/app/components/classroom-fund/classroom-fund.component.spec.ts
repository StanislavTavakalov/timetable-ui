import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClassroomFundComponent } from './classroom-fund.component';

describe('ClassroomFundComponent', () => {
  let component: ClassroomFundComponent;
  let fixture: ComponentFixture<ClassroomFundComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ClassroomFundComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ClassroomFundComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
