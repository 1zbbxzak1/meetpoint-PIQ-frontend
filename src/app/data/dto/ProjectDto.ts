import {TeamDto} from './TeamDto';

export interface ProjectDto {
    readonly id: string,
    readonly name: string | null,
    readonly teams: TeamDto[] | null,
}
