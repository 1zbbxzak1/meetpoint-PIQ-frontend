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
import {FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {NgClass, NgForOf, NgIf, NgOptimizedImage} from '@angular/common';
import {v4 as uuidv4} from 'uuid';

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
    public teamsId: string[] = [];
    @Input()
    title: string = 'Создание нового оценивания';

    // Заглушки для сохранения и редактирования оценок
    @Input()
    public editingAssessment: any = null;
    @Output()
    public createAssessment: EventEmitter<{ assessment: any, isEdit: boolean }> = new EventEmitter();

    @Output()
    protected close: EventEmitter<void> = new EventEmitter<void>();

    protected isDropdownOpen: boolean = false;
    protected showTeamsSelect: boolean | null = true;

    protected selectedTeams: any[] = [];
    protected selectedAssessmentTypes: string[] = [];
    protected isAssessmentActive: boolean = false;

    protected teamsArr = [
        {name: 'ПВК 1'},
        {name: 'ПВК 2'},
        {name: 'ПВК 3'},
        {name: 'УНФ айки'}
    ];

    protected assessmentsArr = [
        {name: 'Оценка 360'},
        {name: 'Оценка поведения'},
    ];

    protected formAssessment: FormGroup = new FormGroup({
        name: new FormControl('', [Validators.required]),
        dateOpen: new FormControl('', [Validators.required]),
        dateClose: new FormControl('', [Validators.required])
    })
    private teamId: string = '';
    private readonly _destroyRef: DestroyRef = inject(DestroyRef);
    private readonly _cdr: ChangeDetectorRef = inject(ChangeDetectorRef);
    private readonly _router: Router = inject(Router);
    private readonly _fb: FormBuilder = inject(FormBuilder);
    form = this._fb.group({
        dateOpen: [''],
        dateClose: [''],
    });

    public ngOnInit(): void {
        const currentUrl = this._router.url;

        if (currentUrl.startsWith('/teams/team/')) {
            this.showTeamsSelect = false;
        } else if (currentUrl.startsWith('/teams')) {
            this.showTeamsSelect = true;
        }
    }

    public ngOnChanges(changes: SimpleChanges): void {
        if (changes['editingAssessment'] && this.editingAssessment) {
            this.formAssessment.patchValue({
                name: this.editingAssessment.name,
                dateOpen: this.editingAssessment.dateStart,
                dateClose: this.editingAssessment.dateEnd,
            });

            this.selectedTeams = this.teamsArr.filter(team =>
                this.editingAssessment.teams.includes(team.name)
            );

            this.selectedAssessmentTypes = [...this.editingAssessment.assessmentTypes];

            this.updateAssessmentActiveStatus();
        }
    }

    protected toggleDropdown(): void {
        this.isDropdownOpen = !this.isDropdownOpen;
    }

    protected closeModal(): void {
        this.close.emit();
    }

    // Заглушка на отработку создания / редактирования
    protected confirm(): void {
        if (this.editingAssessment) {
            this.editingAssessment.name = this.formAssessment.get('name')?.value;
            this.editingAssessment.dateStart = this.formAssessment.get('dateOpen')?.value;
            this.editingAssessment.dateEnd = this.formAssessment.get('dateClose')?.value;
            this.editingAssessment.assessmentTypes = [...this.selectedAssessmentTypes];

            this.createAssessment.emit({assessment: this.editingAssessment, isEdit: true});
        } else {
            const newAssessment = {
                id: uuidv4(),
                name: this.formAssessment.get('name')?.value,
                dateStart: this.formAssessment.get('dateOpen')?.value,
                dateEnd: this.formAssessment.get('dateClose')?.value,
                teams: this.selectedTeams.map(t => t.name),
                assessmentTypes: [...this.selectedAssessmentTypes]
            };

            this.createAssessment.emit({assessment: newAssessment, isEdit: false});
        }

        this.closeModal();
    }

    protected getSelectedTeamNames(): string {
        return this.selectedTeams.map(t => t.name).join(', ');
    }

    protected toggleTeam(teamName: string): void {
        const index = this.selectedTeams.findIndex(t => t.name === teamName);
        if (index > -1) {
            this.selectedTeams.splice(index, 1);
        } else {
            const teamObj = this.teamsArr.find(t => t.name === teamName);
            if (teamObj) {
                this.selectedTeams.push(teamObj);
            }
        }
    }

    protected isTeamSelected(teamId: string): boolean {
        return this.selectedTeams.some(t => t.name === teamId);
    }

    protected toggleAssessmentType(type: string): void {
        if (this.isAssessmentActive) return;

        const index = this.selectedAssessmentTypes.indexOf(type);
        if (index > -1) {
            this.selectedAssessmentTypes.splice(index, 1);
        } else {
            this.selectedAssessmentTypes.push(type);
        }
    }

    protected isAssessmentTypeSelected(type: string): boolean {
        return this.selectedAssessmentTypes.includes(type);
    }

    private updateAssessmentActiveStatus(): void {
        const now = new Date();
        const startDate = new Date(this.editingAssessment.dateStart);
        const endDate = new Date(this.editingAssessment.dateEnd);

        const isActive: boolean = startDate <= now && endDate >= now;
        this.isAssessmentActive = isActive;
    }
}
