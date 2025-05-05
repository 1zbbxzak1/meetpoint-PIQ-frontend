import {ErrorHandler, inject, Injectable} from '@angular/core';
import {catchError, NEVER, Observable} from 'rxjs';
import {GetEventWithIncludesResponse} from '../../models/events/IEvents.response';
import {EventsService} from './events.service';
import {ICreateTeamsAssessmentRequest} from '../../models/events/ICreateTeamsAssessment.request';
import {AssessmentDto} from '../../dto/AssessmentDto';

@Injectable()
export class EventsManagerService {

    private readonly _eventsService: EventsService = inject(EventsService);
    private readonly _errorHandler: ErrorHandler = inject(ErrorHandler);

    public getCurrent(): Observable<GetEventWithIncludesResponse> {
        return this._eventsService.getCurrent().pipe(
            catchError((err) => {
                this._errorHandler.handleError(err);
                return NEVER;
            })
        );
    }

    public createAssessment(assessment: ICreateTeamsAssessmentRequest): Observable<AssessmentDto> {
        return this._eventsService.createAssessment(assessment).pipe(
            catchError((err) => {
                this._errorHandler.handleError(err);
                return NEVER;
            }),
        );
    }
}
