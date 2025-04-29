import {ChangeDetectionStrategy, ChangeDetectorRef, Component, DestroyRef, inject, OnInit} from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {AuthManagerService} from '../../data/services/auth/auth.manager.service';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {IAuthRequest} from '../../data/model/request/auth/IAuth.request';
import {NgIf} from '@angular/common';

@Component({
    selector: 'app-auth',
    imports: [
        ReactiveFormsModule,
        NgIf
    ],
    templateUrl: './auth.component.html',
    styleUrl: './styles/auth.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
})
export class AuthComponent implements OnInit {

    protected formAuth: FormGroup = new FormGroup({
        email: new FormControl('', [Validators.required, Validators.email]),
        password: new FormControl('', [Validators.required, Validators.minLength(6), Validators.maxLength(20)]),
    });

    protected passwordVisible: boolean = false;

    protected loginError: string | null = null;

    private readonly _router: Router = inject(Router);
    private readonly _destroyRef: DestroyRef = inject(DestroyRef);
    private readonly _cdr: ChangeDetectorRef = inject(ChangeDetectorRef);

    private _authManagerService: AuthManagerService = inject(AuthManagerService);

    protected get eyeIcon(): string {
        if (this.passwordVisible) {
            return 'assets/eye.svg';
        } else {
            return 'assets/eye-off.svg';
        }
    }

    public ngOnInit(): void {
        this.formAuth.valueChanges.pipe(
            takeUntilDestroyed(this._destroyRef)
        ).subscribe((): void => {
            this.loginError = null;
        });
    }

    protected loginUser(): void {
        const email: string = this.formAuth.get("email")?.value;
        const password: string = this.formAuth.get("password")?.value;

        if (email && password) {
            const user: IAuthRequest = {
                email,
                password
            };

            this._authManagerService.loginUser(user).pipe(
                takeUntilDestroyed(this._destroyRef)
            ).subscribe({
                next: (): void => {
                    this.loginError = null;
                    this._router.navigate(['/']);
                },
                error: (err): void => {
                    this.loginError = err.message;
                    this._cdr.markForCheck();
                }
            });
        }
    }

    protected togglePassword(): void {
        this.passwordVisible = !this.passwordVisible;
    }
}
