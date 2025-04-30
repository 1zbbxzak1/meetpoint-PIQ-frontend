import {Inject, Injectable, PLATFORM_ID} from '@angular/core';
import {isPlatformBrowser} from '@angular/common';

const STORAGE_KEY = 'createdAssessments';

@Injectable()
export class AssessmentService {

    private _isBrowser: boolean;

    constructor(@Inject(PLATFORM_ID) platformId: Object) {
        this._isBrowser = isPlatformBrowser(platformId);

        if (this._isBrowser) {
            const stored = localStorage.getItem(STORAGE_KEY);
            this._createdAssessments = stored ? JSON.parse(stored) : [];
        }
    }

    private _createdAssessments: any[] = [];

    public get createdAssessments(): any[] {
        return this._createdAssessments;
    }

    public addAssessment(assessment: any): void {
        this._createdAssessments.push(assessment);
        this.saveToStorage();
    }

    public updateAssessment(updatedAssessment: any): void {
        const index = this._createdAssessments.findIndex(a => a.id === updatedAssessment.id);
        if (index > -1) {
            this._createdAssessments[index] = updatedAssessment;
            this.saveToStorage();
        }
    }

    public getAssessmentsForTeam(teamName: string): any[] {
        return this._createdAssessments.filter(a => a.teams.includes(teamName));
    }

    private saveToStorage(): void {
        if (this._isBrowser) {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(this._createdAssessments));
        }
    }
}
