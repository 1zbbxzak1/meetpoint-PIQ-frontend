import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {IAuthRequest} from '../../model/request/auth/IAuth.request';
import {Observable} from 'rxjs';
import {IAuthResponse} from '../../model/response/auth/IAuth.response';
import {environment} from '../../../../environments/environment';

@Injectable()
export class AuthService {

    private readonly _http: HttpClient = inject(HttpClient);
    private readonly _apiUrl: string = `${environment.apiUrlAccount}/auth/login`;

    public loginUser(user: IAuthRequest): Observable<IAuthResponse> {
        return this._http.post<IAuthResponse>(`${this._apiUrl}`, user)
    }
}
