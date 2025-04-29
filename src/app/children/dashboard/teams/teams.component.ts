import {Component} from '@angular/core';
import {HeaderComponent} from '../components/header/header.component';
import {NgClass, NgForOf, NgIf, NgOptimizedImage} from '@angular/common';

@Component({
    selector: 'app-teams',
    imports: [
        HeaderComponent,
        NgForOf,
        NgIf,
        NgClass,
        NgOptimizedImage
    ],
    templateUrl: './teams.component.html',
    styleUrl: './styles/teams.component.scss'
})
export class TeamsComponent {
    protected groups = [
        {
            title: 'Точка сбора',
            subgroups: [
                {
                    title: 'Личный кабинет',
                    badge: '',
                    cards: [
                        {
                            title: 'Личный кабинет 1',
                            badge: '',
                            students: [
                                {fullName: "Мельников Михаил"},
                                {fullName: "Килязова Юния"},
                                {fullName: "Гавриляк Михаил"},
                                {fullName: "Полякова Юлия"}
                            ]
                        },
                        {
                            title: 'Личный кабинет 2',
                            badge: 'Требует оценки',
                            students: [
                                {fullName: "Анамнешев Николай"},
                                {fullName: "Куркин Артём"},
                                {fullName: "Лавринович Станислав"},
                                {fullName: "Петриченко Максим"}
                            ]
                        },
                        {
                            title: 'Личный кабинет 3',
                            badge: '',
                            students: [
                                {fullName: "Зверев Александр"},
                                {fullName: "Калугин Илья"},
                                {fullName: "Новиков Антон"},
                                {fullName: "Рябков Георгий"}
                            ]
                        }
                    ]
                },
                {
                    title: 'Страницы',
                    cards: [
                        {
                            title: 'Страницы 1',
                            badge: 'Требует оценки',
                            students: [
                                {fullName: "Мельников Михаил"},
                                {fullName: "Килязова Юния"},
                                {fullName: "Гавриляк Михаил"},
                                {fullName: "Полякова Юлия"}
                            ]
                        },
                        {
                            title: 'Страницы 2',
                            badge: '',
                            students: [
                                {fullName: "Анамнешев Николай"},
                                {fullName: "Куркин Артём"},
                                {fullName: "Лавринович Станислав"},
                                {fullName: "Петриченко Максим"}
                            ]
                        }
                    ]
                },
            ]
        },
        {
            title: '1С',
            subgroups: [
                {
                    title: 'УНФ айки',
                    cards: [
                        {
                            title: 'УНФ айки',
                            badge: '',
                            students: [
                                {fullName: "Корелин Никита"},
                                {fullName: "Олищук Владислав"},
                                {fullName: "Иванов Максим"}
                            ]
                        }
                    ]
                }
            ]
        }
    ];
}
