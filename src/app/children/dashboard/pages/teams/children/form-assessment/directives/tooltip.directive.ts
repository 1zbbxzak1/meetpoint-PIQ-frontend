import {Directive, ElementRef, Input, OnDestroy, Renderer2} from '@angular/core';

@Directive({
    selector: '[appTooltip]',
    standalone: true
})
export class TooltipDirective implements OnDestroy {
    @Input() tooltipText: string = '';
    @Input() tooltipWidth: string = '180px';
    @Input() tooltipDelay: number = 400;

    private tooltipElement: HTMLElement | null = null;
    private tooltipArrow: HTMLElement | null = null;
    private showTimeout: any;

    constructor(
        private el: ElementRef,
        private renderer: Renderer2
    ) {
        this.initialize();
    }

    ngOnDestroy(): void {
        if (this.showTimeout) {
            clearTimeout(this.showTimeout);
        }
        this.hide();
    }

    private initialize(): void {
        this.renderer.listen(this.el.nativeElement, 'mouseenter', () => {
            this.showTimeout = setTimeout(() => {
                this.show();
            }, this.tooltipDelay);
        });

        this.renderer.listen(this.el.nativeElement, 'mouseleave', () => {
            if (this.showTimeout) {
                clearTimeout(this.showTimeout);
            }
            this.hide();
        });

        this.renderer.listen('window', 'scroll', () => {
            if (this.tooltipElement) {
                this.updatePosition();
            }
        });
    }

    private show(): void {
        if (this.tooltipElement) {
            return;
        }

        this.tooltipElement = this.renderer.createElement('div');
        this.renderer.addClass(this.tooltipElement, 'custom-tooltip');

        const tooltipContent = this.renderer.createElement('div');
        this.renderer.addClass(tooltipContent, 'tooltip-content');
        this.renderer.setStyle(tooltipContent, 'width', this.tooltipWidth);
        const text = this.renderer.createText(this.tooltipText);
        this.renderer.appendChild(tooltipContent, text);

        this.tooltipArrow = this.renderer.createElement('div');
        this.renderer.addClass(this.tooltipArrow, 'tooltip-arrow');

        this.renderer.appendChild(this.tooltipElement, tooltipContent);
        this.renderer.appendChild(this.tooltipElement, this.tooltipArrow);
        this.renderer.appendChild(document.body, this.tooltipElement);

        this.updatePosition();
    }

    private updatePosition(): void {
        if (!this.tooltipElement || !this.tooltipArrow) return;

        const hostRect = this.el.nativeElement.getBoundingClientRect();
        const tooltipRect = this.tooltipElement.getBoundingClientRect();
        const viewportHeight = window.innerHeight;

        let left = hostRect.left + (hostRect.width - tooltipRect.width) / 2;

        if (left < 0) {
            left = 0;
        } else if (left + tooltipRect.width > window.innerWidth) {
            left = window.innerWidth - tooltipRect.width;
        }

        let top: number;
        const spaceAbove = hostRect.top;
        const spaceBelow = viewportHeight - hostRect.bottom;

        if (spaceAbove >= tooltipRect.height + 10) {
            top = hostRect.top - tooltipRect.height - 10;
            this.renderer.removeClass(this.tooltipElement, 'bottom');
            this.renderer.addClass(this.tooltipElement, 'top');
            this.renderer.removeStyle(this.tooltipArrow, 'order');
        } else if (spaceBelow >= tooltipRect.height + 10) {
            top = hostRect.bottom + 10;
            this.renderer.removeClass(this.tooltipElement, 'top');
            this.renderer.addClass(this.tooltipElement, 'bottom');
            this.renderer.setStyle(this.tooltipArrow, 'order', '-1');
        } else {
            if (spaceAbove > spaceBelow) {
                top = hostRect.top - tooltipRect.height - 10;
                this.renderer.removeClass(this.tooltipElement, 'bottom');
                this.renderer.addClass(this.tooltipElement, 'top');
                this.renderer.removeStyle(this.tooltipArrow, 'order');
            } else {
                top = hostRect.bottom + 10;
                this.renderer.removeClass(this.tooltipElement, 'top');
                this.renderer.addClass(this.tooltipElement, 'bottom');
                this.renderer.setStyle(this.tooltipArrow, 'order', '-1');
            }
        }

        this.renderer.setStyle(this.tooltipElement, 'top', `${top}px`);
        this.renderer.setStyle(this.tooltipElement, 'left', `${left}px`);
    }

    private hide(): void {
        if (this.tooltipElement) {
            this.renderer.removeChild(document.body, this.tooltipElement);
            this.tooltipElement = null;
            this.tooltipArrow = null;
        }
    }
}
