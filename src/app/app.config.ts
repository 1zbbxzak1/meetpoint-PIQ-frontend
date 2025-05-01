import {ApplicationConfig, LOCALE_ID, provideZoneChangeDetection} from '@angular/core';
import {provideRouter} from '@angular/router';

import {routes} from './app.routes';
import {provideClientHydration, withEventReplay} from '@angular/platform-browser';
import {HTTP_INTERCEPTORS, provideHttpClient} from '@angular/common/http';
import {JwtTokenInterceptor} from './interceptors/jwt-token.interceptor';
import {AuthService} from './data/services/auth/auth.service';
import {AuthManagerService} from './data/services/auth/auth.manager.service';
import {EventsService} from './data/services/events/events.service';
import {EventsManagerService} from './data/services/events/events.manager.service';
import {AssessmentService} from './children/dashboard/pages/teams/services/assessment.service';

export const appConfig: ApplicationConfig = {
    providers: [
        provideZoneChangeDetection({eventCoalescing: true}),
        provideRouter(routes),
        provideClientHydration(withEventReplay()),
        provideHttpClient(),
        {
            provide: HTTP_INTERCEPTORS,
            useClass: JwtTokenInterceptor,
            multi: true
        },
        {
            provide: LOCALE_ID,
            useValue: 'ru'
        },

        AuthService,
        AuthManagerService,

        EventsService,
        EventsManagerService,

        AssessmentService
    ]
};
