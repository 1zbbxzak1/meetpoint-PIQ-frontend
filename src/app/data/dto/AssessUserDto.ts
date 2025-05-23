import {UserDto} from './UserDto';

export interface AssessUserDto {
    readonly user: UserDto,
    readonly assessed: boolean,
}
