import {Component, EventEmitter, Input, Output} from '@angular/core';
import {NgForOf, NgIf, NgOptimizedImage} from '@angular/common';
import {CriteriaDto} from '../../../../data/dto/CriteriaDto';

@Component({
    selector: 'app-modal-results',
    imports: [
        NgForOf,
        NgIf,
        NgOptimizedImage
    ],
    templateUrl: './modal-results.component.html',
    styleUrl: './styles/modal-results.component.scss'
})
export class ModalResultsComponent {

    @Input()
    public isModalOpen: boolean = false;
    @Input()
    public activeTab: 'circle' | 'behavior' | '' = 'circle';
    @Output()
    public close: EventEmitter<void> = new EventEmitter();
    @Input()
    circleCriteria: CriteriaDto[] = [];
    @Input()
    behaviorCriteria: CriteriaDto[] = [];

    protected closeModal(): void {
        this.isModalOpen = false;
        this.close.emit();
    }
}
