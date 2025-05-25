import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentTeamComponent } from './student-team.component';

describe('StudentTeamComponent', () => {
  let component: StudentTeamComponent;
  let fixture: ComponentFixture<StudentTeamComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StudentTeamComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StudentTeamComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
