import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormAssessmentComponent } from './form-assessment.component';

describe('FormAssessmentComponent', () => {
  let component: FormAssessmentComponent;
  let fixture: ComponentFixture<FormAssessmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormAssessmentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormAssessmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
