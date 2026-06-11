import { Component, inject, OnInit, OnDestroy, ChangeDetectorRef, NgZone, ViewChild } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { StyleClassModule } from 'primeng/styleclass';
import { AppConfigurator } from './app.configurator';
import { LayoutService } from '@/app/layout/service/layout.service';
import { AvatarModule } from 'primeng/avatar';
import { RippleModule } from 'primeng/ripple';
import { AuthService } from '@/app/core/services/auth.service';
import { NotificacionResponse } from '@/app/features/notificaciones/models/notificacion.response';
import { BadgeModule } from 'primeng/badge';
import { ButtonModule } from 'primeng/button';
import { interval, Subscription } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { Popover, PopoverModule } from 'primeng/popover';
import { NotificacionService } from '@/app/features/notificaciones/services/notificaciones.service';
import { NotifPanelComponent } from '@/app/features/core/notif-panel.component';

@Component({
    selector: 'app-topbar',
    standalone: true,
    imports: [RouterModule, CommonModule, StyleClassModule, AppConfigurator, AvatarModule, RippleModule, BadgeModule, ButtonModule, PopoverModule, NotifPanelComponent],
    styles: [
        `
            .layout-topbar {
                border-bottom: 1px solid var(--surface-border) !important;
            }

            /* ── Brand ─────────────────────────────────────── */
            .topbar-brand {
                display: flex;
                align-items: center;
                gap: 10px;
                text-decoration: none;
            }
            .topbar-logo-box {
                width: 36px;
                height: 36px;
                border-radius: 8px;
                background: var(--primary-color);
                display: flex;
                align-items: center;
                justify-content: center;
                flex-shrink: 0;
            }
            .topbar-logo-box img {
                width: 24px;
                height: 24px;
                object-fit: contain;
                filter: brightness(0) invert(1);
            }
            .brand-text {
                display: flex;
                flex-direction: column;
                line-height: 1.15;
            }
            .brand-name {
                font-size: 0.9rem;
                font-weight: 700;
                letter-spacing: -0.02em;
                color: var(--primary-color);
            }
            .brand-product {
                font-size: 0.6rem;
                font-weight: 600;
                letter-spacing: 0.1em;
                text-transform: uppercase;
                color: var(--text-color-secondary);
            }

            /* ── Action buttons ─────────────────────────────── */
            .topbar-divider {
                width: 1px;
                height: 22px;
                background: var(--surface-border);
                margin: 0 6px;
            }
            .ci-action-btn {
                position: relative;
                display: flex;
                align-items: center;
                justify-content: center;
                width: 34px;
                height: 34px;
                border-radius: 7px;
                border: none;
                background: transparent;
                color: var(--text-color-secondary);
                cursor: pointer;
                transition:
                    background 0.15s,
                    color 0.15s;
            }
            .ci-action-btn:hover {
                background: var(--surface-hover);
                color: var(--text-color);
            }
            .ci-action-btn .pi {
                font-size: 1rem;
            }

            /* ── Notificaciones ─────────────────────────────── */
            .notif-btn {
                position: relative;
            }
            .notif-count {
                position: absolute;
                top: 2px;
                right: 2px;
                min-width: 16px;
                height: 16px;
                border-radius: 8px;
                background: var(--red-500);
                color: white;
                font-size: 0.6rem;
                font-weight: 700;
                display: flex;
                align-items: center;
                justify-content: center;
                padding: 0 3px;
                border: 2px solid var(--surface-card);
                line-height: 1;
            }

            /* ── User button ────────────────────────────────── */
            .user-profile-btn {
                display: flex;
                align-items: center;
                gap: 8px;
                padding: 4px 10px 4px 4px;
                border-radius: 20px;
                border: 1px solid var(--surface-border);
                background: transparent;
                cursor: pointer;
                transition: background 0.15s;
            }
            .user-profile-btn:hover {
                background: var(--surface-hover);
            }
            .user-info {
                display: flex;
                flex-direction: column;
                text-align: left;
                line-height: 1.2;
            }
            .user-name {
                font-size: 0.78rem;
                font-weight: 600;
                color: var(--text-color);
            }
            .user-role {
                font-size: 0.68rem;
                color: var(--text-color-secondary);
            }

            /* ── User dropdown ──────────────────────────────── */
            .user-dropdown {
                position: absolute;
                right: 0;
                top: calc(100% + 8px);
                background: var(--surface-overlay);
                border: 1px solid var(--surface-border);
                border-radius: 10px;
                padding: 6px;
                min-width: 185px;
                box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
                z-index: 1000;
            }
            .dropdown-item {
                display: flex;
                align-items: center;
                gap: 10px;
                padding: 8px 12px;
                border-radius: 6px;
                text-decoration: none;
                color: var(--text-color);
                font-size: 0.82rem;
                cursor: pointer;
                border: none;
                background: transparent;
                width: 100%;
                transition: background 0.12s;
            }
            .dropdown-item:hover {
                background: var(--surface-hover);
            }
            .dropdown-item .pi {
                font-size: 0.85rem;
                color: var(--text-color-secondary);
            }
            .dropdown-separator {
                height: 1px;
                background: var(--surface-border);
                margin: 4px 0;
            }
            .dropdown-item-danger {
                color: var(--red-500);
            }
            .dropdown-item-danger .pi {
                color: var(--red-500);
            }

            /* ── Popover reset ──────────────────────────────── */
            :host ::ng-deep .notif-panel-popover .p-popover-content {
                padding: 0 !important;
                border-radius: 12px;
                overflow: hidden;
            }

            /* ── Mobile ─────────────────────────────────────── */
            @media (max-width: 991px) {
                .user-info,
                .chevron-icon {
                    display: none !important;
                }
                .user-profile-btn {
                    padding: 4px;
                    border-radius: 50%;
                    border: 1px solid var(--surface-border);
                }
            }
        `
    ],
    template: `
        <div class="layout-topbar">
            <div class="layout-topbar-logo-container">
                <button class="layout-menu-button layout-topbar-action" (click)="layoutService.onMenuToggle()">
                    <i class="pi pi-bars"></i>
                </button>
                <a class="topbar-brand" routerLink="/">
                    <div class="topbar-logo-box">
                        <img src="assets/images/icono_compuinside.png" alt="CompuInside logo" />
                    </div>
                    <div class="brand-text">
                        <span class="brand-name">CompuInside</span>
                        <span class="brand-product">MedInside</span>
                    </div>
                </a>
            </div>

            <div class="layout-topbar-actions">
                <button class="ci-action-btn" (click)="toggleDarkMode()" title="Cambiar tema">
                    <i [class]="'pi ' + (layoutService.isDarkTheme() ? 'pi-sun' : 'pi-moon')"></i>
                </button>

                <div class="relative">
                    <button class="ci-action-btn layout-topbar-action-highlight" pStyleClass="@next" enterFromClass="hidden" enterActiveClass="animate-scalein" leaveToClass="hidden" leaveActiveClass="animate-fadeout" [hideOnOutsideClick]="true">
                        <i class="pi pi-palette"></i>
                    </button>
                    <app-configurator />
                </div>

                <div class="topbar-divider"></div>

                <!-- Notificaciones -->
                <div class="notif-btn">
                    <button class="ci-action-btn" (click)="toggleNotifPanel($event)" title="Notificaciones">
                        <i class="pi pi-bell"></i>
                        <span class="notif-count" *ngIf="noLeidas > 0">
                            {{ noLeidas > 99 ? '99+' : noLeidas }}
                        </span>
                    </button>

                    <p-popover #notifPanel styleClass="notif-panel-popover p-0">
                        <app-notif-panel [notificaciones]="notificaciones" [noLeidas]="noLeidas" (marcarLeida)="onMarcarLeida($event)" (marcarTodas)="onMarcarTodasLeidas()" (refresh)="cargarNotificaciones()" />
                    </p-popover>
                </div>

                <!-- User profile -->
                <div class="relative">
                    <button class="user-profile-btn" pStyleClass="@next" enterFromClass="hidden" enterActiveClass="animate-scalein" leaveToClass="hidden" leaveActiveClass="animate-fadeout" [hideOnOutsideClick]="true">
                        <p-avatar
                            [label]="getInitials()"
                            shape="circle"
                            [style]="{
                                width: '28px',
                                height: '28px',
                                background: 'var(--primary-100)',
                                color: 'var(--primary-color)',
                                fontSize: '0.72rem',
                                fontWeight: '700'
                            }"
                        />
                        <div class="user-info">
                            <span class="user-name">{{ usuario?.nombre }} {{ usuario?.apellido }}</span>
                            <span class="user-role">{{ usuario?.role }}</span>
                        </div>
                        <i class="pi pi-angle-down chevron-icon" style="font-size: 0.72rem; color: var(--text-color-secondary);"></i>
                    </button>

                    <div class="user-dropdown hidden">
                        <a routerLink="/perfil" class="dropdown-item">
                            <i class="pi pi-user"></i>
                            Mi perfil
                        </a>
                        <div class="dropdown-separator"></div>
                        <button class="dropdown-item dropdown-item-danger" (click)="logout()">
                            <i class="pi pi-sign-out"></i>
                            Cerrar sesión
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `
})
export class AppTopbar implements OnInit, OnDestroy {
    items!: MenuItem[];
    notificaciones: NotificacionResponse[] = [];
    noLeidas = 0;
    private pollSub?: Subscription;

