import {inject} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot} from '@angular/router';
import {Observable, of} from 'rxjs';
import {AuthManagerService} from '../services/auth/auth.manager.service';


export const AdminTutorGuard: CanActivateFn = (
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
): Observable<boolean> => {
    const router: Router = inject(Router);
    const authManager: AuthManagerService = inject(AuthManagerService);

    const isAuthorized: string | null = authManager.getAccessToken();
    const roles: string[] | null = authManager.getUserRoles();

    if (!isAuthorized) {
        router.navigate(['/']);
        return of(false);
    }

    const allowedRoles: string[] = ['Admin', 'Tutor'];
    const hasAccess: boolean | undefined = roles?.some((role: string): boolean => allowedRoles.includes(role));

    if (!hasAccess) {
        router.navigate(['/']);
        return of(false);
    }

    return of(true);
};
