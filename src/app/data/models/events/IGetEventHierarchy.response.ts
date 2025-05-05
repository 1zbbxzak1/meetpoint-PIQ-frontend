import {EventDto} from '../../dto/EventDto';

export interface GetEventHierarchyResponse {
    readonly event: EventDto,
    readonly teamIdForEvaluation: string[] | null,
}
