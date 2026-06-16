import { afterNextRender, ChangeDetectorRef, Component, inject, NgZone, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MaterialesService } from '@/app/features/materiales/services/materiales.service';
import { LineaProduccionService } from '@/app/features/lineas-produccion/services/linea-produccion.service';
import { MaterialResponse } from '@/app/features/materiales/models/material.response';
import { MaterialRequest } from '@/app/features/materiales/models/material.request';
import { LineaProduccion } from '@/app/features/lineas-produccion/models/linea-produccion.model';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { DrawerModule } from 'primeng/drawer';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { SelectModule } from 'primeng/select';
import { CheckboxModule } from 'primeng/checkbox';
import { TagModule } from 'primeng/tag';
import { ToastModule } from 'primeng/toast';
import { TooltipModule } from 'primeng/tooltip';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputNumberModule } from 'primeng/inputnumber';
import { MessageService } from 'primeng/api';
import { FormsModule } from '@angular/forms';
import { UnidadMedidaResponse } from '@/app/features/unidades-medida/models/unidad-medida.response';
import { UnidadMedidaService } from '@/app/features/unidades-medida/services/unidad-medida.service';
import { StockUpdateRequest } from '@/app/features/materiales/models/stock-update.request';
import { Dialog } from 'primeng/dialog';
import { AuthService } from '@/app/core/services/auth.service';


@Component({
    selector: 'app-materiales',
    templateUrl: './materiales.component.html',
    styleUrls: ['./materiales.component.scss'],
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        TableModule,
        ButtonModule,
        DrawerModule,
        InputTextModule,
        TextareaModule,
        SelectModule,
        CheckboxModule,
        TagModule,
        ToastModule,
        TooltipModule,
        IconFieldModule,
        InputIconModule,
        InputNumberModule,
        Dialog
    ],
    providers: [MessageService]
})
export class MaterialesComponent implements OnInit {
    materiales: MaterialResponse[] = [];
    lineas: LineaProduccion[] = [];
    unidadesMedida: UnidadMedidaResponse[] = [];
    authService = inject(AuthService);

    loading = false;
    guardando = false;
    drawerVisible = false;
    editando = false;
    uuidEditando: string | null = null;

    lineasSeleccionadas: string[] = [];

    form: FormGroup;
    dialogStockVisible = false;
    materialParaStock: MaterialResponse | null = null;
    formStock: FormGroup;
    guardandoStock = false;
    rol: string = '';

    protected tiposInventario = [
        { label: 'Producción', value: 'PRODUCCION' },
        { label: 'EPPs', value: 'EPPS' },
        { label: 'Mantenimiento', value: 'MANTENIMIENTO' }
    ];

    constructor(
        private materialesService: MaterialesService,
        private lineaService: LineaProduccionService,
        private unidadMedidaService: UnidadMedidaService,
        private messageService: MessageService,
        private fb: FormBuilder,
        private cdr: ChangeDetectorRef,
        private ngZone: NgZone
    ) {
        this.form = this.fb.group({
            codigo: ['', Validators.required],
            nombre: ['', Validators.required],
            descripcion: [''],
            unidadMedidaId: ['', Validators.required],
            categoria: ['', Validators.required],
            cantidadMinima: [0, [Validators.required, Validators.min(0)]],
            tipoInventario: ['', Validators.required]
        });

        this.formStock = this.fb.group({
            cantidad: [null, [Validators.required, Validators.min(-999999)]], // Permite negativos para salidas
            observacion: ['', Validators.required]
        });

        afterNextRender(() => {
            this.cargarMateriales();
        });
    }

    cargarUnidadesMedida() {
        this.unidadMedidaService.listarUnidadesMedida().subscribe({
            next: (response) => {
                this.unidadesMedida = response;
            },
            error: () => {
                this.toast('error', 'Error al cargar unidades de medida');
            }
        });
    }

    ngOnInit() {
        //this.cargarMateriales();
        this.cargarLineas();
        this.cargarUnidadesMedida();
        this.rol = this.authService.getRole() || '';
    }

    cargarMateriales() {
        this.loading = true;
        this.cdr.detectChanges();

        this.materialesService.listarActivos().subscribe({
            next: (response) => {
                this.ngZone.run(() => {
                    this.materiales = [...response];
                    this.loading = false;
                    this.cdr.detectChanges();
                });
            },
            error: (err) => {
                console.error('Error:', err);
                this.ngZone.run(() => {
                    this.loading = false;
                    this.toast('error', 'Error al cargar materiales');
                    this.cdr.detectChanges();
                });
            }
        });
    }

