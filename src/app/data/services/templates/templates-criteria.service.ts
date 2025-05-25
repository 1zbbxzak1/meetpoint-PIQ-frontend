import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../../environments/environment';
import {Observable} from 'rxjs';
import {FormWithCriteriaDto} from '../../dto/FormWithCriteriaDto';

@Injectable()
export class TemplatesCriteriaService {

    private readonly _http: HttpClient = inject(HttpClient);
    private readonly _apiUrl: string = `${environment.apiUrlPIQ}/templates/current/forms-with-criteria`;

    public getFormsWithCriteria(): Observable<FormWithCriteriaDto[]> {
        return this._http.get<FormWithCriteriaDto[]>(`${this._apiUrl}`);
    }
}
