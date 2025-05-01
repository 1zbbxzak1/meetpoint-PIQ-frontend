import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {IAuthRequest} from '../../models/auth/IAuth.request';
import {Observable} from 'rxjs';
import {IAuthResponse} from '../../models/auth/IAuth.response';
import {environment} from '../../../../environments/environment';

@Injectable()
export class AuthService {

    private readonly _http: HttpClient = inject(HttpClient);
    private readonly _apiUrl: string = `${environment.apiUrlAccount}/auth/login`;

    public loginUser(user: IAuthRequest): Observable<IAuthResponse> {
        return this._http.post<IAuthResponse>(`${this._apiUrl}`, user)
    }
}
