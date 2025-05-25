import {ChangeDetectorRef, Component, DestroyRef, inject, OnInit} from '@angular/core';
import {HeaderComponent} from '../../components/header/header.component';
import {ModalResultsComponent} from '../../components/modal-results/modal-results.component';
import {NgClass, NgForOf, NgIf, NgOptimizedImage} from '@angular/common';
import {ActivatedRoute, Router} from '@angular/router';
import {CriteriaDto} from '../../../../data/dto/CriteriaDto';
import {UserMeanScoreDto} from '../../../../data/dto/UserMeanScoreDto';
import {TemplatesCriteriaManagerService} from '../../../../data/services/templates/templates-criteria.manager.service';
import {UserScoresManagerService} from '../../../../data/services/user-scores/user-scores.manager.service';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {FormWithCriteriaDto} from '../../../../data/dto/FormWithCriteriaDto';
import {LoadingComponent} from '../../components/loading/loading.component';
import {AuthManagerService} from '../../../../data/services/auth/auth.manager.service';
import {jwtDecode} from 'jwt-decode';
import {StudentHeaderComponent} from '../../components/student-header/student-header.component';
import {AssessmentDto} from '../../../../data/dto/AssessmentDto';
import {TeamsManagerService} from '../../../../data/services/teams/teams.manager.service';

@Component({
    selector: 'app-student-results',
    imports: [
        HeaderComponent,
        ModalResultsComponent,
        NgForOf,
        NgClass,
        NgOptimizedImage,
        NgIf,
        LoadingComponent,
        StudentHeaderComponent
    ],
    templateUrl: './student-results.component.html',
    styleUrl: './styles/student-results.component.scss'
})
export class StudentResultsComponent implements OnInit {
    public isLoading: boolean = true;
    public userRole: string | null = null;
    public selectedAssessmentId: string | null = null;
    protected userId: string = '';
    protected isModalOpen: boolean = false;
    protected isDropdownOpen: boolean = false;
    protected userScores: UserMeanScoreDto | null = null;
    protected circleCriteria: CriteriaDto[] = [];
    protected behaviorCriteria: CriteriaDto[] = [];
    protected readonly Object = Object;
    protected assessments: AssessmentDto[] = [];
    private circleFormId: string = '';
    private behaviorFormId: string = '';
    private readonly _route: ActivatedRoute = inject(ActivatedRoute);
    private readonly _router: Router = inject(Router);
    private readonly _destroyRef: DestroyRef = inject(DestroyRef);
    private readonly _cdr: ChangeDetectorRef = inject(ChangeDetectorRef);
    private readonly _authManager: AuthManagerService = inject(AuthManagerService);
    private readonly _templatesCriteriaManager: TemplatesCriteriaManagerService = inject(TemplatesCriteriaManagerService);
    private readonly _userScoresManager: UserScoresManagerService = inject(UserScoresManagerService);
    private readonly _teamsManagerService: TeamsManagerService = inject(TeamsManagerService);

    public ngOnInit(): void {
        this.userRole = this.getUserRole();
        this.userId = this._route.snapshot.paramMap.get('userId')!;

        this.getTemplatesCriteria();
    }

    public isAdminTutor(): boolean {
        return this.userRole === 'Admin' || this.userRole === 'Tutor';
    }

    public isMember(): boolean {
        return this.userRole === 'Member';
    }

    public getSelectedAssessmentNamePart1(): string | null {
        if (!this.selectedAssessmentId) return '';
        const selected = this.assessments.find(a => a.id === this.selectedAssessmentId);
        return selected ? selected.name : '';
    }

    public getSelectedAssessmentNamePart2(): string {
        if (!this.selectedAssessmentId) return '';
        const selected = this.assessments.find(a => a.id === this.selectedAssessmentId);
        return selected ? `${this.formatDate(selected.startDate)} - ${this.formatDate(selected.endDate)}` : '';
    }


    public selectAverageScores(): void {
        this.selectedAssessmentId = null;
        this.loadAssessmentScores();
        this.isDropdownOpen = false;
    }

    public selectAssessment(assessmentId: string): void {
        this.selectedAssessmentId = assessmentId;
        this.loadAssessmentScores();
        this.isDropdownOpen = false;
    }

    protected navigateBackToResults(): void {
        this._router.navigate(['results']);
    }

    protected toggleDropdown(): void {
        this.isDropdownOpen = !this.isDropdownOpen;
    }

    protected openModal(): void {
        this.isModalOpen = true;
    }

    protected closeModal(): void {
        this.isModalOpen = false;
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

    protected getScore(user: UserMeanScoreDto | null, criteriaId: string): number | null {
        if (!user || !user.scoreByCriteriaIds) {
            return null;
        }
        const score = user.scoreByCriteriaIds[criteriaId];
        return score !== undefined && score !== null ? Math.round(score * 10) / 10 : null;
    }

    protected getScoreClass(score: number | null): string {
        if (score === null) return 'score-cell no-data';

        if (score >= -1 && score < 0) return 'score-cell score-low';
        if (score >= 0 && score < 1) return 'score-cell score-medium';
        if (score >= 1 && score < 2) return 'score-cell score-high';
        if (score >= 2 && score <= 3) return 'score-cell score-very-high';

        return 'score-cell no-data';
    }

    private getTemplatesCriteria(): void {
        this._templatesCriteriaManager.getFormsWithCriteria().pipe(
            takeUntilDestroyed(this._destroyRef),
        ).subscribe((templates: FormWithCriteriaDto[]): void => {
            const circle = templates.find(f => f.type === 0);
            const behavior = templates.find(f => f.type === 1);

            if (circle) {
                this.circleFormId = circle.id;
                this.circleCriteria = circle.criteriaList ?? [];

                console.log(this.circleCriteria);
            }

            if (behavior) {
                this.behaviorFormId = behavior.id;
                this.behaviorCriteria = behavior.criteriaList ?? [];
            }

            this.timeout(500);

            this.loadAssessmentScores();

            this._cdr.detectChanges();
        })
    }

    private loadAssessmentScores(): void {
        this._userScoresManager.getUserMeanScoresByForm(this.userId, this.selectedAssessmentId ?? undefined).pipe(
            takeUntilDestroyed(this._destroyRef)
        ).subscribe((userScores: UserMeanScoreDto): void => {
            this.userScores = userScores;

            this.loadAssessments(userScores.teamId);

            this._cdr.detectChanges();
        });
    }

    private timeout(time: number): void {
        setTimeout((): void => {
            this.isLoading = false;
            this._cdr.detectChanges();
        }, time);
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

    private loadAssessments(teamId: string): void {
        this._teamsManagerService.getTeamAssessment(teamId).pipe(
            takeUntilDestroyed(this._destroyRef),
        ).subscribe((assessments: AssessmentDto[]): void => {
            this.assessments = assessments;
            this._cdr.detectChanges();
        });
    }
}
