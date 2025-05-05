import {
    ChangeDetectorRef,
    Component,
    DestroyRef,
    EventEmitter,
    inject,
    Input,
    OnChanges,
    OnInit,
    Output,
    SimpleChanges
} from '@angular/core';
import {Router} from '@angular/router';
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {NgClass, NgForOf, NgIf, NgOptimizedImage} from '@angular/common';
import {EventsManagerService} from '../../../../data/services/events/events.manager.service';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {GetEventHierarchyResponse} from '../../../../data/models/events/IGetEventHierarchy.response';
import {DirectionDto} from '../../../../data/dto/DirectionDto';
import {ProjectDto} from '../../../../data/dto/ProjectDto';
import {TeamDto} from '../../../../data/dto/TeamDto';
import {TeamsManagerService} from '../../../../data/services/teams/teams.manager.service';
import {AssessmentsManagerService} from '../../../../data/services/assessments/assessments.manager.service';
import {IEditAssessmentRequest} from '../../../../data/models/assessments/IEditAssessment.request';
import {AssessmentDto} from '../../../../data/dto/AssessmentDto';
import {ICreateTeamAssessmentRequest} from '../../../../data/models/teams/ICreateTeamAssessment.request';
import {ICreateTeamsAssessmentRequest} from '../../../../data/models/events/ICreateTeamsAssessment.request';

@Component({
    selector: 'app-new-assessment',
    imports: [
        FormsModule,
        ReactiveFormsModule,
        NgIf,
        NgForOf,
        NgOptimizedImage,
        NgClass
    ],
    templateUrl: './new-assessment.component.html',
    styleUrl: './styles/new-assessment.component.scss'
})
export class NewAssessmentComponent implements OnInit, OnChanges {
    @Input()
    public isVisible: boolean = false;
    @Input()
    title: string = 'Создание нового оценивания';
    @Input()
    public editingAssessment: any = null;
    @Input()
    public teamId: string = '';
    @Output()
    public createAssessment: EventEmitter<{ assessment: any, isEdit: boolean }> = new EventEmitter();
    @Output()
    protected close: EventEmitter<void> = new EventEmitter<void>();
    protected isDropdownOpen: boolean = false;
    protected showTeamsSelect: boolean | null = true;

    protected selectedTeams: { id: string, name: string }[] = [];
    protected selectedAssessmentTypes: string[] = [];
    protected isAssessmentActive: boolean = false;

    protected teamsArr: Record<string, { id: string, name: string }> = {};
    protected assessmentsArr = [
        {type: 'circle', label: 'Оценка 360', checked: false},
        {type: 'behavior', label: 'Оценка поведения', checked: false}
    ];
    protected formAssessment: FormGroup = new FormGroup({
        name: new FormControl('', [Validators.required]),
        dateOpen: new FormControl('', [Validators.required]),
        dateClose: new FormControl('', [Validators.required])
    })
    protected readonly Object = Object;

    private readonly _destroyRef: DestroyRef = inject(DestroyRef);
    private readonly _cdr: ChangeDetectorRef = inject(ChangeDetectorRef);
    private readonly _router: Router = inject(Router);

    private readonly _eventsManagerService: EventsManagerService = inject(EventsManagerService);
    private readonly _teamsManagerService: TeamsManagerService = inject(TeamsManagerService);
    private readonly _assessmentsManagerService: AssessmentsManagerService = inject(AssessmentsManagerService);

    public ngOnInit(): void {
        const currentUrl: string = this._router.url;

        if (currentUrl.startsWith('/teams/team/')) {
            this.showTeamsSelect = false;
        } else if (currentUrl.startsWith('/teams')) {
            this.showTeamsSelect = true;
        }

        this._eventsManagerService.getCurrent().pipe(
            takeUntilDestroyed(this._destroyRef)
        ).subscribe((event: GetEventHierarchyResponse): void => {
            const teamsMap: Record<string, { id: string, name: string }> = {};

            event.event.directions!
                .flatMap((direction: DirectionDto): ProjectDto[] | null => direction.projects)
                .flatMap((project: ProjectDto | null): TeamDto[] | null => project!.teams)
                .forEach((team: TeamDto | null): void => {
                    if (team) {
                        teamsMap[team.id] = {id: team.id, name: team.name!};
                    }
                });

            this.teamsArr = teamsMap;
            this._cdr.markForCheck();
        });
    }

    public ngOnChanges(changes: SimpleChanges): void {
        if (changes['editingAssessment'] && this.editingAssessment) {
            if (!this.editingAssessment) {
                return;
            }
            
            this.formAssessment.patchValue({
                name: this.editingAssessment.name,
                dateOpen: this.editingAssessment.startDate,
                dateClose: this.editingAssessment.endDate,
            });

            this.selectedTeams = [];
            if (this.editingAssessment.teams && Array.isArray(this.editingAssessment.teams)) {
                this.selectedTeams = Object.values(this.teamsArr).filter(team =>
                    this.editingAssessment.teams.includes(team.name)
                );
            }

            this.selectedAssessmentTypes = [];
            if (this.editingAssessment.useCircleAssessment) {
                this.selectedAssessmentTypes.push('circle');
            }
            if (this.editingAssessment.useBehaviorAssessment) {
                this.selectedAssessmentTypes.push('behavior');
            }

            this.syncAssessmentTypesFromSelection();
            this.updateAssessmentActiveStatus();
        }
    }

