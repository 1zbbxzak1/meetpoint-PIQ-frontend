import {Routes} from '@angular/router';
import {TeamsComponent} from './children/dashboard/pages/teams/teams.component';
import {AuthComponent} from './children/auth/auth.component';
import {ResultsComponent} from './children/dashboard/pages/results/results.component';
import {TeamComponent} from './children/dashboard/pages/teams/children/team/team.component';
import {
    FormAssessmentComponent
} from './children/dashboard/pages/teams/children/form-assessment/form-assessment.component';
import {AdminTutorGuard} from './data/guard/admin.tutor.guard';
import {RedirectAuthGuard} from './data/guard/redirect-auth.guard';
import {MemberGuard} from './data/guard/member.guard';

export const routes: Routes = [
    {
        path: '',
        component: AuthComponent,
        canActivate: [RedirectAuthGuard],
    },
    {
        path: 'teams',
        component: TeamsComponent,
        canActivate: [AdminTutorGuard],
    },
    {
        path: 'teams/team/:id',
        component: TeamComponent,
        canActivate: [AdminTutorGuard],
    },
    {
        path: 'teams/team/:id/assessment/:assessmentId',
        component: FormAssessmentComponent,
        canActivate: [AdminTutorGuard],
    },
    {
        path: 'results',
        component: ResultsComponent,
        canActivate: [AdminTutorGuard],
    },
    },
];
