import {ErrorHandler, inject, Injectable} from '@angular/core';
import {TeamsService} from './teams.service';
import {catchError, NEVER, Observable} from 'rxjs';
import {AssessmentDto} from '../../dto/AssessmentDto';
import {ICreateTeamAssessmentRequest} from '../../models/teams/ICreateTeamAssessment.request';

@Injectable()
export class TeamsManagerService {

    private readonly _teamsService: TeamsService = inject(TeamsService);
    private readonly _errorHandler: ErrorHandler = inject(ErrorHandler);

    public getTeamAssessment(id: string): Observable<AssessmentDto[]> {
        return this._teamsService.getTeamAssessment(id).pipe(
            catchError(err => {
                this._errorHandler.handleError(err);
                return NEVER;
            }),
        );
    }

    public createTeamAssessment(id: string, assessment: ICreateTeamAssessmentRequest): Observable<AssessmentDto> {
        return this._teamsService.createTeamAssessment(id, assessment).pipe(
            catchError(err => {
                this._errorHandler.handleError(err);
                return NEVER;
            }),
        );
    }
}
