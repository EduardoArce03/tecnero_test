import { AfterViewInit, ChangeDetectorRef, Component, NgZone, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LineaProduccionService } from '@/app/features/lineas-produccion/services/linea-produccion.service';
import { LineaProduccion, LineaProduccionRequest } from '@/app/features/lineas-produccion/models/linea-produccion.model';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { TagModule } from 'primeng/tag';
import { ToastModule } from 'primeng/toast';
import { TooltipModule } from 'primeng/tooltip';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { MessageService } from 'primeng/api';

@Component({
    selector: 'app-lineas-produccion',
    templateUrl: './lineas-produccion.component.html',
    styleUrls: ['./lineas-produccion.component.scss'],
    imports: [CommonModule, ReactiveFormsModule, TableModule, ButtonModule, DialogModule, InputTextModule, TextareaModule, TagModule, ToastModule, TooltipModule, IconFieldModule, InputIconModule],
    providers: [MessageService]
})
export class LineasProduccionComponent implements OnInit {
    lineasProduccion: LineaProduccion[] = [];
    loading = false;
    guardando = false;
    dialogVisible = false;
    editando = false;
    uuidEditando: string | null = null;
    form: FormGroup;

    constructor(
        private lineaProduccionService: LineaProduccionService,
        private messageService: MessageService,
        private fb: FormBuilder,
        private cdr: ChangeDetectorRef, // 2. Inyectar ChangeDetectorRef
        private ngZone: NgZone // 3. Inyectar NgZone
    ) {
        this.form = this.fb.group({
            nombre: ['', Validators.required],
            descripcion: ['']
        });
    }

    ngOnInit() {
        this.cargarLineas();
    }

    cargarLineas() {
        console.log('Iniciando carga...');
        this.loading = true;

        // Forzamos un ciclo para que la tabla pinte el estado de carga inicial sin romper Angular
        this.cdr.detectChanges();

        this.lineaProduccionService.listarTodas().subscribe({
            next: (response) => {
                console.log('Data recibida en componente:', response);

                // Forzamos a Angular a procesar la respuesta dentro de su zona segura
                this.ngZone.run(() => {
                    this.lineasProduccion = [...response]; // Clonamos el array (rompe referencia)
                    this.loading = false;

                    // Le decimos a Angular: "Ey, renderiza esto YA"
                    this.cdr.detectChanges();
                });
            },
            error: (err) => {
                console.error('Error en componente:', err);
                this.ngZone.run(() => {
                    this.loading = false;
                    this.toast('error', 'Error al cargar líneas de producción');
                    this.cdr.detectChanges();
                });
            }
        });
    }

    abrirDialogCrear() {
        this.editando = false;
        this.uuidEditando = null;
        this.form.reset();
        this.dialogVisible = true;
    }

    abrirDialogEditar(linea: LineaProduccion) {
        this.editando = true;
        this.uuidEditando = linea.uuid;
        this.form.patchValue({ nombre: linea.nombre, descripcion: linea.descripcion });
        this.dialogVisible = true;
    }

    cerrarDialog() {
        this.dialogVisible = false;
        this.form.reset();
    }

    guardar() {
        if (this.form.invalid) return;
        this.guardando = true;

        const request: LineaProduccionRequest = this.form.value;
        const op$ = this.editando && this.uuidEditando ? this.lineaProduccionService.actualizar(this.uuidEditando, request) : this.lineaProduccionService.crear(request);

        op$.subscribe({
            next: () => {
                this.guardando = false;
                this.cerrarDialog();
                this.cargarLineas();
                this.toast('success', this.editando ? 'Línea actualizada' : 'Línea creada');
            },
            error: () => {
                this.guardando = false;
                this.toast('error', 'Ocurrió un error, intenta nuevamente');
            }
        });
    }

    toggleActivo(linea: LineaProduccion) {
        this.lineaProduccionService.toggleActivo(linea.uuid).subscribe({
            next: () => {
                this.cargarLineas();
                this.toast('success', `Línea ${linea.activo ? 'desactivada' : 'activada'}`);
            },
            error: () => this.toast('error', 'Error al cambiar estado')
        });
    }

    private toast(severity: string, detail: string) {
        this.messageService.add({ severity, detail, life: 3000 });
    }
}
