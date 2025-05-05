import {ErrorHandler, inject, Injectable} from '@angular/core';
import {AssessmentsService} from './assessments.service';
import {IEditAssessmentRequest} from '../../models/assessments/IEditAssessment.request';
import {catchError, NEVER, Observable} from 'rxjs';
import {AssessmentDto} from '../../dto/AssessmentDto';

@Injectable()
export class AssessmentsManagerService {

    private readonly _assessmentsService: AssessmentsService = inject(AssessmentsService);
    private readonly _errorHandler: ErrorHandler = inject(ErrorHandler);

    public editAssessmentById(id: string, assessment: IEditAssessmentRequest): Observable<AssessmentDto> {
        return this._assessmentsService.editAssessmentById(id, assessment).pipe(
            catchError(err => {
                this._errorHandler.handleError(err);
                return NEVER;
            }),
        );
    }
}
