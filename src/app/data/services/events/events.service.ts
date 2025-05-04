import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../../environments/environment';
import {Observable} from 'rxjs';
import {GetEventWithIncludesResponse} from '../../models/events/IEvents.response';

@Injectable()
export class EventsService {

    private readonly _http: HttpClient = inject(HttpClient);
    private readonly _apiUrl: string = `${environment.apiUrlPIQ}/events/current`;

    public getCurrent(): Observable<GetEventWithIncludesResponse> {
        return this._http.get<GetEventWithIncludesResponse>(`${this._apiUrl}`);
    }
}
