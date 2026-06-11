import { ChangeDetectorRef, Component, NgZone, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SolicitudMaterialService } from '@/app/features/solicitudes/services/solicitud-material.service';
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
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { MessageService, ConfirmationService } from 'primeng/api';

@Component({
    selector: 'app-despachar-solicitudes',
    templateUrl: './despachar-solicitudes.component.html',
    styleUrls: ['./despachar-solicitudes.component.scss'],
    imports: [CommonModule, TableModule, TagModule, ButtonModule, TooltipModule, ToastModule, DialogModule, DividerModule, IconFieldModule, InputIconModule, InputTextModule, ConfirmDialogModule],
    providers: [MessageService, ConfirmationService]
})
export class DespacharSolicitudesComponent implements OnInit {
    solicitudes: SolicitudMaterialResponse[] = [];
    loading = true;
    procesando = false;
    solicitudSeleccionada: SolicitudMaterialResponse | null = null;
    dialogDetalleVisible = false;

    constructor(
        private solicitudService: SolicitudMaterialService,
        private messageService: MessageService,
        private confirmationService: ConfirmationService,
        private cdr: ChangeDetectorRef,
        private ngZone: NgZone
    ) {}

    ngOnInit() {
        this.cargarAprobadas();
    }

    cargarAprobadas() {
        this.loading = true;
        this.solicitudService.listarPorEstado(EstadoSolicitud.APROBADA).subscribe({
            next: (response) => {
                this.ngZone.run(() => {
                    this.solicitudes = [...response];
                    this.loading = false;
                    this.cdr.detectChanges();
                });
            },
            error: () => {
                this.ngZone.run(() => {
                    this.loading = false;
                    this.toast('error', 'Error al cargar solicitudes aprobadas');
                    this.cdr.detectChanges();
                });
            }
        });
    }

    verDetalle(solicitud: SolicitudMaterialResponse) {
        this.solicitudSeleccionada = solicitud;
        this.dialogDetalleVisible = true;
    }

    confirmarEntrega(solicitud: SolicitudMaterialResponse) {
        this.confirmationService.confirm({
            message: `¿Confirmar entrega de materiales para la solicitud #${solicitud.idSolicitud}?`,
            header: 'Confirmar entrega',
            icon: 'pi pi-box',
            acceptLabel: 'Sí, entregar',
            rejectLabel: 'Cancelar',
            acceptButtonStyleClass: 'p-button-success',
            accept: () => this.entregar(solicitud)
        });
    }

    entregar(solicitud: SolicitudMaterialResponse) {
        this.procesando = true;

        this.solicitudService.entregarSolicitud(solicitud.idSolicitud).subscribe({
            next: () => {
                this.procesando = false;
                this.solicitudes = this.solicitudes.filter((s) => s.idSolicitud !== solicitud.idSolicitud);
                this.dialogDetalleVisible = false;
                this.toast('success', `Solicitud #${solicitud.idSolicitud} entregada`);
            },
            error: () => {
                this.procesando = false;
                this.toast('error', 'Error al registrar la entrega');
            }
        });
    }

    private toast(severity: string, detail: string) {
        this.messageService.add({ severity, detail, life: 3000 });
    }
}
