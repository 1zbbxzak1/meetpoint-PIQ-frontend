export interface AssessmentMarkDto {
    readonly id: string,
    readonly assessorId: string,
    readonly assessedId: string,
    readonly assessmentId: string,
    readonly choices: string[] | null,
}
