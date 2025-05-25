import {ErrorHandler, inject, Injectable} from '@angular/core';
import {catchError, NEVER, Observable} from 'rxjs';
import {FormWithCriteriaDto} from '../../dto/FormWithCriteriaDto';
import {TemplatesCriteriaService} from './templates-criteria.service';

@Injectable()
export class TemplatesCriteriaManagerService {

    private readonly _templatesCriteriaService: TemplatesCriteriaService = inject(TemplatesCriteriaService);
    private readonly _errorHandler: ErrorHandler = inject(ErrorHandler);

    public getFormsWithCriteria(): Observable<FormWithCriteriaDto[]> {
        return this._templatesCriteriaService.getFormsWithCriteria().pipe(
            catchError((err) => {
                this._errorHandler.handleError(err);
                return NEVER;
            })
        );
    }
}
