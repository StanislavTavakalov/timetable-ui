import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WingPlanLoaderComponent } from './wing-plan-loader.component';

describe('ImageUploadComponent', () => {
  let component: WingPlanLoaderComponent;
  let fixture: ComponentFixture<WingPlanLoaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WingPlanLoaderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WingPlanLoaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
