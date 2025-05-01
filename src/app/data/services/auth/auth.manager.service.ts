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
        this.removeLoginTimestamp();

        return this._authService.loginUser(user).pipe(
            map((user: IAuthResponse): boolean => {
                this.setAccessToken(user.token);
                this.setLoginTimestamp(Date.now());
                this.startTokenExpirationCheck();

                return true;
            }),
            catchError(err => {
                return this.handleLoginError(err);
            })
        );
    }

    public logout(): void {
        this.removeAccessToken();
        this.removeLoginTimestamp();
        this._router.navigate(['/']);
    }

    public getUserRoles(): string[] | null {
        const token = this.getAccessToken();
        if (token) {
            const decoded: any = jwtDecode(token);
            return decoded?.['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] || null;
        }
        return null;
    }


    public getAccessToken(): string | null {
        const accessToken: string = this._cookieService.get(environment.TOKEN_NAME);
        if (accessToken && this.isTokenExpired()) {
            this.logout();
            return null;
        }
        return accessToken || null;
    }

    private isTokenExpired(): boolean {
        const loginTimestamp: number | null = this.getLoginTimestamp();
        if (!loginTimestamp) return true;
        const currentTime: number = Date.now();
        return currentTime - loginTimestamp > environment.TOKEN_LIFESPAN;
    }

    private startTokenExpirationCheck(): void {
        const timeRemaining: number = environment.TOKEN_LIFESPAN - (Date.now() - (this.getLoginTimestamp() || 0));
        setTimeout((): void => {
            if (this.isTokenExpired()) {
                this.logout();
                alert("Ваша сессия истекла. Пожалуйста, войдите снова.");
            }
        }, timeRemaining);
    }

    private handleLoginError(err: HttpErrorResponse): Observable<never> {
        const errorMessage: string = this.getErrorMessage(err);
        return throwError((): Error => new Error(errorMessage));
    }

    private getErrorMessage(err: HttpErrorResponse): string {
        if (err.status === 404) {
            return "Ошибка. Неправильный логин и/или пароль.";
        }

        // Дополнительная обработка других статусов
        if (err.status === 500) {
            return "Внутренняя ошибка сервера. Пожалуйста, попробуйте позже.";
        }

        return "Произошла ошибка. Попробуйте еще раз.";
    }

    private setAccessToken(token: string): void {
        this._cookieService.set(environment.TOKEN_NAME, token, {expires: 1, path: '/'});
    }

    private removeAccessToken(): void {
        this._cookieService.delete(environment.TOKEN_NAME, '/', window.location.hostname);
    }

    private getLoginTimestamp(): number | null {
        const timestamp: string = this._cookieService.get(environment.LOGIN_TIMESTAMP_NAME);
        return timestamp ? parseInt(timestamp, 10) : null;
    }

    private setLoginTimestamp(timestamp: number): void {
        this._cookieService.set(environment.LOGIN_TIMESTAMP_NAME, timestamp.toString(), {expires: 1, path: '/'});
    }

    private removeLoginTimestamp(): void {
        this._cookieService.delete(environment.LOGIN_TIMESTAMP_NAME, '/', window.location.hostname);
    }
}
