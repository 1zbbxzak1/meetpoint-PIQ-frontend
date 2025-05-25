import {Component, Input} from '@angular/core';
import {NgIf} from '@angular/common';

@Component({
    selector: 'app-loading',
    imports: [
        NgIf
    ],
    templateUrl: './loading.component.html',
    styleUrl: './styles/loading.component.scss'
})
export class LoadingComponent {
    @Input()
    public isLoading: boolean = false;
}
