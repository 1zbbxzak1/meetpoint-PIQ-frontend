import {ChangeDetectorRef, Component, DestroyRef, inject, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {HeaderComponent} from '../../../../components/header/header.component';
import {NgForOf, NgIf} from '@angular/common';
import {EventsManagerService} from '../../../../../../data/services/events/events.manager.service';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {GetEventWithIncludesResponse} from '../../../../../../data/models/events/IEvents.response';
import {NewAssessmentComponent} from '../../../../components/new-assessment/new-assessment.component';
import {AssessmentService} from '../../services/assessment.service';

@Component({
    selector: 'app-team',
    imports: [
        HeaderComponent,
        NgIf,
        NgForOf,
        NewAssessmentComponent,

    ],
    templateUrl: './team.component.html',
    styleUrl: './styles/team.component.scss'
})
export class TeamComponent implements OnInit {
    protected teamData: any;
    protected breadcrumbs: string[] = [];
    protected modalStates = {
        create: false,
        edit: false,
    }
    protected selectedAssessmentForEdit: any = null;

    protected assessments: any = [];
    private _teamId!: string;
    private _events: any;
    private readonly _route: ActivatedRoute = inject(ActivatedRoute);
    private readonly _router: Router = inject(Router);
    private readonly _destroyRef: DestroyRef = inject(DestroyRef);
    private readonly _cdr: ChangeDetectorRef = inject(ChangeDetectorRef);
    private readonly _eventsManagerService: EventsManagerService = inject(EventsManagerService);
    private readonly _assessmentService: AssessmentService = inject(AssessmentService);

    protected get activeAssessments(): any[] {
        const now = new Date();
        return this.assessments
            .filter((a: any) => a.dateStart && a.dateEnd)
            .filter((assessment: any) => {
                const startDate = new Date(assessment.dateStart);
                const endDate = new Date(assessment.dateEnd);
                return startDate <= now && endDate >= now;
            })
            .sort((a: { dateStart: string | number | Date; }, b: {
                dateStart: string | number | Date;
            }): number => new Date(b.dateStart).getTime() - new Date(a.dateStart).getTime());
    }

    protected get futureAssessments(): any[] {
        const now = new Date();
        return this.assessments
            .filter((a: any) => a.dateStart)
            .filter((assessment: any) => {
                const startDate = new Date(assessment.dateStart);
                return startDate > now;
            })
            .sort((a: { dateStart: string | number | Date; }, b: {
                dateStart: string | number | Date;
            }): number => new Date(b.dateStart).getTime() - new Date(a.dateStart).getTime());
    }

    protected get completeAssessments(): any[] {
        const now = new Date();
        return this.assessments
            .filter((a: any) => a.dateEnd)
            .filter((assessment: any) => {
                const endDate = new Date(assessment.dateEnd);
                return endDate < now;
            })
            .sort((a: { dateStart: string | number | Date; }, b: {
                dateStart: string | number | Date;
            }): number => new Date(b.dateStart).getTime() - new Date(a.dateStart).getTime());
    }

    public ngOnInit(): void {
        this._teamId = this._route.snapshot.paramMap.get('id')!;

        this.getCurrentEvents();
    }

    protected openEditModal(assessment: any): void {
        this.selectedAssessmentForEdit = assessment;
        this.toggleModal('edit', true);
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

        const team = this._events.event.directions
            .flatMap((direction: any) => direction.projects)
            .flatMap((project: any) => project.teams)
            .find((team: any) => team.id === this._teamId);

        if (!isEdit) {
            assessment.teams = assessment.teams || [];
            assessment.teams.push(team.name);
            this._assessmentService.addAssessment(assessment);
        } else {
            this._assessmentService.updateAssessment(assessment);
        }

        // Получаем оценки для данной команды из localStorage
        const assessmentsForTeam = this._assessmentService.getAssessmentsForTeam(team.name);

        // Теперь отображаем только те оценки, которые связаны с этой командой
        this.assessments = assessmentsForTeam;

        this._cdr.detectChanges();
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

    private getCurrentEvents(): void {
        this._eventsManagerService.getCurrent().pipe(
            takeUntilDestroyed(this._destroyRef)
        ).subscribe((events: GetEventWithIncludesResponse): void => {
            this._events = events;

            if (this._events && this._events.event && this._events.event.directions) {
                let serverAssessments = this._events.event.directions
                    .flatMap((direction: any) => direction.projects)
                    .flatMap((project: any) => project.teams)
                    .flatMap((team: any) => team.assessments || []);

                const localAssessments = this._assessmentService.createdAssessments;

                this.assessments = [...serverAssessments, ...localAssessments];

                this.buildBreadcrumbs();
            }

            this._cdr.detectChanges();
        })
    }

    private buildBreadcrumbs(): void {
        for (const direction of this._events.event.directions) {
            for (const project of direction.projects) {
                const foundTeam = project.teams.find((t: any): boolean => t.id === this._teamId);
                if (foundTeam) {
                    this.teamData = foundTeam;
                    this.breadcrumbs = [
                        this._events.event.name,
                        direction.name,
                        project.name,
                        foundTeam.name
                    ];
                    return;
                }
            }
        }
    }
}
