import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    standalone: true,
    selector: 'app-footer',
    imports: [CommonModule],
    styles: [
        `
            .layout-footer {
                display: flex;
                align-items: center;
                justify-content: space-between;
                padding: 12px 20px;
                border-top: 1px solid var(--surface-border);
                font-size: 0.75rem;
                color: var(--text-color-secondary);
            }

            .footer-brand {
                display: flex;
                align-items: center;
                gap: 6px;
                font-weight: 600;
                color: var(--primary-color);
                font-size: 0.75rem;
            }

            .footer-brand .pi {
                font-size: 0.75rem;
            }

            .footer-right {
                display: flex;
                align-items: center;
                gap: 16px;
            }

            .footer-right a {
                color: var(--text-color-secondary);
                text-decoration: none;
                font-size: 0.72rem;
                transition: color 0.15s;
            }

            .footer-right a:hover {
                color: var(--primary-color);
            }

            .footer-dot {
                width: 3px;
                height: 3px;
                border-radius: 50%;
                background: var(--surface-border);
            }
        `
    ],
    template: `
        <div class="layout-footer">
            <span class="footer-brand">
                <i class="pi pi-shield"></i>
                MedInside &mdash; CompuInside &copy; {{ year }}
            </span>
            <div class="footer-right">
                <span>v1.0.0</span>
                <div class="footer-dot"></div>
                <a href="mailto:soporte@compuinside.com">Soporte</a>
            </div>
        </div>
    `
})
export class AppFooter {
    readonly year = new Date().getFullYear();
}
