import {ChangeDetectorRef, Component, DestroyRef, inject, OnInit} from '@angular/core';
import {HeaderComponent} from '../../components/header/header.component';
import {UserScoresManagerService} from '../../../../data/services/user-scores/user-scores.manager.service';
import {Router} from '@angular/router';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {UserMeanScoreDto} from '../../../../data/dto/UserMeanScoreDto';
import {TemplatesCriteriaManagerService} from '../../../../data/services/templates/templates-criteria.manager.service';
import {FormWithCriteriaDto} from '../../../../data/dto/FormWithCriteriaDto';
import {CriteriaDto} from '../../../../data/dto/CriteriaDto';
import {NgClass, NgForOf, NgIf} from '@angular/common';
import {ModalResultsComponent} from '../../components/modal-results/modal-results.component';
import {LoadingComponent} from '../../components/loading/loading.component';

@Component({
    selector: 'app-results',
    standalone: true,
    imports: [
        HeaderComponent,
        NgForOf,
        NgIf,
        NgClass,
        ModalResultsComponent,
        LoadingComponent
    ],
    templateUrl: './results.component.html',
    styleUrl: './styles/results.component.scss'
})
export class ResultsComponent implements OnInit {
    public isLoading: boolean = true;
    protected activeTab: 'circle' | 'behavior' | '' = 'circle';
    protected isModalOpen: boolean = false;

    protected circleUsersScores: UserMeanScoreDto[] = [];
    protected behaviorUsersScores: UserMeanScoreDto[] = [];

    protected circleCriteria: CriteriaDto[] = [];
    protected behaviorCriteria: CriteriaDto[] = [];

    private circleFormId: string = '';
    private behaviorFormId: string = '';

    private readonly _router: Router = inject(Router);
    private readonly _destroyRef: DestroyRef = inject(DestroyRef);
    private readonly _cdr: ChangeDetectorRef = inject(ChangeDetectorRef);
    private readonly _templatesCriteriaManager: TemplatesCriteriaManagerService = inject(TemplatesCriteriaManagerService);
    private readonly _userScoresManager: UserScoresManagerService = inject(UserScoresManagerService);

    public ngOnInit(): void {
        this.getTemplatesCriteria();
    }

    protected navigateToUserScores(userId: string): void {
        this._router.navigate(['results', userId]);
    }

    protected onSelectTab(tab: 'circle' | 'behavior'): void {
        if (this.activeTab === tab) return;

        this.activeTab = tab;

        if (tab === 'circle') {
            this.loadCircleAssessment();
        } else {
            this.loadBehaviorAssessment();
        }
    }

    protected getScore(user: UserMeanScoreDto, criteriaId: string): number | null {
        const isCircleTab = this.activeTab === 'circle';
        const validCriteria = isCircleTab ? this.circleCriteria : this.behaviorCriteria;

        const exists = validCriteria.some(c => c.id === criteriaId);
        if (!exists) return null;

        const score = user.scoreByCriteriaIds?.[criteriaId];
        if (score === undefined || score === null) return null;

        return Math.round(score * 10) / 10;
    }

    protected getScoreClass(score: number | null): string {
        if (score === null) return 'score-cell no-data';

        if (score >= -1 && score < 0) return 'score-cell score-low';
        if (score >= 0 && score < 1) return 'score-cell score-medium';
        if (score >= 1 && score < 2) return 'score-cell score-high';
        if (score >= 2 && score <= 3) return 'score-cell score-very-high';

        return 'score-cell no-data';
    }

    protected openModal(): void {
        this.isModalOpen = true;
    }

    protected closeModal(): void {
        this.isModalOpen = false;
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

    private getTemplatesCriteria(): void {
        this._templatesCriteriaManager.getFormsWithCriteria().pipe(
            takeUntilDestroyed(this._destroyRef),
        ).subscribe((templates: FormWithCriteriaDto[]): void => {
            const circle = templates.find(f => f.type === 0);
            const behavior = templates.find(f => f.type === 1);

            if (circle) {
                this.circleFormId = circle.id;
                this.circleCriteria = circle.criteriaList ?? [];
            }

            if (behavior) {
                this.behaviorFormId = behavior.id;
                this.behaviorCriteria = behavior.criteriaList ?? [];
            }

            if (this.activeTab === 'circle' && this.circleFormId) {
                this.loadCircleAssessment();
            }

            this.timeout(500);

            this._cdr.detectChanges();
        })
    }

    private loadCircleAssessment(): void {
        this._userScoresManager.getUsersMeanScoresByForm(this.circleFormId).pipe(
            takeUntilDestroyed(this._destroyRef)
        ).subscribe((userScores: UserMeanScoreDto[]): void => {
            this.circleUsersScores = userScores;

            this._cdr.detectChanges();
        });
    }

    private loadBehaviorAssessment(): void {
        this._userScoresManager.getUsersMeanScoresByForm(this.behaviorFormId).pipe(
            takeUntilDestroyed(this._destroyRef)
        ).subscribe((userScores: UserMeanScoreDto[]): void => {
            this.behaviorUsersScores = userScores;

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
