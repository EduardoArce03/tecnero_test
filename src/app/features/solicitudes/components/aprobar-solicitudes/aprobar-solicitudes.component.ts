import { ChangeDetectorRef, Component, NgZone, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SolicitudMaterialService } from '@/app/features/solicitudes/services/solicitud-material.service';
import { AuthService } from '@/app/core/services/auth.service';
import { EstadoSolicitud, SolicitudMaterialResponse } from '@/app/features/solicitudes/models/solicitud.response';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';
import { ToastModule } from 'primeng/toast';
import { DialogModule } from 'primeng/dialog';
import { DividerModule } from 'primeng/divider';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { MessageService, ConfirmationService } from 'primeng/api';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'app-aprobar-solicitudes',
    templateUrl: './aprobar-solicitudes.component.html',
    styleUrls: ['./aprobar-solicitudes.component.scss'],
    imports: [CommonModule, FormsModule, TableModule, TagModule, ButtonModule, TooltipModule, ToastModule, DialogModule, DividerModule, IconFieldModule, InputIconModule, InputTextModule, TextareaModule, ConfirmDialogModule],
    providers: [MessageService, ConfirmationService]
})
export class AprobarSolicitudesComponent implements OnInit {
    solicitudes: SolicitudMaterialResponse[] = [];
    loading = true;
    procesando = false;
    solicitudSeleccionada: SolicitudMaterialResponse | null = null;
    dialogDetalleVisible = false;
    dialogRechazarVisible = false;
    observacionRechazo = '';

    constructor(
        private solicitudService: SolicitudMaterialService,
        private authService: AuthService,
        private messageService: MessageService,
        private confirmationService: ConfirmationService,
        private cdr: ChangeDetectorRef,
        private ngZone: NgZone
    ) {}

    ngOnInit() {
        this.cargarPendientes();
    }

    cargarPendientes() {
        this.loading = true;
        this.solicitudService.listarPorEstado(EstadoSolicitud.PENDIENTE).subscribe({
            next: (response) => {
                this.ngZone.run(() => {
                    this.solicitudes = [...response]; // Clonamos el array para romper referencia
                    this.loading = false;
                    this.cdr.detectChanges(); // Forzamos el renderizado inmediato
                });
            },
            error: () => {
                this.ngZone.run(() => {
                    this.loading = false;
                    this.toast('error', 'Error al cargar solicitudes pendientes');
                    this.cdr.detectChanges();
                });
            }
        });
    }

    verDetalle(solicitud: SolicitudMaterialResponse) {
        this.solicitudSeleccionada = solicitud;
        this.dialogDetalleVisible = true;
    }

    confirmarAprobar(solicitud: SolicitudMaterialResponse) {
        this.confirmationService.confirm({
            message: `¿Aprobar la solicitud #${solicitud.idSolicitud} de ${solicitud.usuarioResponse.nombre}?`,
            header: 'Confirmar aprobación',
            icon: 'pi pi-check-circle',
            acceptLabel: 'Sí, aprobar',
            rejectLabel: 'Cancelar',
            acceptButtonStyleClass: 'p-button-success',
            accept: () => this.aprobar(solicitud)
        });
    }

    aprobar(solicitud: SolicitudMaterialResponse) {
        const usuario = this.authService.getUsuario();
        if (!usuario) return;
        this.procesando = true;

        this.solicitudService.aprobarSolicitud((solicitud.idSolicitud)).subscribe({
            next: () => {
                this.procesando = false;
                this.solicitudes = this.solicitudes.filter((s) => s.idSolicitud !== solicitud.idSolicitud);
                this.toast('success', `Solicitud #${solicitud.idSolicitud} aprobada`);
            },
            error: () => {
                this.procesando = false;
                this.toast('error', 'Error al aprobar la solicitud');
            }
        });
    }

    abrirDialogRechazar(solicitud: SolicitudMaterialResponse) {
        this.solicitudSeleccionada = solicitud;
        this.observacionRechazo = '';
        this.dialogRechazarVisible = true;
    }

    rechazar() {
        if (!this.solicitudSeleccionada) return;
        this.procesando = true;

        this.solicitudService.rechazarSolicitud((this.solicitudSeleccionada.idSolicitud)).subscribe({
            next: () => {
                this.procesando = false;
                this.solicitudes = this.solicitudes.filter((s) => s.idSolicitud !== this.solicitudSeleccionada!.idSolicitud);
                this.dialogRechazarVisible = false;
                this.toast('warn', `Solicitud #${this.solicitudSeleccionada!.idSolicitud} rechazada`);
                this.solicitudSeleccionada = null;
            },
            error: () => {
                this.procesando = false;
                this.toast('error', 'Error al rechazar la solicitud');
            }
        });
    }

    getSeverity(estado: EstadoSolicitud): 'warn' | 'success' | 'danger' | 'info' | 'secondary' {
        switch (estado) {
            case EstadoSolicitud.PENDIENTE:
                return 'warn';
            case EstadoSolicitud.APROBADA:
                return 'success';
            case EstadoSolicitud.RECHAZADA:
                return 'danger';
            case EstadoSolicitud.ENTREGADA:
                return 'info';
            default:
                return 'secondary';
        }
    }

    private toast(severity: string, detail: string) {
        this.messageService.add({ severity, detail, life: 3000 });
    }
}
