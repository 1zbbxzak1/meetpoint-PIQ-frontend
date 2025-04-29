import {Routes} from '@angular/router';
import {TeamsComponent} from './children/dashboard/teams/teams.component';
import {AuthComponent} from './children/auth/auth.component';
import {ResultsComponent} from './children/dashboard/results/results.component';

export const routes: Routes = [
    {
        path: '',
        component: AuthComponent,
    },
    {
        path: 'teams',
        component: TeamsComponent,
    },
    {
        path: 'results',
        component: ResultsComponent,
    },
];
