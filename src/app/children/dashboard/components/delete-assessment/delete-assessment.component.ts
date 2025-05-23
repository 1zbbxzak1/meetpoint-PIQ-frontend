import {ChangeDetectorRef, Component, DestroyRef, EventEmitter, inject, Input, Output} from '@angular/core';
import {NgIf, NgOptimizedImage} from '@angular/common';
import {ReactiveFormsModule} from '@angular/forms';
import {AssessmentsManagerService} from '../../../../data/services/assessments/assessments.manager.service';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';

@Component({
    selector: 'app-delete-assessment',
    imports: [
        NgIf,
        NgOptimizedImage,
        ReactiveFormsModule
    ],
    templateUrl: './delete-assessment.component.html',
    styleUrl: './styles/delete-assessment.component.scss'
})
export class DeleteAssessmentComponent {
    @Input()
    public isVisible: boolean = false;
    @Input()
    public assessmentId: string = '';
    @Output()
    protected close: EventEmitter<void> = new EventEmitter<void>();

    private readonly _destroyRef: DestroyRef = inject(DestroyRef);
    private readonly _cdr: ChangeDetectorRef = inject(ChangeDetectorRef);
    private readonly _assessmentsManagerService: AssessmentsManagerService = inject(AssessmentsManagerService);

    protected closeModal(): void {
        this.close.emit();
    }

    protected confirm(): void {
        this.deleteAssessment();
    }

    private deleteAssessment(): void {
        this._assessmentsManagerService.deleteAssessmentById(this.assessmentId).pipe(
            takeUntilDestroyed(this._destroyRef)
        ).subscribe((): void => {
            this.close.emit();
            this.closeModal();
            this._cdr.detectChanges();
        });
    }
}
