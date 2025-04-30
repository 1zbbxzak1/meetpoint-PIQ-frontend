import {ChangeDetectorRef, Component, DestroyRef, inject, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {HeaderComponent} from '../../../components/header/header.component';
import {NgForOf, NgIf} from '@angular/common';
import {EventsManagerService} from '../../../../../data/services/events/events.manager.service';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {GetEventWithIncludesResponse} from '../../../../../data/model/response/events/IEvent.response';

@Component({
    selector: 'app-team',
    imports: [
        HeaderComponent,
        NgIf,
        NgForOf,

    ],
    templateUrl: './team.component.html',
    styleUrl: './styles/team.component.scss'
})
export class TeamComponent implements OnInit {
    protected teamData: any;
    protected breadcrumbs: string[] = [];
    protected assessments: any = [
        {
            title: 'active',
            assessment: [
                {
                    name: 'Неделя 3',
                    dateStart: '17 апр 12:00',
                    dateEnd: '24 апр 23:55',
                },
            ]
        },
        {
            title: 'future',
            assessment: [
                {
                    name: 'Неделя 4',
                    dateStart: '24 апр 11:00',
                    dateEnd: '1 мая 23:55',
                }
            ]
        },
        {
            title: 'complete',
            assessment: [
                {
                    name: 'Неделя 2',
                    dateStart: '10 апр 10:00',
                    dateEnd: '16 апр 23:55',
                },
                {
                    name: 'Неделя 1',
                    dateStart: '3 апр 12:00',
                    dateEnd: '9 апр 23:55',
                }
            ]
        }
    ];
    private _teamId!: string;
    private _events: any;
    private readonly _route: ActivatedRoute = inject(ActivatedRoute);
    private readonly _router: Router = inject(Router);
    private readonly _destroyRef: DestroyRef = inject(DestroyRef);
    private readonly _cdr: ChangeDetectorRef = inject(ChangeDetectorRef);
    private readonly _eventsManagerService: EventsManagerService = inject(EventsManagerService);

    protected get activeAssessments(): any[] {
        return this.assessments.find((a: { title: string; }): boolean => a.title === 'active')?.assessment || [];
    }

    protected get futureAssessments(): any[] {
        return this.assessments.find((a: { title: string; }): boolean => a.title === 'future')?.assessment || [];
    }

    protected get completeAssessments(): any[] {
        return this.assessments.find((a: { title: string; }): boolean => a.title === 'complete')?.assessment || [];
    }

    public ngOnInit(): void {
        this._teamId = this._route.snapshot.paramMap.get('id')!;

        this.getCurrentEvents();
    }

    private getCurrentEvents(): void {
        this._eventsManagerService.getCurrent().pipe(
            takeUntilDestroyed(this._destroyRef)
        ).subscribe((events: GetEventWithIncludesResponse): void => {
            this._events = events;

            this.buildBreadcrumbs();

            this._cdr.detectChanges();
        })
    }

    private buildBreadcrumbs(): void {
        for (const direction of this._events.event.directions) {
            for (const project of direction.projects) {
                const foundTeam = project.teams.find((t: any): boolean => t.id === this._teamId);
                if (foundTeam) {
                    this.teamData = foundTeam;
                    this.breadcrumbs = [
                        this._events.event.name,
                        direction.name,
                        project.name,
                        foundTeam.name
                    ];
                    return;
                }
            }
        }
    }
}