    protected toggleDropdown(): void {
        this.isDropdownOpen = !this.isDropdownOpen;
    }

    protected closeModal(): void {
        this.close.emit();
    }

    protected confirm(): void {
        if (this.editingAssessment) {
            this.updateAssessment();
        } else if (this.teamId !== '') {
            this.createAssessmentForSingleTeam();
        } else {
            this.createAssessmentForMultipleTeams();
        }
    }

    protected getSelectedTeamNames(): string {
        return this.selectedTeams.map(t => t.name).join(', ');
    }

    protected toggleTeam(teamName: string): void {
        const existingIndex = this.selectedTeams.findIndex(t => t.name === teamName);
        if (existingIndex > -1) {
            this.selectedTeams.splice(existingIndex, 1);
        } else {
            const teamObj = Object.values(this.teamsArr).find(t => t.name === teamName);
            if (teamObj) {
                this.selectedTeams.push(teamObj);
            }
        }
    }

    protected isTeamSelected(teamName: string): boolean {
        return this.selectedTeams.some(t => t.name === teamName);
    }

    protected toggleAssessmentType(type: string): void {
        if (this.isAssessmentActive) return;

        if (type === 'circle') {
            this.selectedAssessmentTypes.includes('circle') ?
                this.selectedAssessmentTypes.splice(this.selectedAssessmentTypes.indexOf('circle'), 1) :
                this.selectedAssessmentTypes.push('circle');
        } else if (type === 'behavior') {
            this.selectedAssessmentTypes.includes('behavior') ?
                this.selectedAssessmentTypes.splice(this.selectedAssessmentTypes.indexOf('behavior'), 1) :
                this.selectedAssessmentTypes.push('behavior');
        }

        this.syncAssessmentTypesFromSelection();
        this.updateAssessmentActiveStatus();
    }

    private updateAssessment(): void {
        const formValue: any = this.formAssessment.value;

        const request: IEditAssessmentRequest = {
            name: formValue.name,
            startDate: formValue.dateOpen,
            endDate: formValue.dateClose,
            useCircleAssessment: this.selectedAssessmentTypes.includes('circle'),
            useBehaviorAssessment: this.selectedAssessmentTypes.includes('behavior')
        };

        this._assessmentsManagerService.editAssessmentById(this.editingAssessment.id, request).pipe(
            takeUntilDestroyed(this._destroyRef)
        ).subscribe((updatedAssessment: AssessmentDto): void => {
            this.createAssessment.emit({assessment: updatedAssessment, isEdit: true});
            this.close.emit();
            this.closeModal();

            this._cdr.detectChanges();
        });
    }

    private createAssessmentForSingleTeam(): void {
        const formValue: any = this.formAssessment.value;

        const request: ICreateTeamAssessmentRequest = {
            name: formValue.name,
            startDate: formValue.dateOpen,
            endDate: formValue.dateClose,
            useCircleAssessment: this.selectedAssessmentTypes.includes('circle'),
            useBehaviorAssessment: this.selectedAssessmentTypes.includes('behavior')
        };

        const teamId: string = this.teamId;

        this._teamsManagerService.createTeamAssessment(teamId, request).pipe(
            takeUntilDestroyed(this._destroyRef)
        ).subscribe((createdAssessment: AssessmentDto): void => {
            this.createAssessment.emit({assessment: createdAssessment, isEdit: false});
            this.close.emit();
            this.closeModal();
            this._cdr.detectChanges();
        });
    }

    private createAssessmentForMultipleTeams(): void {
        const formValue = this.formAssessment.value;

        const request: ICreateTeamsAssessmentRequest = {
            name: formValue.name,
            startDate: formValue.dateOpen,
            endDate: formValue.dateClose,
            useCircleAssessment: this.selectedAssessmentTypes.includes('circle'),
            useBehaviorAssessment: this.selectedAssessmentTypes.includes('behavior'),
            teamIds: this.selectedTeams.map(t => t.id)
        };

        this._eventsManagerService.createAssessment(request)
            .pipe(takeUntilDestroyed(this._destroyRef))
            .subscribe((createdAssessment: AssessmentDto): void => {
                this.createAssessment.emit({assessment: createdAssessment, isEdit: false});
                this.close.emit();
                this.closeModal();
                this._cdr.detectChanges();
            });
    }


    private updateAssessmentActiveStatus(): void {
        const now = new Date();
        const startDate = new Date(this.editingAssessment.startDate);
        const endDate = new Date(this.editingAssessment.endDate);

        const isActive: boolean = startDate <= now && endDate >= now;
        this.isAssessmentActive = isActive;
    }

    private syncAssessmentTypesFromSelection(): void {
        this.assessmentsArr.forEach(a => {
            if (a.type === 'circle') {
                a.checked = this.selectedAssessmentTypes.includes('circle');
            } else if (a.type === 'behavior') {
                a.checked = this.selectedAssessmentTypes.includes('behavior');
            }
        });
    }
}
