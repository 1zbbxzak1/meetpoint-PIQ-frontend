import {ChangeDetectorRef, Component, DestroyRef, inject, OnInit} from '@angular/core';
import {HeaderComponent} from '../components/header/header.component';
import {NgClass, NgForOf, NgIf} from '@angular/common';
import {NewAssessmentComponent} from '../components/new-assessment/new-assessment.component';
import {GetEventWithIncludesResponse} from '../../../data/model/response/events/IEvent.response';
import {EventsManagerService} from '../../../data/services/events/events.manager.service';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {Router} from '@angular/router';
import {AssessmentService} from './services/assessment.service';

@Component({
    selector: 'app-teams',
    imports: [
        HeaderComponent,
        NgForOf,
        NgIf,
        NgClass,
        NewAssessmentComponent
    ],
    templateUrl: './teams.component.html',
    styleUrl: './styles/teams.component.scss'
})
export class TeamsComponent implements OnInit {
    protected events?: GetEventWithIncludesResponse;

    protected modalStates = {
        open: false
    }

    protected pendingAssessments: { [teamName: string]: boolean } = {};

    private readonly _router: Router = inject(Router);
    private readonly _destroyRef: DestroyRef = inject(DestroyRef);
    private readonly _cdr: ChangeDetectorRef = inject(ChangeDetectorRef);
    private readonly _eventsManagerService: EventsManagerService = inject(EventsManagerService);
    private readonly _assessmentService: AssessmentService = inject(AssessmentService);

    public ngOnInit(): void {
        this.getCurrentEvents();
    }

    protected navigateToTeam(teamId: string): void {
        this._router.navigate(['teams/team', teamId]);
    }

    protected toggleModal(type: keyof typeof this.modalStates, state: boolean): void {
        this.modalStates[type] = state;

        if (state) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
    }

    protected onCreateAssessment(assessment: any): void {
        this._assessmentService.addAssessment(assessment);

        for (const teamName of assessment.teams) {
            this.pendingAssessments[teamName] = true;
        }
    }

    private getCurrentEvents(): void {
        this._eventsManagerService.getCurrent().pipe(
            takeUntilDestroyed(this._destroyRef)
        ).subscribe((events: GetEventWithIncludesResponse): void => {
            this.events = events;

            const savedAssessments = this._assessmentService.createdAssessments;

            for (const assessment of savedAssessments) {
                for (const teamName of assessment.teams) {
                    this.pendingAssessments[teamName] = true;
                }
            }

            this._cdr.detectChanges();
        })
    }
}
