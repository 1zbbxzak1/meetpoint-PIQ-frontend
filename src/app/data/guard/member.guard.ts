import {ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot} from '@angular/router';
import {Observable, of} from 'rxjs';
import {inject} from '@angular/core';
import {AuthManagerService} from '../services/auth/auth.manager.service';

export const MemberGuard: CanActivateFn = (
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

    if (!roles?.includes('Member')) {
        router.navigate(['/']);
        return of(false);
    }

    return of(true);
};
