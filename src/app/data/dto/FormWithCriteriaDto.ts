import {CriteriaDto} from './CriteriaDto';

export interface FormWithCriteriaDto {
    readonly id: string,
    readonly type: number,
    readonly criteriaList: CriteriaDto[] | null,
}
