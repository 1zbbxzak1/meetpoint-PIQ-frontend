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

    protected onCreateAssessment(event: { assessment: any, isEdit: boolean }): void {
        const {assessment, isEdit} = event;

        // Найдём все команды по именам
        const allTeams = this.events!.event!.directions!
            .flatMap((direction: any) => direction.projects)
            .flatMap((project: any) => project.teams) || [];

        if (!assessment.teams) {
            assessment.teams = [];
        }

        // Добавим команды, если они ещё не добавлены (по именам)
        for (const teamName of assessment.teams) {
            if (!this.pendingAssessments[teamName]) {
                const team = allTeams.find((t: any) => t.name === teamName);
                if (team) {
                    this.pendingAssessments[team.name] = true;
                }
            }
        }

        // Добавим или обновим оценку
        if (!isEdit) {
            this._assessmentService.addAssessment(assessment);
        } else {
            this._assessmentService.updateAssessment(assessment);
        }

        // Обновим отображение
        this._cdr.detectChanges();
    }

    private getCurrentEvents(): void {
        this._eventsManagerService.getCurrent().pipe(
            takeUntilDestroyed(this._destroyRef)
        ).subscribe((events: GetEventWithIncludesResponse): void => {
            this.events = events;

            const savedAssessments = this._assessmentService.createdAssessments;

            const allTeams = events!.event!.directions!
                ?.flatMap(direction => direction.projects)
                ?.flatMap(project => project!.teams!) || [];

            for (const assessment of savedAssessments) {
                for (const teamName of assessment.teams) {
                    const teamExists = allTeams.some(team => team.name === teamName);
                    if (teamExists) {
                        this.pendingAssessments[teamName] = true;
                    }
                }
            }

            this._cdr.detectChanges();
        })
    }
}
