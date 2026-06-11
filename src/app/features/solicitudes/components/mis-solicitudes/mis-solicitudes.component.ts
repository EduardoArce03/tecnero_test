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
import { MessageService } from 'primeng/api';
import { RouterLink } from '@angular/router';

@Component({
    selector: 'app-mis-solicitudes',
    templateUrl: './mis-solicitudes.component.html',
    styleUrls: ['./mis-solicitudes.component.scss'],
    imports: [CommonModule, TableModule, TagModule, ButtonModule, TooltipModule, ToastModule, DialogModule, DividerModule, IconFieldModule, InputIconModule, InputTextModule, RouterLink],
    providers: [MessageService]
})
export class MisSolicitudesComponent implements OnInit {
    solicitudes: SolicitudMaterialResponse[] = [];
    loading = true;
    solicitudSeleccionada: SolicitudMaterialResponse | null = null;
    dialogVisible = false;

    constructor(
        private solicitudService: SolicitudMaterialService,
        private authService: AuthService,
        private messageService: MessageService,
        private cdr: ChangeDetectorRef,
        private ngZone: NgZone
    ) {}

    ngOnInit() {
        this.cargarSolicitudes();
    }

    cargarSolicitudes() {
        this.loading = true;
        const usuario = this.authService.getUsuario();
        if (!usuario) {
            this.loading = false;
            return;
        }

        this.solicitudService.listarPorSolicitante(usuario.username).subscribe({
            next: (response) => {
                this.ngZone.run(() => {
                    this.solicitudes = [...response];
                    this.loading = false;
                    this.cdr.detectChanges();
                });
            },
            error: () => {
                this.loading = false;
                this.messageService.add({ severity: 'error', detail: 'Error al cargar solicitudes', life: 3000 });
                this.cdr.detectChanges(); // También aquí por si el error cambia estados síncronos
            }
        });
    }

    verDetalle(solicitud: SolicitudMaterialResponse) {
        this.solicitudSeleccionada = solicitud;
        this.dialogVisible = true;
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

    getEstadoIcon(estado: EstadoSolicitud): string {
        switch (estado) {
            case EstadoSolicitud.PENDIENTE:
                return 'pi pi-clock';
            case EstadoSolicitud.APROBADA:
                return 'pi pi-check-circle';
            case EstadoSolicitud.RECHAZADA:
                return 'pi pi-times-circle';
            case EstadoSolicitud.ENTREGADA:
                return 'pi pi-box';
            default:
                return 'pi pi-circle';
        }
    }
}
