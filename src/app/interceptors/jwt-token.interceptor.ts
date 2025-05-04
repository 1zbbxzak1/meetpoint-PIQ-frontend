import {HttpErrorResponse, HttpEvent, HttpHandlerFn, HttpInterceptorFn, HttpRequest} from '@angular/common/http';
import {inject} from '@angular/core';
import {catchError, Observable, throwError} from 'rxjs';
import {AuthManagerService} from '../data/services/auth/auth.manager.service';

export const JwtTokenInterceptor: HttpInterceptorFn = (req: HttpRequest<any>, next: HttpHandlerFn): Observable<HttpEvent<any>> => {
    const authManagerService: AuthManagerService = inject(AuthManagerService);
    const accessToken: string | null = authManagerService.getAccessToken();

    const authReq = accessToken
        ? req.clone({
            setHeaders: {
                Authorization: `Bearer ${accessToken}`
            }
        })
        : req;

    return next(authReq).pipe(
        catchError((error: HttpErrorResponse): Observable<never> => {
            if (error.status === 401) {
                authManagerService.logout();
            }
            return throwError(() => new Error(error.message));
        })
    );
}
