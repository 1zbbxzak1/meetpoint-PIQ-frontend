export interface IEditAssessmentRequest {
    readonly name: string | null,
    readonly startDate: string | null,
    readonly endDate: string | null,
    readonly useCircleAssessment: boolean | null,
    readonly useBehaviorAssessment: boolean | null,
}
