import {ChangeDetectorRef, Component, DestroyRef, inject, OnInit} from '@angular/core';
import {AssessmentDto} from '../../../../../../data/dto/AssessmentDto';
import {Router} from '@angular/router';
import {EventsManagerService} from '../../../../../../data/services/events/events.manager.service';
import {TeamsManagerService} from '../../../../../../data/services/teams/teams.manager.service';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {GetEventHierarchyResponse} from '../../../../../../data/models/events/IGetEventHierarchy.response';
import {NgForOf, NgIf} from '@angular/common';
import {LoadingComponent} from '../../../../components/loading/loading.component';
import {StudentHeaderComponent} from '../../../../components/student-header/student-header.component';

@Component({
    selector: 'app-student-team',
    imports: [
        NgIf,
        NgForOf,
        LoadingComponent,
        StudentHeaderComponent,

    ],
    templateUrl: './student-team.component.html',
    styleUrl: '../../children/team/styles/team.component.scss'
})
export class StudentTeamComponent implements OnInit {
    public isLoading: boolean = true;

    protected teamData: any;
    protected breadcrumbs: string[] = [];
    protected foundTeam: string = "";

    protected assessments: AssessmentDto[] = [];

    private _events: any;
    private readonly _router: Router = inject(Router);
    private readonly _destroyRef: DestroyRef = inject(DestroyRef);
    private readonly _cdr: ChangeDetectorRef = inject(ChangeDetectorRef);
    private readonly _eventsManagerService: EventsManagerService = inject(EventsManagerService);
    private readonly _teamsManagerService: TeamsManagerService = inject(TeamsManagerService);

    protected get activeAssessments(): AssessmentDto[] {
        const now = new Date();
        return this.assessments
            .filter((a): boolean => a.startDate !== undefined && a.endDate !== undefined)
            .filter((assessment): boolean => {
                const startDate = new Date(assessment.startDate);
                const endDate = new Date(assessment.endDate);
                return startDate <= now && endDate >= now;
            })
            .sort((a, b): number =>
                new Date(b.startDate).getTime() - new Date(a.startDate).getTime());
    }

    protected get futureAssessments(): AssessmentDto[] {
        const now = new Date();
        return this.assessments
            .filter((a): boolean => a.startDate !== undefined)
            .filter((assessment): boolean => {
                const startDate = new Date(assessment.startDate);
                return startDate > now;
            })
            .sort((a, b): number =>
                new Date(b.startDate).getTime() - new Date(a.startDate).getTime());
    }

    protected get completeAssessments(): AssessmentDto[] {
        const now = new Date();
        return this.assessments
            .filter((a): boolean => a.endDate !== undefined)
            .filter((assessment): boolean => {
                const endDate = new Date(assessment.endDate);
                return endDate < now;
            })
            .sort((a, b): number =>
                new Date(b.startDate).getTime() - new Date(a.startDate).getTime());
    }

    public ngOnInit(): void {
        this.getCurrentEvents();
    }

    protected formatDate(date: string | Date): string {
        const d = new Date(date);

        const dateFormatter = new Intl.DateTimeFormat('ru-RU', {
            day: '2-digit',
            month: 'short',
        });

        const timeFormatter = new Intl.DateTimeFormat('ru-RU', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: false
        });

        return `${dateFormatter.format(d)} ${timeFormatter.format(d)}`;
    }

    protected getAssessmentActionTitle(assessment: AssessmentDto): string {
        const {assessUsersCount, notAssessedCount} = assessment;

        if (notAssessedCount === 0) {
            return 'Изменить оценку';
        }

        if (notAssessedCount < assessUsersCount) {
            return 'Продолжить оценивание';
        }

        return 'Оценить';
    }

    protected getNotAssessedTitle(assessment: AssessmentDto): string {
        const {assessUsersCount, notAssessedCount} = assessment;

        if (notAssessedCount === 0) {
            return 'Все оценки выставлены';
        }

        return 'Осталось оценить: ' + notAssessedCount + '/' + assessUsersCount;
    }

    protected navigateToAssessment(assessmentId: string): void {
        this._router.navigate(['student-team/assessment', assessmentId]);
    }

    private getCurrentEvents(): void {
        this._eventsManagerService.getCurrent(false).pipe(
            takeUntilDestroyed(this._destroyRef)
        ).subscribe((events: GetEventHierarchyResponse): void => {
            this._events = events;

            if (this._events && this._events.event && this._events.event.directions) {
                this.buildBreadcrumbs();
            }

            this.timeout(500);

            this._cdr.detectChanges();
        })
    }

    private buildBreadcrumbs(): void {
        for (const direction of this._events.event.directions) {
            for (const project of direction.projects) {
                for (const team of project.teams) {
                    this.teamData = team;
                    this.foundTeam = team.name;

                    this.breadcrumbs = [
                        this._events.event.name,
                    ];

                    this.loadAssessments(team.id);
                    this._cdr.detectChanges();
                }
            }
        }
    }

    private loadAssessments(teamId: string): void {
        this._teamsManagerService.getTeamAssessment(teamId).pipe(
            takeUntilDestroyed(this._destroyRef),
        ).subscribe((assessments: AssessmentDto[]): void => {
            this.assessments = assessments;
            this._cdr.detectChanges();
        });
    }

    private timeout(time: number): void {
        setTimeout((): void => {
            this.isLoading = false;
            this._cdr.detectChanges();
        }, time);
    }
}
