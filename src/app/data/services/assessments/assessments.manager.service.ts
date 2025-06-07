import {ErrorHandler, inject, Injectable} from '@angular/core';
import {AssessmentsService} from './assessments.service';
import {IEditAssessmentRequest} from '../../models/assessments/IEditAssessment.request';
import {catchError, NEVER, Observable} from 'rxjs';
import {AssessmentDto} from '../../dto/AssessmentDto';
import {FormShortDto} from '../../dto/FormShortDto';
import {AssessUserDto} from '../../dto/AssessUserDto';
import {AssessChoiceDto} from '../../dto/AssessChoiceDto';
import {AssessmentMarkDto} from '../../dto/AssessmentMarkDto';

@Injectable()
export class AssessmentsManagerService {

    private readonly _assessmentsService: AssessmentsService = inject(AssessmentsService);
    private readonly _errorHandler: ErrorHandler = inject(ErrorHandler);

    public getAssessmentById(id: string): Observable<AssessmentDto> {
        return this._assessmentsService.getAssessmentById(id).pipe(
            catchError(err => {
                this._errorHandler.handleError(err);
                return NEVER;
            }),
        );

    }

    public editAssessmentById(id: string, assessment: IEditAssessmentRequest): Observable<AssessmentDto> {
        return this._assessmentsService.editAssessmentById(id, assessment).pipe(
            catchError(err => {
                this._errorHandler.handleError(err);
                return NEVER;
            }),
        );
    }

    public deleteAssessmentById(id: string): Observable<void> {
        return this._assessmentsService.deleteAssessmentById(id).pipe(
            catchError(err => {
                this._errorHandler.handleError(err);
                return NEVER;
            }),
        );
    }

    public getUsedForms(id: string): Observable<FormShortDto[]> {
        return this._assessmentsService.getUsedForms(id).pipe(
            catchError(err => {
                this._errorHandler.handleError(err);
                return NEVER;
            }),
        );
    }

    public getAssessUsers(assessmentId: string): Observable<AssessUserDto[]> {
        return this._assessmentsService.getAssessUsers(assessmentId).pipe(
            catchError(err => {
                this._errorHandler.handleError(err);
                return NEVER;
            }),
        );
    }

    public getChoicesForUser(assessmentId: string, assessedUserId: string): Observable<AssessChoiceDto[]> {
        return this._assessmentsService.getChoicesForUser(assessmentId, assessedUserId).pipe(
            catchError(err => {
                this._errorHandler.handleError(err);
                return NEVER;
            }),
        );
    }

    public assessUserWithChoices(assessmentId: string, assessedUserId: string, choices: string[]): Observable<AssessmentMarkDto[]> {
        return this._assessmentsService.assessUserWithChoices(assessmentId, assessedUserId, choices).pipe(
            catchError(err => {
                this._errorHandler.handleError(err);
                return NEVER;
            }),
        );
    }
}
