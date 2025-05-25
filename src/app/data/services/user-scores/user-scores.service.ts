import {inject, Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {environment} from '../../../../environments/environment';
import {Observable} from 'rxjs';
import {UserMeanScoreDto} from '../../dto/UserMeanScoreDto';

@Injectable()
export class UserScoresService {

    private readonly _http: HttpClient = inject(HttpClient);
    private readonly _apiUrl: string = `${environment.apiUrlPIQ}/user-scores`;

    public getUserMeanScoresByForm(userId: string, byAssessment?: string): Observable<UserMeanScoreDto> {
        let params: HttpParams = new HttpParams();
        if (byAssessment) {
            params = params.set('byAssessment', byAssessment);
        }
        return this._http.get<UserMeanScoreDto>(`${this._apiUrl}/${userId}/criteria-mean`, {params});
    }

    public getTeamMeanScores(teamId: string, byAssessment?: string): Observable<UserMeanScoreDto[]> {
        let params: HttpParams = new HttpParams();
        if (byAssessment) {
            params = params.set('byAssessment', byAssessment);
        }
        return this._http.get<UserMeanScoreDto[]>(`${this._apiUrl}/teams/${teamId}/criteria-mean`, {params});
    }

    public getUsersMeanScoresByForm(formId: string, onlyWhereTutor: boolean = true): Observable<UserMeanScoreDto[]> {
        const params: HttpParams = new HttpParams().set('onlyWhereTutor', onlyWhereTutor.toString());
        return this._http.get<UserMeanScoreDto[]>(`${this._apiUrl}/forms/${formId}/criteria-mean`, {params});
    }
}
