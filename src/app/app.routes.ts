import {Routes} from '@angular/router';
import {TeamsComponent} from './children/dashboard/teams/teams.component';
import {AuthComponent} from './children/auth/auth.component';
import {ResultsComponent} from './children/dashboard/results/results.component';
import {TeamComponent} from './children/dashboard/teams/children/team/team.component';

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
        path: 'teams/:id',
        component: TeamComponent,
    },
    {
        path: 'results',
        component: ResultsComponent,
    },
];
