import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../../environments/environment';
import {Observable} from 'rxjs';
import {GetEventHierarchyResponse} from '../../models/events/IGetEventHierarchy.response';
import {ICreateTeamsAssessmentRequest} from '../../models/events/ICreateTeamsAssessment.request';
import {AssessmentDto} from '../../dto/AssessmentDto';

@Injectable()
export class EventsService {

    private readonly _http: HttpClient = inject(HttpClient);
    private readonly _apiUrl: string = `${environment.apiUrlPIQ}/events`;

    public getCurrent(): Observable<GetEventHierarchyResponse> {
        return this._http.get<GetEventHierarchyResponse>(`${this._apiUrl}/current`);
    }

    public createAssessment(assessment: ICreateTeamsAssessmentRequest): Observable<AssessmentDto> {
        return this._http.post<AssessmentDto>(`${this._apiUrl}/assessments`, assessment);
    }
}
