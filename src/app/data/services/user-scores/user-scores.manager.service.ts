import {ErrorHandler, inject, Injectable} from '@angular/core';
import {UserScoresService} from './user-scores.service';
import {catchError, NEVER, Observable} from 'rxjs';
import {UserMeanScoreDto} from '../../dto/UserMeanScoreDto';

@Injectable()
export class UserScoresManagerService {

    private readonly _userScoresService: UserScoresService = inject(UserScoresService);
    private readonly _errorHandler: ErrorHandler = inject(ErrorHandler);

    public getUserMeanScoresByForm(userId: string, byAssessment?: string): Observable<UserMeanScoreDto> {
        return this._userScoresService.getUserMeanScoresByForm(userId, byAssessment).pipe(
            catchError(err => {
                this._errorHandler.handleError(err);
                return NEVER;
            })
        );
    }

    public getTeamMeanScores(teamId: string, byAssessment?: string): Observable<UserMeanScoreDto[]> {
        return this._userScoresService.getTeamMeanScores(teamId, byAssessment).pipe(
            catchError(err => {
                this._errorHandler.handleError(err);
                return NEVER;
            })
        );
    }

    public getUsersMeanScoresByForm(formId: string, onlyWhereTutor: boolean = true): Observable<UserMeanScoreDto[]> {
        return this._userScoresService.getUsersMeanScoresByForm(formId, onlyWhereTutor).pipe(
            catchError(err => {
                this._errorHandler.handleError(err);
                return NEVER;
            })
        );
    }
}
