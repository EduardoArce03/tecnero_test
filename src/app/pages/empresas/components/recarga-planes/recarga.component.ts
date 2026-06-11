import { Component, OnInit } from '@angular/core';
import { PlanService } from '@/app/pages/empresas/services/plan.service';
import { NgClass } from '@angular/common';
import { SelectButton } from 'primeng/selectbutton';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Button, ButtonDirective } from 'primeng/button';
import { Ripple } from 'primeng/ripple';
import { PlanResponse } from '@/app/pages/empresas/model/responses/plan.response';
import { Select } from 'primeng/select';
import { EmpresaResponse } from '@/app/pages/empresas/model/responses/empresa.response';
import { EmpresasService } from '@/app/pages/empresas/services/empresas.service';
import { Toast } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { SuscripcionService } from '@/app/pages/empresas/services/suscripcion.service';
import { Divider } from 'primeng/divider';
import { MultiSelect } from 'primeng/multiselect';

@Component({
    selector: 'app-recarga',
    templateUrl: 'recarga.component.html',
    styleUrls: ['recarga.component.scss'],
    imports: [ SelectButton, FormsModule, Select, Button, Toast, ReactiveFormsModule],
    standalone: true,
    providers: [MessageService]
})
export class RecargaComponent implements OnInit {
    form: FormGroup;

    planesDisponibles: PlanResponse[] = [];
    empresas: EmpresaResponse[] = [];

    opcionesTiempo = [
        { label: 'Mensual', value: 'MENSUAL' },
        { label: 'Trimestral', value: 'TRIMESTRAL' },
        { label: 'Semestral', value: 'SEMESTRAL' },
        { label: 'Anual', value: 'ANUAL' }
    ];

    constructor(
        private planService: PlanService,
        private empresaService: EmpresasService,
        private messageService: MessageService,
        private suscripcionService: SuscripcionService
    ) {
        this.form = new FormGroup({
            accountId: new FormControl('', [Validators.required]),
            planId: new FormControl(null, [Validators.required]),
            tipoTiempoPlan: new FormControl('MENSUAL', [Validators.required])
        });
    }

    confirmarRecarga() {
        this.suscripcionService.crearSuscripcion(this.form.value).subscribe({
            next: (response) => {
                this.messageService.add({ severity: 'success', summary: 'Recarga Exitosa', detail: `La recarga del plan ha sido exitosa.` });
                this.form.reset({ tipoTiempoPlan: 'MENSUAL' });
            },
            error: (err) => {
                console.error('Error al recargar plan:', err);
                this.messageService.add({ severity: 'error', summary: 'Error en Recarga', detail: 'Ocurrió un error al recargar el plan. Intente nuevamente.' });
            }
        });
    }

    ngOnInit(): void {
        this.obtenerEmpresas();
        this.obtenerPlanes();
    }

    obtenerPlanes() {
        this.planService.obtenerPlanesActivos().subscribe({
            next: (response) => {
                this.planesDisponibles = response;
            },
            error: (err) => {
                console.error('Error al cargar planes:', err);
            }
        });
    }

    obtenerEmpresas() {
        this.empresaService.getEmpresas().subscribe({
            next: (response) => {
                this.empresas = response;
            },
            error: (err) => {
                console.error('Error al cargar empresas:', err);
            }
        });
    }
}
