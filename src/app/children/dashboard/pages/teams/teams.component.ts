import {ChangeDetectorRef, Component, DestroyRef, inject, OnInit} from '@angular/core';
import {HeaderComponent} from '../../components/header/header.component';
import {NgClass, NgForOf, NgIf} from '@angular/common';
import {NewAssessmentComponent} from '../../components/new-assessment/new-assessment.component';
import {GetEventHierarchyResponse} from '../../../../data/models/events/IGetEventHierarchy.response';
import {EventsManagerService} from '../../../../data/services/events/events.manager.service';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {Router} from '@angular/router';
import {TeamsManagerService} from '../../../../data/services/teams/teams.manager.service';
import {AssessmentDto} from '../../../../data/dto/AssessmentDto';
import {TeamDto} from '../../../../data/dto/TeamDto';
import {DirectionDto} from '../../../../data/dto/DirectionDto';
import {ProjectDto} from '../../../../data/dto/ProjectDto';

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
    protected events?: GetEventHierarchyResponse;

    protected modalStates = {
        open: false
    }

    protected pendingAssessments: { [teamName: string]: boolean } = {};

    private readonly _router: Router = inject(Router);
    private readonly _destroyRef: DestroyRef = inject(DestroyRef);
    private readonly _cdr: ChangeDetectorRef = inject(ChangeDetectorRef);
    private readonly _eventsManagerService: EventsManagerService = inject(EventsManagerService);
    private readonly _teamsManagerService: TeamsManagerService = inject(TeamsManagerService);

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

    private getCurrentEvents(): void {
        this._eventsManagerService.getCurrent().pipe(
            takeUntilDestroyed(this._destroyRef)
        ).subscribe((events: GetEventHierarchyResponse): void => {
            this.events = events;

            this.initializeActiveAssessments();

            this._cdr.markForCheck();
        })
    }

    private initializeActiveAssessments(): void {
        const allTeams: (TeamDto | null)[] = this.events?.event?.directions
            ?.flatMap((direction: DirectionDto): ProjectDto[] | null => direction.projects)
            ?.flatMap((project: ProjectDto | null): TeamDto[] | null => project!.teams) || [];

        allTeams.forEach((team: TeamDto | null): void => {
            this._teamsManagerService.getTeamAssessment(team!.id).subscribe((assessments: AssessmentDto[]): void => {
                const activeAssessment: AssessmentDto | null = this.getActiveAssessment(assessments);
                if (activeAssessment) {
                    this.pendingAssessments[team!.name!] = true;
                }
                this._cdr.detectChanges();
            });
        });
    }

    private getActiveAssessment(assessments: AssessmentDto[]): AssessmentDto | null {
        const currentDate = new Date();
        return assessments.find((assessment: AssessmentDto): boolean => {
            const startDate = new Date(assessment.startDate);
            const endDate = new Date(assessment.endDate);
            return currentDate >= startDate && currentDate <= endDate;
        }) || null;
    }
}
