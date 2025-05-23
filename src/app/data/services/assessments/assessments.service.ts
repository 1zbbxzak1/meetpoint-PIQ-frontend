import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../../environments/environment';
import {IEditAssessmentRequest} from '../../models/assessments/IEditAssessment.request';
import {Observable} from 'rxjs';
import {AssessmentDto} from '../../dto/AssessmentDto';
import {FormShortDto} from '../../dto/FormShortDto';
import {AssessUserDto} from '../../dto/AssessUserDto';
import {AssessChoiceDto} from '../../dto/AssessChoiceDto';
import {AssessmentMarkDto} from '../../dto/AssessmentMarkDto';

@Injectable()
export class AssessmentsService {

    private readonly _http: HttpClient = inject(HttpClient);
    private readonly _apiUrl: string = `${environment.apiUrlPIQ}/assessments`;

    public editAssessmentById(id: string, assessment: IEditAssessmentRequest): Observable<AssessmentDto> {
        return this._http.put<AssessmentDto>(`${this._apiUrl}/${id}`, assessment);
    }

    public deleteAssessmentById(id: string): Observable<void> {
        return this._http.delete<void>(`${this._apiUrl}/${id}`);
    }

    public getUsedForms(id: string): Observable<FormShortDto[]> {
        return this._http.get<FormShortDto[]>(`${this._apiUrl}/${id}/used-forms`);
    }

    public getAssessUsers(assessmentId: string): Observable<AssessUserDto[]> {
        return this._http.get<AssessUserDto[]>(`${this._apiUrl}/${assessmentId}/assess-users`);
    }

    public getChoicesForUser(assessmentId: string, assessedUserId: string): Observable<AssessChoiceDto[]> {
        return this._http.get<AssessChoiceDto[]>(`${this._apiUrl}/${assessmentId}/assess-users/${assessedUserId}/choices`);
    }

    public assessUserWithChoices(assessmentId: string, assessedUserId: string, choices: string[]): Observable<AssessmentMarkDto[]> {
        return this._http.post<AssessmentMarkDto[]>(`${this._apiUrl}/${assessmentId}/assess-users/${assessedUserId}/assess`, choices);
    }
}
