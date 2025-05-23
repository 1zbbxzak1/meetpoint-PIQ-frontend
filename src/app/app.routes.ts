import {Routes} from '@angular/router';
import {TeamsComponent} from './children/dashboard/pages/teams/teams.component';
import {AuthComponent} from './children/auth/auth.component';
import {ResultsComponent} from './children/dashboard/pages/results/results.component';
import {TeamComponent} from './children/dashboard/pages/teams/children/team/team.component';
import {
    FormAssessmentComponent
} from './children/dashboard/pages/teams/children/form-assessment/form-assessment.component';

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
        path: 'teams/team/:id',
        component: TeamComponent,
    },
    {
        path: 'teams/team/:id/assessment/:assessmentId',
        component: FormAssessmentComponent,
    },
    {
        path: 'results',
        component: ResultsComponent,
    },
];
