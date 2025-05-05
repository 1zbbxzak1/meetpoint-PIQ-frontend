import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../../environments/environment';
import {Observable} from 'rxjs';
import {AssessmentDto} from '../../dto/AssessmentDto';
import {ICreateTeamAssessmentRequest} from '../../models/teams/ICreateTeamAssessment.request';

@Injectable()
export class TeamsService {

    private readonly _http: HttpClient = inject(HttpClient);
    private readonly _apiUrl: string = `${environment.apiUrlPIQ}/teams`;

    public getTeamAssessment(id: string): Observable<AssessmentDto[]> {
        return this._http.get<AssessmentDto[]>(`${this._apiUrl}/${id}/assessments`);
    }

    public createTeamAssessment(id: string, assessment: ICreateTeamAssessmentRequest): Observable<AssessmentDto> {
        return this._http.post<AssessmentDto>(`${this._apiUrl}/${id}/assessments`, assessment);
    }
}
