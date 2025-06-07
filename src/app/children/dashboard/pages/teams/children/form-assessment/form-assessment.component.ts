import {ChangeDetectorRef, Component, DestroyRef, inject, OnInit} from '@angular/core';
import {NgClass, NgForOf, NgIf, NgOptimizedImage, NgSwitch, NgSwitchCase, NgSwitchDefault} from '@angular/common';
import {AssessUserDto} from '../../../../../../data/dto/AssessUserDto';
import {AssessmentsManagerService} from '../../../../../../data/services/assessments/assessments.manager.service';
import {ActivatedRoute, Router} from '@angular/router';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {UserDto} from '../../../../../../data/dto/UserDto';
import {FormShortDto} from '../../../../../../data/dto/FormShortDto';
import {AssessChoiceDto} from '../../../../../../data/dto/AssessChoiceDto';
import {forkJoin} from 'rxjs';
import {AuthManagerService} from '../../../../../../data/services/auth/auth.manager.service';
import {jwtDecode} from 'jwt-decode';
import {TooltipDirective} from './directives/tooltip.directive';


interface AssessUserStep {
    user: UserDto;
    assessed: boolean;
    status: 'finished' | 'active' | 'waiting';
}

@Component({
    selector: 'app-form-assessment',
    standalone: true,
    imports: [
        NgOptimizedImage,
        NgForOf,
        NgIf,
        NgSwitchCase,
        NgClass,
        NgSwitch,
        NgSwitchDefault,
        TooltipDirective
    ],
    templateUrl: './form-assessment.component.html',
    styleUrls: [
        './styles/form-assessment.component.scss',
        './directives/tooltip.scss'
    ]
})
export class FormAssessmentComponent implements OnInit {
    protected isLoading: boolean = true;

    protected teamId: string = '';
    protected assessmentId: string = '';
    protected assessmentName: string | null = '';
    protected usedForms: FormShortDto[] = [];
    protected usedFormOne: FormShortDto[] = [];
    protected usedFormTwo: FormShortDto[] = [];

    protected assessUsers: AssessUserDto[] = [];
    protected currentIndex: number = 0;
    protected steps: AssessUserStep[] = [];

    protected selectedChoices: { [userId: string]: { [questionId: string]: string } } = {};

    private readonly tooltipWidths: number[][] = [
        [180, 190, 210, 210, 200], // первый вопрос
        [156, 172, 168, 200, 190], // второй вопрос
        [174, 156, 200, 204, 214], // третий вопрос
        [148, 148, 164, 180, 180], // четвертый вопрос
        [216, 160, 170, 192, 192], // пятый вопрос
        [180, 192, 164, 194, 292], // шестой вопрос
        [160, 170, 140, 124, 162], // седьмой вопрос
        [180, 190, 148, 170, 170]  // восьмой вопрос
    ];

    private readonly _route: ActivatedRoute = inject(ActivatedRoute);
    private readonly _router: Router = inject(Router);
    private readonly _destroyRef: DestroyRef = inject(DestroyRef);
    private readonly _cdr: ChangeDetectorRef = inject(ChangeDetectorRef);
    private readonly _authManager: AuthManagerService = inject(AuthManagerService);
    private readonly _assessmentsManagerService: AssessmentsManagerService = inject(AssessmentsManagerService);

    protected get currentUserId(): string {
        if (this.currentIndex === -1) return '';
        return this.assessUsers[this.currentIndex]?.user.id ?? '';
    }

    public ngOnInit(): void {
        this.assessmentId = this._route.snapshot.paramMap.get('assessmentId')!;
        this.teamId = this._route.snapshot.paramMap.get('id')!;

        this.loadData();
    }

    protected goToPreviousUser(): void {
        if (this.currentIndex > 0) {
            this.currentIndex--;
            this.steps.forEach((step, i): void => {
                step.status = i === this.currentIndex ? 'active' : (i < this.currentIndex ? 'finished' : 'waiting');
            });
            this._cdr.detectChanges();
        }
    }

    protected nextStep(): void {
        const userId: string = this.currentUserId;
        const choices: string[] = this.getChoicesArrayForUser(userId);

        if (!userId) return;

        this._assessmentsManagerService.assessUserWithChoices(this.assessmentId, userId, choices).pipe(
            takeUntilDestroyed(this._destroyRef)
        ).subscribe({
            next: (): void => {
                const currentStep: AssessUserStep = this.steps[this.currentIndex];
                currentStep.assessed = true;
                currentStep.status = 'finished';

                if (this.currentIndex < this.steps.length - 1) {
                    this.currentIndex++;
                    this.steps[this.currentIndex].status = 'active';
                    this._cdr.detectChanges();

                    window.scrollTo({top: 0, behavior: 'smooth'});
                } else {
                    this.steps[this.currentIndex].status = 'active';
                    this._cdr.detectChanges();
                    this.navigateBackToTeam();
                }
            },
            error: (err: any): void => {
                console.error(err);
            }
        });
    }