    // 👇 referencia directa al popover para poder hacer toggle
    @ViewChild('notifPanel') notifPanel!: Popover;

    layoutService = inject(LayoutService);
    authService = inject(AuthService);
    notificacionService = inject(NotificacionService);

    get usuario() {
        return this.authService.getUsuario();
    }

    constructor(
        private router: Router,
        private cdr: ChangeDetectorRef,
        private ngZone: NgZone
    ) {}

    ngOnInit() {
        this.cargarNotificaciones();
        this.pollSub = interval(30000)
            .pipe(switchMap(() => this.notificacionService.contarNoLeidas()))
            .subscribe((count) => {
                this.ngZone.run(() => {
                    this.noLeidas = count;
                    this.cdr.detectChanges();
                });
            });
    }

    ngOnDestroy() {
        this.pollSub?.unsubscribe();
    }

    cargarNotificaciones() {
        this.notificacionService.listarMisNotificaciones().subscribe({
            next: (notifs) => {
                this.ngZone.run(() => {
                    this.notificaciones = [...notifs];
                    this.noLeidas = notifs.filter((n) => !n.leida).length;
                    this.cdr.detectChanges();
                });
            },
            error: () => this.ngZone.run(() => this.cdr.detectChanges())
        });
    }

    // 👇 fix principal: ahora sí llama toggle en el popover
    toggleNotifPanel(event: Event) {
        this.cargarNotificaciones();
        this.notifPanel.toggle(event);
    }

    onMarcarLeida(notif: NotificacionResponse) {
        if (notif.leida) return;
        this.notificacionService.marcarComoLeida(notif.uuid).subscribe({
            next: () => {
                this.ngZone.run(() => {
                    notif.leida = true;
                    this.noLeidas = Math.max(0, this.noLeidas - 1);
                    this.cdr.detectChanges();
                });
            }
        });
    }

    onMarcarTodasLeidas() {
        this.notificacionService.marcarTodasComoLeidas().subscribe({
            next: () => {
                this.ngZone.run(() => {
                    this.notificaciones.forEach((n) => (n.leida = true));
                    this.noLeidas = 0;
                    this.cdr.detectChanges();
                });
            }
        });
    }

    getInitials(): string {
        const u = this.authService.getUsuario();
        if (!u) return 'U';
        return `${u.nombre.charAt(0)}${u.apellido.charAt(0)}`.toUpperCase();
    }

    toggleDarkMode() {
        this.layoutService.layoutConfig.update((state) => ({
            ...state,
            darkTheme: !state.darkTheme
        }));
    }

    logout() {
        this.authService.logout();
        this.router.navigate(['/auth/login']);
    }
}
