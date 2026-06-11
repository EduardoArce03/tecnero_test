import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { PlanService } from '@/app/pages/empresas/services/plan.service';
import { PlanResponse } from '@/app/pages/empresas/model/responses/plan.response';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { CurrencyPipe, NgFor } from '@angular/common';

@Component({
    selector: 'app-plan-list',
    template: `
        <p-table [value]="planes" [paginator]="true" [rows]="10" styleClass="p-datatable-gridlines p-datatable-striped">
            <ng-template pTemplate="header">
                <tr>
                    <th>Nombre</th>
                    <th>Precio</th>
                    <th>Features</th>
                </tr>
            </ng-template>
            <ng-template pTemplate="body" let-plan>
                <tr>
                    <td>
                        <span class="font-semibold">{{ plan.nombre }}</span>
                    </td>
                    <td>
                        <span class="text-primary font-bold">
                            {{ plan.precio | currency: 'USD' : 'symbol' : '1.2-2' }}
                        </span>
                    </td>
                    <td>
                        <div class="flex flex-wrap gap-2">
                            <p-tag *ngFor="let f of plan.features" [value]="f" severity="info" />
                        </div>
                    </td>
                </tr>
            </ng-template>
            <ng-template pTemplate="emptymessage">
                <tr>
                    <td colspan="3" class="text-center text-color-secondary py-4">No hay planes disponibles.</td>
                </tr>
            </ng-template>
        </p-table>
    `,
    styles: `
        :host {
            display: block;
        }
    `,
    imports: [TableModule, TagModule, CurrencyPipe, NgFor],
    standalone: true
})
export class PlanListComponent implements OnInit {
    planes: PlanResponse[] = [];

    constructor(
        private planService: PlanService,
        private cdr: ChangeDetectorRef
    ) {}

    obtenerPlanes() {
        this.planService.obtenerPlanesActivos().subscribe({
            next: (data) => {
                this.planes = data;
                this.cdr.detectChanges();
            },
            error: (err) => console.error('Error al obtener planes:', err)
        });
    }

    ngOnInit() {
        this.obtenerPlanes();
    }
}
