import {CanActivateFn, Router} from '@angular/router';
import {Observable, of} from 'rxjs';
import {inject} from '@angular/core';
import {AuthManagerService} from '../services/auth/auth.manager.service';

export const RedirectAuthGuard: CanActivateFn = (): Observable<boolean> => {
    const router: Router = inject(Router);
    const authManager: AuthManagerService = inject(AuthManagerService);

    const isAuthorized: string | null = authManager.getAccessToken();
    const roles: string[] | null = authManager.getUserRoles();

    if (isAuthorized) {
        const redirectPath = roles?.includes('Member') ? 'student-team' : 'teams';
        router.navigate([`/${redirectPath}`]);
        return of(false);
    }

    return of(true);
};
