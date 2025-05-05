import {EventDto} from '../../dto/EventDto';

export interface GetEventWithIncludesResponse {
    readonly event: EventDto,
    readonly teamIdForEvaluation: string[] | null,
}
