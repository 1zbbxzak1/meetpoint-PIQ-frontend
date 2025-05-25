import {inject, Injectable} from '@angular/core';
import {AuthService} from './auth.service';
import {Router} from '@angular/router';
import {CookieService} from 'ngx-cookie-service';
import {IAuthRequest} from '../../models/auth/IAuth.request';
import {catchError, map, Observable, throwError} from 'rxjs';
import {environment} from '../../../../environments/environment';
import {HttpErrorResponse} from '@angular/common/http';
import {jwtDecode} from 'jwt-decode';
import {IAuthResponse} from '../../models/auth/IAuth.response';

@Injectable()
export class AuthManagerService {

    private readonly _authService: AuthService = inject(AuthService);
    private readonly _router: Router = inject(Router);
    private readonly _cookieService: CookieService = inject(CookieService);

    public loginUser(user: IAuthRequest): Observable<boolean> {
        this.removeAccessToken();

        return this._authService.loginUser(user).pipe(
            map((user: IAuthResponse): boolean => {
                this.setAccessToken(user.token);
                return true;
            }),
            catchError(err => this.handleLoginError(err))
        );
    }

    public logout(): void {
        this.removeAccessToken();
        this._router.navigate(['/']);
    }

    public getUserRoles(): string[] | null {
        const token = this.getAccessToken();

        if (token) {
            const decoded: any = jwtDecode(token);
            const rawRoles = decoded?.['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'];
            if (!rawRoles) return null;
            return Array.isArray(rawRoles) ? rawRoles : [rawRoles];
        }

        return null;
    }


    public getAccessToken(): string | null {
        const accessToken: string = this._cookieService.get(environment.TOKEN_NAME);
        if (accessToken && this.isTokenExpired(accessToken)) {
            this.logout();
            return null;
        }
        return accessToken || null;
    }

    private isTokenExpired(token: string): boolean {
        try {
            const decoded: any = jwtDecode(token);
            const currentTime: number = Math.floor(Date.now() / 1000);
            return decoded.exp && currentTime >= decoded.exp;
        } catch {
            return true;
        }
    }

    private handleLoginError(err: HttpErrorResponse): Observable<never> {
        const errorMessage: string = this.getErrorMessage(err);
        return throwError((): Error => new Error(errorMessage));
    }

    private getErrorMessage(err: HttpErrorResponse): string {
        if (err.status === 404) {
            return "Ошибка. Неправильный логин и/или пароль.";
        }
        if (err.status === 500) {
            return "Внутренняя ошибка сервера. Пожалуйста, попробуйте позже.";
        }

        return "Произошла ошибка. Попробуйте еще раз.";
    }

    private setAccessToken(token: string): void {
        this._cookieService.set(environment.TOKEN_NAME, token, {expires: 1, path: '/'});
    }

    private removeAccessToken(): void {
        this._cookieService.delete(environment.TOKEN_NAME, '/');
    }
}
