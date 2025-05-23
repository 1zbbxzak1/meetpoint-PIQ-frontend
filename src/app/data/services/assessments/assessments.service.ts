import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../../environments/environment';
import {IEditAssessmentRequest} from '../../models/assessments/IEditAssessment.request';
import {Observable} from 'rxjs';
import {AssessmentDto} from '../../dto/AssessmentDto';

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
}
