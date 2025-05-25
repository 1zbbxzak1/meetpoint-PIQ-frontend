import {Component, DestroyRef, inject} from '@angular/core';
import {NavigationEnd, Router, RouterLink, RouterLinkActive} from '@angular/router';
import {filter} from 'rxjs';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {AuthManagerService} from '../../../../data/services/auth/auth.manager.service';
import {jwtDecode} from 'jwt-decode';

@Component({
    selector: 'app-student-header',
    imports: [
        RouterLink,
        RouterLinkActive
    ],
    templateUrl: './student-header.component.html',
    styleUrl: '../../components/header/styles/header.component.scss'
})
export class StudentHeaderComponent {
    protected statesHeader: Record<string, boolean> = {
        isTeams: false,
        isResults: false
    };

    protected userId: string | null = '';

    private readonly _router: Router = inject(Router);
    private readonly _destroyRef: DestroyRef = inject(DestroyRef);
    private readonly _authManager: AuthManagerService = inject(AuthManagerService);

    constructor() {
        this.initStatesHeader();

        this._router.events.pipe(
            filter((event) => event instanceof NavigationEnd),
            takeUntilDestroyed(this._destroyRef)
        ).subscribe((): void => {
            this.initStatesHeader();
        });

        this.userId = this.getUserIdFromToken();
    }

    protected redirectToResults(): void {
        this._router.navigate(['results', this.userId]);

        console.log('click');
    }

    private getUserIdFromToken(): string | null {
        const token: string | null = this._authManager.getAccessToken();
        if (!token) {
            return null;
        }

        try {
            const decoded: any = jwtDecode(token);
            return decoded.sid || null;
        } catch {
            return null;
        }
    }

    private initStatesHeader(): void {
        const url: string = this._router.url;
        this.resetStates(this.statesHeader);

        if (url.includes('/student-team')) {
            this.statesHeader['isTeams'] = true;
        } else if (url.includes('/results')) {
            this.statesHeader['isResults'] = true;
        }
    }

    private resetStates(state: Record<string, boolean>): void {
        for (const key in state) {
            if (Object.prototype.hasOwnProperty.call(state, key)) {
                state[key] = false;
            }
        }
    }
}
