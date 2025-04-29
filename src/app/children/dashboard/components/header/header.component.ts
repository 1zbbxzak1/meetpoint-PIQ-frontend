import {Component, DestroyRef, inject} from '@angular/core';
import {NavigationEnd, Router, RouterLink, RouterLinkActive} from '@angular/router';
import {filter} from 'rxjs';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';

@Component({
    selector: 'app-header',
    imports: [
        RouterLinkActive,
        RouterLink
    ],
    templateUrl: './header.component.html',
    styleUrl: './styles/header.component.scss'
})
export class HeaderComponent {
    protected statesHeader: Record<string, boolean> = {
        isTeams: false,
        isResults: false
    };
    private readonly _router: Router = inject(Router);
    private readonly _destroyRef: DestroyRef = inject(DestroyRef);

    constructor() {
        this.initStatesHeader();

        this._router.events.pipe(
            filter((event) => event instanceof NavigationEnd),
            takeUntilDestroyed(this._destroyRef)
        ).subscribe((): void => {
            this.initStatesHeader();
        });
    }

    private initStatesHeader(): void {
        const url: string = this._router.url;
        this.resetStates(this.statesHeader);

        if (url.includes('/teams')) {
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
