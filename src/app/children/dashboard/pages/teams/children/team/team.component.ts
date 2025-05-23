import {ChangeDetectorRef, Component, DestroyRef, HostListener, inject, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {HeaderComponent} from '../../../../components/header/header.component';
import {NgForOf, NgIf, NgOptimizedImage} from '@angular/common';
import {EventsManagerService} from '../../../../../../data/services/events/events.manager.service';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {GetEventHierarchyResponse} from '../../../../../../data/models/events/IGetEventHierarchy.response';
import {NewAssessmentComponent} from '../../../../components/new-assessment/new-assessment.component';
import {TeamsManagerService} from '../../../../../../data/services/teams/teams.manager.service';
import {AssessmentDto} from '../../../../../../data/dto/AssessmentDto';
import {DeleteAssessmentComponent} from '../../../../components/delete-assessment/delete-assessment.component';

@Component({
    selector: 'app-team',
    imports: [
        HeaderComponent,
        NgIf,
        NgForOf,
        NewAssessmentComponent,
        NgOptimizedImage,
        DeleteAssessmentComponent,

    ],
    templateUrl: './team.component.html',
    styleUrl: './styles/team.component.scss'
})
export class TeamComponent implements OnInit {
    protected teamData: any;
    protected breadcrumbs: string[] = [];
    protected foundTeam: string = "";
    protected modalStates = {
        create: false,
        edit: false,
        delete: false,
    }
    protected selectedAssessmentForEdit: AssessmentDto | null = null;

    protected assessments: AssessmentDto[] = [];
    protected teamId: string = '';
    protected selectedAssessmentId: string = '';

    private _events: any;
    private readonly _route: ActivatedRoute = inject(ActivatedRoute);
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
        this.teamId = this._route.snapshot.paramMap.get('id')!;

        this.loadAssessments();

        this.getCurrentEvents();
    }

    protected openEditModal(assessment: AssessmentDto): void {
        this.selectedAssessmentForEdit = assessment;
        this.toggleModal('edit', true);
    }

    protected openDeleteModal(assessmentId: string): void {
        this.selectedAssessmentId = assessmentId;
        this.toggleModal('delete', true);
    }

    protected toggleModal(type: keyof typeof this.modalStates, state: boolean): void {
        this.modalStates[type] = state;

        if (state) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
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

    protected handleAssessmentSaved(): void {
        this.loadAssessments();
        this.toggleModal('edit', false);
        this.toggleModal('create', false);
        this.toggleModal('delete', false);
    }

    @HostListener('document:click', ['$event'])
    protected closeDropdown(event: MouseEvent): void {
        const clickedElement: HTMLElement = event.target as HTMLElement;
        const isDropdown: Element | null = clickedElement.closest('.dropdown-menu');
        const isButton: Element | null = clickedElement.closest('.second-button');

        if (!isDropdown && !isButton) {
            this.selectedAssessmentId = '';
        }
    }

    protected toggleDropdown(assessmentId: string): void {
        this.selectedAssessmentId = this.selectedAssessmentId === assessmentId ? '' : assessmentId;
    }

    private getCurrentEvents(): void {
        this._eventsManagerService.getCurrent().pipe(
            takeUntilDestroyed(this._destroyRef)
        ).subscribe((events: GetEventHierarchyResponse): void => {
            this._events = events;

            if (this._events && this._events.event && this._events.event.directions) {
                this.buildBreadcrumbs();
            }

            this._cdr.detectChanges();
        })
    }

    private buildBreadcrumbs(): void {
        for (const direction of this._events.event.directions) {
            for (const project of direction.projects) {
                const foundTeam = project.teams.find((t: any): boolean => t.id === this.teamId);
                if (foundTeam) {
                    this.teamData = foundTeam;
                    this.breadcrumbs = [
                        this._events.event.name,
                        direction.name,
                        project.name
                    ];

                    this.foundTeam = foundTeam.name;

                    return;
                }
            }
        }
    }

    private loadAssessments(): void {
        this._teamsManagerService.getTeamAssessment(this.teamId).pipe(
            takeUntilDestroyed(this._destroyRef),
        ).subscribe((assessments: AssessmentDto[]): void => {
            this.assessments = assessments;
            this._cdr.detectChanges();
        });
    }
}
