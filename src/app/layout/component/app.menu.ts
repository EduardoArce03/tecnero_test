import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { AppMenuitem } from './app.menuitem';

@Component({
    selector: 'app-menu',
    standalone: true,
    imports: [CommonModule, AppMenuitem, RouterModule],
    styles: [
        `
            /* ── Superadmin badge en la parte superior ──────── */
            .menu-superadmin-header {
                display: flex;
                align-items: center;
                gap: 9px;
                padding: 10px 12px 14px;
                margin-bottom: 6px;
                border-bottom: 1px solid var(--surface-border);
            }

            .menu-superadmin-icon {
                width: 28px;
                height: 28px;
                border-radius: 7px;
                background: var(--primary-color);
                display: flex;
                align-items: center;
                justify-content: center;
                flex-shrink: 0;
            }

            .menu-superadmin-icon .pi {
                font-size: 0.8rem;
                color: #fff;
            }

            .menu-superadmin-label {
                font-size: 0.65rem;
                font-weight: 700;
                letter-spacing: 0.1em;
                text-transform: uppercase;
                color: var(--text-color-secondary);
            }

            /* ── Separador de sección ───────────────────────── */
            .menu-section-label {
                font-size: 0.62rem;
                font-weight: 700;
                letter-spacing: 0.1em;
                text-transform: uppercase;
                color: var(--text-color-secondary);
                padding: 8px 12px 4px;
                display: block;
            }

            /* ── Overrides sobre el layout-menu de Sakai ────── */
            :host ::ng-deep .layout-menu {
                padding: 0 6px;
            }

            /* Grupo raíz: label del módulo */
            :host ::ng-deep .layout-root-menuitem > .layout-menuitem-root-text {
                font-size: 0.68rem;
                font-weight: 700;
                letter-spacing: 0.09em;
                text-transform: uppercase;
                color: var(--text-color-secondary);
                padding: 6px 8px 4px;
                display: block;
            }

            /* Item raíz con hijos (el toggle del grupo) */
            :host ::ng-deep .layout-root-menuitem > a {
                display: flex;
                align-items: center;
                gap: 9px;
                padding: 9px 10px;
                border-radius: 8px;
                font-size: 0.85rem;
                font-weight: 600;
                color: var(--primary-color) !important;
                background: var(--primary-50, color-mix(in srgb, var(--primary-color) 10%, transparent)) !important;
                transition: background 0.15s;
            }

            :host ::ng-deep .layout-root-menuitem > a .layout-menuitem-icon {
                color: var(--primary-color);
            }

            /* Sub-items */
            :host ::ng-deep .layout-menuitem-root-text + ul .layout-menuitem a,
            :host ::ng-deep .layout-root-menuitem > ul > li > a {
                display: flex;
                align-items: center;
                gap: 9px;
                padding: 7px 10px 7px 18px;
                border-radius: 7px;
                font-size: 0.83rem;
                font-weight: 400;
                color: var(--text-color-secondary);
                border-left: 2px solid var(--surface-border);
                border-radius: 0 7px 7px 0;
                margin-left: 10px;
                transition:
                    background 0.12s,
                    color 0.12s,
                    border-color 0.12s;
            }

            :host ::ng-deep .layout-root-menuitem > ul > li > a:hover {
                background: var(--surface-hover);
                color: var(--text-color);
                border-left-color: var(--primary-300, var(--primary-color));
            }

            :host ::ng-deep .layout-root-menuitem > ul > li.active-menuitem > a,
            :host ::ng-deep .layout-root-menuitem > ul > li > a.active-route {
                background: var(--primary-50, color-mix(in srgb, var(--primary-color) 8%, transparent));
                color: var(--primary-color) !important;
                border-left-color: var(--primary-color);
                font-weight: 500;
            }

            :host ::ng-deep .layout-root-menuitem > ul > li > a .layout-menuitem-icon {
                font-size: 0.85rem;
                color: inherit;
            }

            /* Ocultar la flecha del submenu del item raíz si se quiere limpio */
            :host ::ng-deep .layout-root-menuitem > a .layout-submenu-toggler {
                margin-left: auto;
                font-size: 0.72rem;
                color: var(--primary-color);
                opacity: 0.7;
            }
        `
    ],
    template: `
        <!-- Cabecera de contexto superadmin -->
        <div class="menu-superadmin-header">
            <div class="menu-superadmin-icon">
                <i class="pi pi-shield"></i>
            </div>
            <span class="menu-superadmin-label">Superadmin</span>
        </div>

        <!-- Etiqueta de sección -->
        <span class="menu-section-label">Gestión</span>

        <!-- Menú -->
        <ul class="layout-menu">
            @for (item of model; track item.label) {
                @if (!item.separator) {
                    <li app-menuitem [item]="item" [root]="true"></li>
                } @else {
                    <li class="menu-separator"></li>
                }
            }
        </ul>
    `
})
export class AppMenu {
    model: MenuItem[] = [];

    ngOnInit() {
        this.model = [
            {
                label: 'Configuración Base',
                icon: 'pi pi-fw pi-cog',
                items: [
                    {
                        label: 'Líneas de Producción',
                        icon: 'pi pi-fw pi-sitemap',
                        routerLink: '/pages/linea-produccion'
                    },
                    {
                        label: 'Unidades de Medida',
                        icon: 'pi pi-fw pi-calculator',
                        routerLink: '/pages/unidades-medida'
                    }
                ]
            },
            {
                label: 'Bodega e Inventario',
                icon: 'pi pi-fw pi-box',
                items: [
                    {
                        label: 'Catálogo de Materiales',
                        icon: 'pi pi-fw pi-tags',
                        routerLink: '/pages/materiales'
                    },
                    {
                        label: 'Reportes',
                        icon: 'pi pi-fw pi-chart-line',
                        routerLink: '/pages/reportes/kardex'
                    }
                ]
            },
            {
                label: 'Gestión de Solicitudes',
                icon: 'pi pi-fw pi-truck',
                items: [
                    {
                        label: 'Nueva Solicitud',
                        icon: 'pi pi-fw pi-plus',
                        routerLink: '/pages/solicitudes/crear'
                    },
                    {
                        label: 'Mis Solicitudes',
                        icon: 'pi pi-fw pi-folder',
                        routerLink: '/pages/solicitudes/mis-solicitudes'
                    },
                    {
                        label: 'Aprobar (Coordinador)',
                        icon: 'pi pi-fw pi-check-circle',
                        routerLink: '/pages/solicitudes/aprobar'
                    },
                    {
                        label: 'Despachar (Bodega)',
                        icon: 'pi pi-fw pi-send',
                        routerLink: '/pages/solicitudes/despachar'
                    }
                ]
            }
        ];
    }
}
