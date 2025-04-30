import {ChangeDetectorRef, Component, DestroyRef, EventEmitter, inject, Input, OnInit, Output} from '@angular/core';
import {Router} from '@angular/router';
import {FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {NgClass, NgForOf, NgIf, NgOptimizedImage} from '@angular/common';

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
export class NewAssessmentComponent implements OnInit {
    @Input()
    public isVisible: boolean = false;
    @Input()
    public teamsId: string[] = [];
    @Input()
    title: string = 'Создание нового оценивания';
    @Output()
    protected close: EventEmitter<void> = new EventEmitter<void>();
    protected confirmAction: EventEmitter<void> = new EventEmitter<void>();

    protected isDropdownOpen: boolean = false;
    protected showTeamsSelect: boolean | null = true;

    protected selectedTeams: any[] = [];

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

    protected toggleDropdown(): void {
        this.isDropdownOpen = !this.isDropdownOpen;
    }

    protected closeModal(): void {
        this.close.emit();
    }

    protected confirm(): void {
        this.confirmAction.emit();
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


}
