import {CriteriaDto} from './CriteriaDto';
import {QuestionShortDto} from './QuestionShortDto';

export interface FormShortDto {
    readonly id: string,
    readonly type: number,
    readonly criteriaList: CriteriaDto[] | null,
    readonly questions: QuestionShortDto[] | null,
}
