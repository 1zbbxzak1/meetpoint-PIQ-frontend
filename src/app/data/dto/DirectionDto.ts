import {ProjectDto} from './ProjectDto';

export interface DirectionDto {
    readonly id: string,
    readonly name: string | null,
    readonly projects: ProjectDto[] | null,
}
