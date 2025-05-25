export interface UserMeanScoreDto {
    readonly userId: string,
    readonly fullName: string,
    readonly teamId: string,
    readonly teamName: string,
    readonly scoreByCriteriaIds: { [criteriaId: string]: number };
}
