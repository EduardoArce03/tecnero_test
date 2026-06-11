import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { SolicitudMaterialService } from '@/app/features/solicitudes/services/solicitud-material.service';
import { MaterialesService } from '@/app/features/materiales/services/materiales.service';
import { LineaProduccionService } from '@/app/features/lineas-produccion/services/linea-produccion.service';
import { AuthService } from '@/app/core/services/auth.service';
import { SolicitudRequest, DetalleSolicitudRequest } from '@/app/features/solicitudes/models/solicitud.request';
import { MaterialResponse } from '@/app/features/materiales/models/material.response';
import { LineaProduccion } from '@/app/features/lineas-produccion/models/linea-produccion.model';
import { SelectModule } from 'primeng/select';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { TextareaModule } from 'primeng/textarea';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { ToastModule } from 'primeng/toast';
import { TooltipModule } from 'primeng/tooltip';
import { DividerModule } from 'primeng/divider';
import { MessageService } from 'primeng/api';
import { Router } from '@angular/router';

@Component({
    selector: 'app-crear-solicitud',
    templateUrl: './crear-solicitud.component.html',
    styleUrls: ['./crear-solicitud.component.scss'],
    imports: [CommonModule, FormsModule, ReactiveFormsModule, SelectModule, ButtonModule, InputTextModule, InputNumberModule, TextareaModule, TableModule, TagModule, ToastModule, TooltipModule, DividerModule],
    providers: [MessageService]
})
export class CrearSolicitudComponent implements OnInit {
    lineas: LineaProduccion[] = [];
    materiales: MaterialResponse[] = [];
    enviando = false;

    // 👈 Nueva lista para el dropdown de inventarios
    tiposInventario = [
        { label: 'Producción', value: 'PRODUCCION' },
        { label: 'EPPs', value: 'EPPS' },
        { label: 'Mantenimiento', value: 'MANTENIMIENTO' }
    ];

    // detalle temporal para agregar materiales
    materialSeleccionado: MaterialResponse | null = null;
    cantidadDetalle: number = 1;
    observacionDetalle: string = '';

    // lista de detalles acumulados
    detalles: (DetalleSolicitudRequest & { nombreMaterial: string; unidadMedida: string })[] = [];

    form: FormGroup;

    constructor(
        private fb: FormBuilder,
        private solicitudService: SolicitudMaterialService,
        private materialesService: MaterialesService,
        private lineaService: LineaProduccionService,
        private authService: AuthService,
        private messageService: MessageService,
        private router: Router
    ) {
        this.form = this.fb.group({
            lineaProduccionId: ['', Validators.required],
            tipoInventario: ['', Validators.required], // 👈 Nuevo validador
            observaciones: ['']
        });
    }

    ngOnInit() {
        this.cargarLineas();
    }

    cargarLineas() {
        this.lineaService.listarTodas().subscribe({
            next: (lineas) => (this.lineas = lineas)
        });
    }

    onInventarioChange(tipo: string) {
        this.materiales = [];

        // Evitamos mezclar peras con manzanas limpiando el carrito si cambian de bodega
        if (this.detalles.length > 0) {
            this.detalles = [];
            this.toast('info', 'El carrito se limpió porque cambiaste de bodega');
        }

        this.materialSeleccionado = null;

        this.materialesService.listarPorTipoInventario(tipo).subscribe({
            next: (materiales) => (this.materiales = materiales)
        });
    }

    agregarDetalle() {
        if (!this.materialSeleccionado || this.cantidadDetalle <= 0) return;

        const yaAgregado = this.detalles.find((d) => d.materialId === this.materialSeleccionado!.uuid);
        if (yaAgregado) {
            this.toast('warn', 'Este material ya fue agregado');
            return;
        }

        this.detalles.push({
            materialId: this.materialSeleccionado.uuid,
            cantidadSolicitada: this.cantidadDetalle,
            observacion: this.observacionDetalle,
            nombreMaterial: this.materialSeleccionado.nombre,
            unidadMedida: this.materialSeleccionado.unidadMedida.nombre
        });

        // limpiar campos detalle
        this.materialSeleccionado = null;
        this.cantidadDetalle = 1;
        this.observacionDetalle = '';
    }

    quitarDetalle(materialId: string) {
        this.detalles = this.detalles.filter((d) => d.materialId !== materialId);
    }

    enviarSolicitud() {
        if (this.form.invalid || this.detalles.length === 0) return;
        this.enviando = true;

        const usuario = this.authService.getUsuario();
        if (!usuario) return;

        const request: SolicitudRequest = {
            lineaProduccionId: this.form.value.lineaProduccionId,
            // 💡 Si en el backend tu DTO necesita el tipoInventario, agrégalo aquí
            observaciones: this.form.value.observaciones,
            detalles: this.detalles.map((d) => ({
                materialId: d.materialId,
                cantidadSolicitada: d.cantidadSolicitada,
                observacion: d.observacion
            }))
        };

        this.solicitudService.crearSolicitud(request).subscribe({
            next: () => {
                this.enviando = false;
                this.toast('success', 'Solicitud enviada correctamente');
                setTimeout(() => this.router.navigate(['/solicitudes/mis-solicitudes']), 1500);
            },
            error: () => {
                this.enviando = false;
                this.toast('error', 'Error al enviar la solicitud');
            }
        });
    }

    get puedeEnviar(): boolean {
        return this.form.valid && this.detalles.length > 0;
    }

    private toast(severity: string, detail: string) {
        this.messageService.add({ severity, detail, life: 3000 });
    }
}