    protected getShortName(fullName: string | null): string {
        if (!fullName) return '';

        const parts = fullName.trim().split(' ');
        if (parts.length === 0) return '';

        const lastName = parts[0];
        const firstInitial = parts[1] ? parts[1][0] + '.' : '';
        const patronymicInitial = parts[2] ? parts[2][0] + '.' : '';

        return `${lastName} ${firstInitial}${patronymicInitial}`;
    }

    protected selectChoice(questionId: string, choiceId: string): void {
        const userId = this.currentUserId;
        if (!this.selectedChoices[userId]) {
            this.selectedChoices[userId] = {};
        }
        this.selectedChoices[userId][questionId] = choiceId;
    }

    protected isSelected(questionId: string, choiceId: string): boolean {
        const userId = this.currentUserId;
        return this.selectedChoices[userId]?.[questionId] === choiceId;
    }

    protected navigateBackToTeam(): void {
        const role = this.getUserRole();
        if (role === 'Admin' || role === 'Tutor') {
            this._router.navigate(['teams/team', this.teamId]);
        } else if (role === 'Member') {
            this._router.navigate(['student-team']);
        } else {
            this._router.navigate(['/']);
        }
    }

    protected getTooltipWidth(questionIndex: number, choiceIndex: number): string {
        return `${this.tooltipWidths[questionIndex][choiceIndex]}px`;
    }

    private initializeSteps() {
        const firstNotAssessedIndex = this.assessUsers.findIndex(user => !user.assessed);

        if (firstNotAssessedIndex === -1) {
            this.currentIndex = 0;
            this.steps = this.assessUsers.map((user, index) => ({
                ...user,
                status: 'finished'
            }));

            if (this.steps.length > 0) {
                this.steps[0].status = 'active';
            }
        } else {
            this.currentIndex = firstNotAssessedIndex;
            this.steps = this.assessUsers.map((user, index) => {
                let status: 'finished' | 'active' | 'waiting';

                if (index < this.currentIndex) {
                    status = 'finished';
                } else if (index === this.currentIndex) {
                    status = 'active';
                } else {
                    status = 'waiting';
                }

                return {
                    ...user,
                    status,
                };
            });
        }
    }

    private loadUserChoices(userId: string): void {
        this._assessmentsManagerService.getChoicesForUser(this.assessmentId, userId).pipe(
            takeUntilDestroyed(this._destroyRef)
        ).subscribe((choices: AssessChoiceDto[]) => {
            if (!this.selectedChoices[userId]) {
                this.selectedChoices[userId] = {};
            }
            choices.forEach(choice => {
                // Сохраняем выбор по questionId
                this.selectedChoices[userId][choice.questionId] = choice.choiceId;
            });
            this._cdr.detectChanges();
        });
    }

    private getChoicesArrayForUser(userId: string): string[] {
        const choicesByQuestion = this.selectedChoices[userId];
        if (!choicesByQuestion) {
            return [];
        }
        return Object.values(choicesByQuestion);
    }

    private loadData(): void {
        forkJoin({
            assessment: this._assessmentsManagerService.getAssessmentById(this.assessmentId),
            users: this._assessmentsManagerService.getAssessUsers(this.assessmentId),
            forms: this._assessmentsManagerService.getUsedForms(this.assessmentId)
        }).pipe(
            takeUntilDestroyed(this._destroyRef)
        ).subscribe(({assessment, users, forms}): void => {
            this.assessmentName = assessment.name;

            this.assessUsers = users;
            users.forEach(user => {
                if (user.assessed) {
                    this.loadUserChoices(user.user.id);
                }
            });
            if (this.assessUsers.length > 0) {
                this.initializeSteps();
            }

            this.usedForms = forms;
            this.usedFormOne = this.usedForms.filter(f => f.type === 0);
            this.usedFormTwo = this.usedForms.filter(f => f.type === 1);

            this.isLoading = false;
            this._cdr.detectChanges();
        });
    }

    private getUserRole(): string | null {
        const token = this._authManager.getAccessToken();
        if (!token) return null;

        try {
            const decoded: any = jwtDecode(token);
            return decoded['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] || null;
        } catch {
            return null;
        }
    }

    private getAssessmentById(): void {

    }
}
