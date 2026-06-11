import { Component } from '@angular/core';
import { PlanService } from '@/app/pages/empresas/services/plan.service';
import { Feature, PlanRequest } from '@/app/pages/empresas/model/requests/plan.request';
import { MultiSelect } from 'primeng/multiselect';
import { FormsModule } from '@angular/forms';
import { Button } from 'primeng/button';
import { MessageService } from 'primeng/api';
import { Divider } from 'primeng/divider';
import { InputNumber } from 'primeng/inputnumber';
import { InputText } from 'primeng/inputtext';
import { Toast } from 'primeng/toast';

@Component({
    selector: 'app-crear-plan',
    templateUrl: './crear-plan.component.html',
    styleUrls: ['./crear-plan.component.scss'],
    imports: [MultiSelect, FormsModule, Button, InputNumber, InputText, Toast],
    standalone: true,
    providers: [MessageService]
})
export class CrearPlanComponent {
    featuresSeleccionadas: Feature[] = [];
    precio: number = 0;
    nombre: string = '';
    private planRequest!: PlanRequest;

    featuresOptions = Object.values(Feature).map((f) => ({
        label: f.replace(/_/g, ' '),
        value: f
    }));

    constructor(
        private planService: PlanService,
        private messageService: MessageService
    ) {}

    crearPlan() {
        this.planRequest = {
            nombre: this.nombre,
            precio: this.precio,
            features: this.featuresSeleccionadas
        };

        this.planService.crearPlan(this.planRequest).subscribe({
            next: (response) => {
                console.log('Plan creado exitosamente:', response);
                this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Plan creado exitosamente' });
            },
            error: (err) => {
                console.error('Error al crear el plan:', err);
                this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo crear el plan' });
            }
        });
    }
}
