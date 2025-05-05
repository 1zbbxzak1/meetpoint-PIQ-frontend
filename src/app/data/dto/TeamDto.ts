import {UserDto} from './UserDto';

export interface TeamDto {
    readonly id: string,
    readonly name: string | null,
    readonly tutor: UserDto,
    readonly members: UserDto[] | null,
}
