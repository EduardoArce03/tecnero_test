import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificacionResponse } from '@/app/features/notificaciones/models/notificacion.response';

@Component({
    selector: 'app-notif-panel',
    standalone: true,
    imports: [CommonModule],
    changeDetection: ChangeDetectionStrategy.OnPush,
    styles: [
        `
            .notif-panel-wrap {
                width: 360px;
            }

            .panel-header {
                padding: 14px 16px 10px;
                border-bottom: 1px solid var(--surface-border);
                display: flex;
                align-items: center;
                justify-content: space-between;
            }
            .panel-title {
                font-size: 13px;
                font-weight: 600;
                color: var(--text-color);
                display: flex;
                align-items: center;
                gap: 8px;
            }
            .count-pill {
                background: var(--surface-100);
                color: var(--text-color-secondary);
                font-size: 11px;
                font-weight: 500;
                padding: 2px 8px;
                border-radius: 99px;
            }
            .mark-all-btn {
                font-size: 12px;
                color: var(--primary-color);
                background: none;
                border: none;
                cursor: pointer;
                padding: 3px 8px;
                border-radius: 6px;
                transition: background 0.12s;
            }
            .mark-all-btn:hover {
                background: var(--primary-50);
            }

            .notif-list {
                max-height: 380px;
                overflow-y: auto;
            }
            .notif-list::-webkit-scrollbar {
                width: 4px;
            }
            .notif-list::-webkit-scrollbar-track {
                background: transparent;
            }
            .notif-list::-webkit-scrollbar-thumb {
                background: var(--surface-300);
                border-radius: 2px;
            }

            .notif-item {
                display: flex;
                align-items: flex-start;
                gap: 10px;
                padding: 12px 16px;
                border-bottom: 1px solid var(--surface-border);
                cursor: pointer;
                transition: background 0.12s;
                position: relative;
            }
            .notif-item:last-child {
                border-bottom: none;
            }
            .notif-item:hover {
                background: var(--surface-50);
            }
            .notif-item--unread {
                background: var(--primary-50);
            }
            .notif-item--unread:hover {
                background: var(--primary-100);
            }

            .notif-icon {
                width: 32px;
                height: 32px;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                flex-shrink: 0;
                margin-top: 1px;
                font-size: 13px;
            }
            .notif-icon--creada {
                background: var(--blue-100);
                color: var(--blue-600);
            }
            .notif-icon--aprobada {
                background: var(--green-100);
                color: var(--green-600);
            }
            .notif-icon--rechazada {
                background: var(--red-100);
                color: var(--red-600);
            }
            .notif-icon--entregada {
                background: var(--purple-100);
                color: var(--purple-600);
            }

            .notif-body {
                flex: 1;
                min-width: 0;
            }
            .notif-msg {
                font-size: 12.5px;
                color: var(--text-color);
                line-height: 1.45;
                margin-bottom: 5px;
                display: -webkit-box;
                -webkit-line-clamp: 2;
                -webkit-box-orient: vertical;
                overflow: hidden;
            }
            .notif-meta {
                display: flex;
                align-items: center;
                gap: 6px;
                flex-wrap: wrap;
            }
            .notif-tipo {
                font-size: 10.5px;
                font-weight: 600;
                padding: 2px 7px;
                border-radius: 99px;
            }
            .tipo-creada {
                background: var(--blue-100);
                color: var(--blue-800);
            }
            .tipo-aprobada {
                background: var(--green-100);
                color: var(--green-800);
            }
            .tipo-rechazada {
                background: var(--red-100);
                color: var(--red-800);
            }
            .tipo-entregada {
                background: var(--purple-100);
                color: var(--purple-800);
            }

            .notif-time {
                font-size: 10.5px;
                color: var(--text-color-secondary);
            }

            .unread-dot {
                position: absolute;
                right: 14px;
                top: 50%;
                transform: translateY(-50%);
                width: 6px;
                height: 6px;
                border-radius: 50%;
                background: var(--primary-color);
                flex-shrink: 0;
            }

            .notif-empty {
                display: flex;
                flex-direction: column;
                align-items: center;
                gap: 8px;
                padding: 40px 20px;
                color: var(--text-color-secondary);
            }
            .notif-empty i {
                font-size: 28px;
                opacity: 0.4;
            }
            .notif-empty span {
                font-size: 13px;
            }

            .panel-footer {
                padding: 9px 16px;
                border-top: 1px solid var(--surface-border);
                display: flex;
                align-items: center;
                justify-content: space-between;
            }
            .refresh-btn {
                font-size: 12px;
                color: var(--text-color-secondary);
                background: none;
                border: none;
                cursor: pointer;
                display: flex;
                align-items: center;
                gap: 5px;
                padding: 4px 8px;
                border-radius: 6px;
                transition:
                    background 0.12s,
                    color 0.12s;
            }
            .refresh-btn:hover {
                background: var(--surface-100);
                color: var(--text-color);
            }
            .refresh-btn i {
                font-size: 13px;
            }

            .see-all-btn {
                font-size: 12px;
                font-weight: 600;
                color: var(--primary-color);
                background: none;
                border: none;
                cursor: pointer;
                display: flex;
                align-items: center;
                gap: 4px;
                padding: 4px 8px;
                border-radius: 6px;
                transition: background 0.12s;
            }
            .see-all-btn:hover {
                background: var(--primary-50);
            }
            .see-all-btn i {
                font-size: 11px;
            }
        `
    ],
    template: `
        <div class="notif-panel-wrap">
            <div class="panel-header">
                <span class="panel-title">
                    Notificaciones
                    <span class="count-pill">
                        {{ noLeidas > 0 ? noLeidas + ' nuevas' : 'al día ✓' }}
                    </span>
                </span>
                <button class="mark-all-btn" *ngIf="noLeidas > 0" (click)="onMarcarTodas()">Marcar todas como leídas</button>
            </div>

            <div class="notif-list">
                <div *ngFor="let n of notificaciones" class="notif-item" [class.notif-item--unread]="!n.leida" (click)="onMarcarLeida(n)">
                    <div [class]="'notif-icon notif-icon--' + getTipoClass(n.tipo)">
                        <i [class]="getTipoIcon(n.tipo)"></i>
                    </div>

                    <div class="notif-body">
                        <p class="notif-msg">{{ n.mensaje }}</p>
                        <div class="notif-meta">
                            <span [class]="'notif-tipo tipo-' + getTipoClass(n.tipo)">
                                {{ getTipoLabel(n.tipo) }}
                            </span>
                            <span class="notif-time">{{ n.fechaEnvio | date: 'dd/MM/yyyy HH:mm' }}</span>
                        </div>
                    </div>

                    <span class="unread-dot" *ngIf="!n.leida"></span>
                </div>

                <div class="notif-empty" *ngIf="notificaciones.length === 0">
                    <i class="pi pi-bell-slash"></i>
                    <span>Sin notificaciones</span>
                </div>
            </div>

            <div class="panel-footer" *ngIf="notificaciones.length > 0">
                <button class="refresh-btn" (click)="onRefresh()"><i class="pi pi-refresh"></i> Actualizar</button>
                <button class="see-all-btn">Ver todas <i class="pi pi-arrow-right"></i></button>
            </div>
        </div>
    `
})
export class NotifPanelComponent {
    @Input() notificaciones: NotificacionResponse[] = [];
    @Input() noLeidas = 0;
    @Output() marcarLeida = new EventEmitter<NotificacionResponse>();
    @Output() marcarTodas = new EventEmitter<void>();
    @Output() refresh = new EventEmitter<void>();

