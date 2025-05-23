import {ChoiceShortDto} from './ChoiceShortDto';

export interface QuestionShortDto {
    readonly id: string,
    readonly text: string | null,
    readonly criteriaId: string,
    readonly choices: ChoiceShortDto[] | null,
}
