import {HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {inject, Injectable} from '@angular/core';
import {catchError, Observable, throwError} from 'rxjs';
import {AuthManagerService} from '../data/services/auth/auth.manager.service';

@Injectable()
export class JwtTokenInterceptor implements HttpInterceptor {
    private readonly _authManagerService: AuthManagerService = inject(AuthManagerService);

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const accessToken: string | null = this._authManagerService.getAccessToken();

        const authReq: HttpRequest<any> = accessToken
            ? req.clone({headers: req.headers.set('Authorization', `Bearer ${accessToken}`)})
            : req;

        return next.handle(authReq).pipe(
            catchError((error: HttpErrorResponse) => {
                if (error.status === 401) {
                    this._authManagerService.logout();
                }
                return throwError(() => new Error(error.message));
            })
        );
    }
}
