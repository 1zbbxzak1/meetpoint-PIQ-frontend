import {ApplicationConfig, LOCALE_ID, provideZoneChangeDetection} from '@angular/core';
import {provideRouter} from '@angular/router';

import {routes} from './app.routes';
import {provideClientHydration, withEventReplay} from '@angular/platform-browser';
import {provideHttpClient, withInterceptors} from '@angular/common/http';
import {JwtTokenInterceptor} from './interceptors/jwt-token.interceptor';
import {AuthService} from './data/services/auth/auth.service';
import {AuthManagerService} from './data/services/auth/auth.manager.service';
import {EventsService} from './data/services/events/events.service';
import {EventsManagerService} from './data/services/events/events.manager.service';
import {AssessmentsService} from './data/services/assessments/assessments.service';
import {AssessmentsManagerService} from './data/services/assessments/assessments.manager.service';
import {TeamsService} from './data/services/teams/teams.service';
import {TeamsManagerService} from './data/services/teams/teams.manager.service';
import {UserScoresService} from './data/services/user-scores/user-scores.service';
import {UserScoresManagerService} from './data/services/user-scores/user-scores.manager.service';

export const appConfig: ApplicationConfig = {
    providers: [
        provideZoneChangeDetection({eventCoalescing: true}),
        provideRouter(routes),
        provideClientHydration(withEventReplay()),
        provideHttpClient(
            withInterceptors([JwtTokenInterceptor])
        ),
        {
            provide: LOCALE_ID,
            useValue: 'ru'
        },

        AuthService,
        AuthManagerService,

        EventsService,
        EventsManagerService,

        AssessmentsService,
        AssessmentsManagerService,

        TeamsService,
        TeamsManagerService,

        UserScoresService,
        UserScoresManagerService,
    ]
};
