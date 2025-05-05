import {DirectionDto} from './DirectionDto';

export interface EventDto {
    readonly id: string,
    readonly name: string | null,
    readonly startDate: string,
    readonly endDate: string,
    readonly directions: DirectionDto[] | null,
}
