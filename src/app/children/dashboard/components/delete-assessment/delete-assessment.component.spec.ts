import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteAssessmentComponent } from './delete-assessment.component';

describe('DeleteAssessmentComponent', () => {
  let component: DeleteAssessmentComponent;
  let fixture: ComponentFixture<DeleteAssessmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeleteAssessmentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DeleteAssessmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