    cargarLineas() {
        this.lineaService.listarTodas().subscribe({
            next: (response) => (this.lineas = response)
        });
    }

    abrirDrawerCrear() {
        this.editando = false;
        this.uuidEditando = null;
        this.lineasSeleccionadas = [];
        this.form.reset({ cantidadMinima: 0 });
        this.drawerVisible = true;
    }

    abrirDrawerEditar(material: MaterialResponse) {
        this.editando = true;
        this.uuidEditando = material.uuid;
        this.lineasSeleccionadas = material.lineas?.map((l) => l.uuid) ?? [];
        this.form.patchValue({
            codigo: material.codigo,
            nombre: material.nombre,
            descripcion: material.descripcion,
            unidadMedidaId: material.unidadMedida.uuid,
            categoria: material.categoria,
            cantidadMinima: material.cantidadMinimaStock,
            tipoInventario: material.tipoInventario
        });
        this.drawerVisible = true;
    }

    cerrarDrawer() {
        this.drawerVisible = false;
        this.form.reset({ cantidadMinima: 0 });
        this.lineasSeleccionadas = [];
    }

    guardar() {
        if (this.form.invalid) return;
        this.guardando = true;

        const request: MaterialRequest = {
            ...this.form.value,
            lineasProduccionIds: this.lineasSeleccionadas
        };

        const op$ = this.editando && this.uuidEditando ? this.materialesService.actualizar(this.uuidEditando, request) : this.materialesService.crearMaterial(request);

        op$.subscribe({
            next: () => {
                this.guardando = false;
                this.cerrarDrawer();
                this.cargarMateriales();
                this.toast('success', this.editando ? 'Material actualizado' : 'Material creado');
            },
            error: () => {
                this.guardando = false;
                this.toast('error', 'Ocurrió un error, intenta nuevamente');
            }
        });
    }

    toggleActivo(material: MaterialResponse) {
        this.materialesService.toggleActivo(material.uuid).subscribe({
            next: () => {
                this.cargarMateriales();
                this.toast('success', `Material ${material.activo ? 'desactivado' : 'activado'}`);
            },
            error: () => this.toast('error', 'Error al cambiar estado')
        });
    }

    toggleLineaSeleccionada(uuid: string) {
        if (this.lineasSeleccionadas.includes(uuid)) {
            this.lineasSeleccionadas = this.lineasSeleccionadas.filter((id) => id !== uuid);
        } else {
            this.lineasSeleccionadas = [...this.lineasSeleccionadas, uuid];
        }
    }

    isLineaSeleccionada(uuid: string): boolean {
        return this.lineasSeleccionadas.includes(uuid);
    }

    abrirDialogStock(material: MaterialResponse) {
        this.materialParaStock = material;
        this.formStock.reset({ cantidad: null });
        this.dialogStockVisible = true;
    }

    cerrarDialogStock() {
        this.dialogStockVisible = false;
        this.materialParaStock = null;
        this.formStock.reset();
    }

    guardarStock() {
        if (this.formStock.invalid || !this.materialParaStock) return;

        this.guardandoStock = true;

        const request: StockUpdateRequest = {
            cantidad: this.formStock.value.cantidad,
            observacion: this.formStock.value.observacion
        };

        this.materialesService.actualizarStock(this.materialParaStock.uuid, request).subscribe({
            next: () => {
                this.guardandoStock = false;
                this.cerrarDialogStock();
                this.cargarMateriales(); // Recargamos para ver el nuevo stock
                this.toast('success', 'Stock actualizado correctamente');
            },
            error: (err) => {
                this.guardandoStock = false;
                // Si el backend manda un mensaje de error detallado, lo mostramos
                const mensajeError = err?.error?.message || 'Error al actualizar el stock';
                this.toast('error', mensajeError);
            }
        });
    }

    getInventarioSeverity(tipo: string): 'success' | 'info' | 'warn' | 'danger' | 'secondary' {
        switch (tipo) {
            case 'PRODUCCION':
                return 'info';
            case 'EPPS':
                return 'warn';
            case 'MANTENIMIENTO':
                return 'secondary';
            default:
                return 'info';
        }
    }

    private toast(severity: string, detail: string) {
        this.messageService.add({ severity, detail, life: 3000 });
    }
}
