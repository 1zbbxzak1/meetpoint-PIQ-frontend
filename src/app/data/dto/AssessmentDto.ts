export interface AssessmentDto {
    readonly id: string,
    readonly name: string | null,
    readonly startDate: string,
    readonly endDate: string,
    readonly useCircleAssessment: boolean,
    readonly useBehaviorAssessment: boolean,
}