    onMarcarLeida(n: NotificacionResponse) {
        this.marcarLeida.emit(n);
    }
    onMarcarTodas() {
        this.marcarTodas.emit();
    }
    onRefresh() {
        this.refresh.emit();
    }

    getTipoIcon(tipo: string): string {
        const map: Record<string, string> = {
            SOLICITUD_CREADA: 'pi pi-plus-circle',
            SOLICITUD_APROBADA: 'pi pi-check-circle',
            SOLICITUD_RECHAZADA: 'pi pi-times-circle',
            SOLICITUD_ENTREGADA: 'pi pi-box'
        };
        return map[tipo] ?? 'pi pi-bell';
    }

    getTipoClass(tipo: string): string {
        const map: Record<string, string> = {
            SOLICITUD_CREADA: 'creada',
            SOLICITUD_APROBADA: 'aprobada',
            SOLICITUD_RECHAZADA: 'rechazada',
            SOLICITUD_ENTREGADA: 'entregada'
        };
        return map[tipo] ?? 'creada';
    }

    getTipoLabel(tipo: string): string {
        const map: Record<string, string> = {
            SOLICITUD_CREADA: 'Solicitud creada',
            SOLICITUD_APROBADA: 'Aprobada',
            SOLICITUD_RECHAZADA: 'Rechazada',
            SOLICITUD_ENTREGADA: 'Entregada'
        };
        return map[tipo] ?? tipo;
    }
}
