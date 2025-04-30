export interface UserDto {
    readonly id: string,
    readonly fullName: string | null,
}

export interface TeamDto {
    readonly id: string,
    readonly name: string | null,
    readonly tutor: UserDto,
    readonly members: UserDto[] | null,
}

export interface ProjectDto {
    readonly id: string,
    readonly name: string | null,
    readonly teams: TeamDto[] | null,
}

export interface DirectionDto {
    readonly id: string,
    readonly name: string | null,
    readonly projects: ProjectDto[] | null,
}

export interface EventDto {
    readonly id: string,
    readonly name: string | null,
    readonly startDate: string,
    readonly endDate: string,
    readonly directions: DirectionDto[] | null,
}

export interface GetEventWithIncludesResponse {
    readonly event: EventDto,
    readonly teamIdForEvaluation: string[] | null,
}
