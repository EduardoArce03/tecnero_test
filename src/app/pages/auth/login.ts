import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { RippleModule } from 'primeng/ripple';
import { AppFloatingConfigurator } from '../../layout/component/app.floatingconfigurator';
import { AuthService } from '@/app/core/services/auth.service';
import { switchMap } from 'rxjs';

@Component({
    selector: 'app-login',
    standalone: true,
    imports: [ButtonModule, CheckboxModule, InputTextModule, PasswordModule, FormsModule, RouterModule, RippleModule, AppFloatingConfigurator],
    styles: [
        `
            .login-screen {
                min-height: 100vh;
                display: flex;
                align-items: center;
                justify-content: center;
                background: var(--surface-ground);
                padding: 16px;
            }

            .login-card {
                width: 100%;
                max-width: 400px;
                background: var(--surface-card);
                border: 1px solid var(--surface-border);
                border-radius: 14px;
                overflow: hidden;
            }

            /* ── Header azul con brand ──────────────────── */
            .login-header {
                background: var(--primary-color);
                padding: 28px 32px 26px;
                display: flex;
                flex-direction: column;
                align-items: center;
                gap: 12px;
            }

            .login-logo-box {
                width: 56px;
                height: 56px;
                border-radius: 14px;
                background: rgba(255, 255, 255, 0.18);
                display: flex;
                align-items: center;
                justify-content: center;
            }

            .login-logo-box img {
                width: 34px;
                height: 34px;
                object-fit: contain;
                filter: brightness(0) invert(1);
            }

            .login-brand {
                text-align: center;
            }

            .login-brand-name {
                display: block;
                font-size: 1.15rem;
                font-weight: 800;
                color: #fff;
                letter-spacing: -0.02em;
            }

            .login-brand-sub {
                display: block;
                font-size: 0.65rem;
                font-weight: 600;
                letter-spacing: 0.13em;
                text-transform: uppercase;
                color: rgba(255, 255, 255, 0.65);
                margin-top: 2px;
            }

            /* ── Body del formulario ────────────────────── */
            .login-body {
                padding: 28px 30px 24px;
                display: flex;
                flex-direction: column;
                gap: 16px;
            }

            .login-welcome {
                margin-bottom: 2px;
            }

            .login-title {
                font-size: 1rem;
                font-weight: 700;
                color: var(--text-color);
                margin: 0 0 3px;
            }

            .login-subtitle {
                font-size: 0.78rem;
                color: var(--text-color-secondary);
                margin: 0;
            }

            /* ── Campos ─────────────────────────────────── */
            .login-field {
                display: flex;
                flex-direction: column;
                gap: 5px;
            }

            .login-label {
                font-size: 0.78rem;
                font-weight: 600;
                color: var(--text-color);
            }

            :host ::ng-deep {
                .login-input,
                .login-password .p-password-input {
                    width: 100%;
                    border-radius: 7px !important;
                    font-size: 0.85rem !important;
                    padding: 9px 12px !important;

                    &:focus {
                        border-color: var(--primary-color) !important;
                        box-shadow: 0 0 0 1px var(--primary-color) !important;
                    }
                }

                .login-password {
                    width: 100%;

                    .p-password {
                        width: 100%;
                    }
                }
            }

            /* ── Remember + forgot ──────────────────────── */
            .login-options {
                display: flex;
                align-items: center;
                justify-content: space-between;
                margin-top: -2px;
            }

            .remember-label {
                font-size: 0.8rem;
                color: var(--text-color-secondary);
                cursor: pointer;
                user-select: none;
            }

            .forgot-link {
                font-size: 0.78rem;
                font-weight: 600;
                color: var(--primary-color);
                cursor: pointer;
                text-decoration: none;

                &:hover {
                    text-decoration: underline;
                }
            }

            /* ── Botón submit ───────────────────────────── */
            :host ::ng-deep .login-btn {
                .p-button {
                    width: 100%;
                    justify-content: center;
                    border-radius: 8px !important;
                    font-size: 0.88rem !important;
                    font-weight: 700 !important;
                    padding: 10px !important;
                    letter-spacing: 0.01em;
                }
            }

            /* ── Footer ─────────────────────────────────── */
            .login-footer {
                padding: 12px 30px;
                border-top: 1px solid var(--surface-border);
                text-align: center;
                font-size: 0.7rem;
                color: var(--text-color-secondary);
                background: var(--surface-ground);
            }
        `
    ],
    template: `
        <app-floating-configurator />

        <div class="login-screen">
            <div class="login-card">
                <!-- ── Header ───────────────────────── -->
                <div class="login-header">
                    <div class="login-logo-box">
                        <img src="assets/images/icono_compuinside.png" alt="CompuInside" />
                    </div>
                    <div class="login-brand">
                        <span class="login-brand-name">CompuInside</span>
                        <span class="login-brand-sub">Panel de Administración</span>
                    </div>
                </div>

                <!-- ── Formulario ────────────────────── -->
                <div class="login-body">
                    <div class="login-welcome">
                        <h5 class="login-title">Bienvenido</h5>
                        <p class="login-subtitle">Ingresa tus credenciales para continuar</p>
                    </div>

                    <div class="login-field">
                        <label for="email" class="login-label">Correo electrónico</label>
                        <input pInputText id="email" type="text" placeholder="usuario@compuinside.com" [(ngModel)]="email" class="login-input" />
                    </div>

                    <div class="login-field">
                        <label for="password" class="login-label">Contraseña</label>
                        <p-password id="password" [(ngModel)]="password" placeholder="Ingresa tu contraseña" [toggleMask]="true" [feedback]="false" [fluid]="true" styleClass="login-password"> </p-password>
                    </div>

                    <div class="login-options">
                        <div class="flex align-items-center gap-2">
                            <p-checkbox [(ngModel)]="checked" id="rememberme" binary />
                            <label for="rememberme" class="remember-label">Recordarme</label>
                        </div>
                        <span class="forgot-link">¿Olvidaste tu contraseña?</span>
                    </div>

                    <p-button label="Iniciar sesión" styleClass="login-btn" (click)="login()"> </p-button>
                </div>

                <!-- ── Footer ───────────────────────── -->
                <div class="login-footer">MedInside &copy; {{ year }} &middot; CompuInside</div>
            </div>
        </div>
    `
})
export class Login {
    email: string = '';
    password: string = '';
    checked: boolean = false;
    readonly year = new Date().getFullYear();

    constructor(
        private authService: AuthService,
        private router: Router
    ) {}

    login() {
        this.authService.login({ username: this.email, password: this.password }).pipe(
            switchMap(() => this.authService.cargarUsuarioActual())
        ).subscribe({
            next: (usuario) => {
                // redirigir según rol
                // switch (usuario.role) {
                //     case 'COORDINADOR':
                //         this.router.navigate(['/solicitudes/aprobar']);
                //         break;
                //     case 'BODEGUERO':
                //         this.router.navigate(['/solicitudes/despachar']);
                //         break;
                //     case 'SOLICITANTE':
                //         this.router.navigate(['/solicitudes/crear']);
                //         break;
                // }
                this.router.navigate(['/']);
            },
            //error: () => this.toast('error', 'Error al iniciar sesión')
        });
    }
}
