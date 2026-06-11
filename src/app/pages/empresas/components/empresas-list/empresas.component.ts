import { Component, OnInit, ChangeDetectorRef, ViewChild } from '@angular/core'; // 1. Importa ChangeDetectorRef
import { EmpresasService } from '@/app/pages/empresas/services/empresas.service';
import { EmpresaResponse } from '@/app/pages/empresas/model/responses/empresa.response';
import { Table, TableModule } from 'primeng/table';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { Tag } from 'primeng/tag';
import { ButtonDirective } from 'primeng/button';
import { Ripple } from 'primeng/ripple';
import { DatePipe } from '@angular/common';
import { Tooltip } from 'primeng/tooltip';
import { IconField } from 'primeng/iconfield';
import { InputIcon } from 'primeng/inputicon';
import { InputText } from 'primeng/inputtext'; // Asegúrate que sea ToastModule

@Component({
    selector: 'app-empresas',
    templateUrl: './empresas.component.html',
    styleUrls: ['./empresas.component.scss'],
    standalone: true,
    imports: [TableModule, ToastModule, Tag, ButtonDirective, Ripple, DatePipe, Tooltip, IconField, InputIcon, InputText], // Cambié Toast por ToastModule
    providers: [MessageService]
})
export class EmpresasComponent implements OnInit {
    @ViewChild('dt') dt!: Table;
    empresas: EmpresaResponse[] = [];

    constructor(
        private empresasService: EmpresasService,
        private messageService: MessageService,
        private cd: ChangeDetectorRef // 2. Inyecta el detector de cambios
    ) {}

    getEmpresas() {
        this.empresasService.getEmpresas().subscribe({
            next: (response) => {
                this.empresas = response;
                this.cd.detectChanges(); // 3. ¡ESTA ES LA CLAVE! Fuerza la actualización
            },
            error: (err) => {
                console.error('Error al obtener empresas:', err);
                this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudieron cargar las empresas' });
            }
        });
    }

    ngOnInit(): void {
        this.getEmpresas();
    }

    protected recargarPlan(empresa: any) {}

    protected editarEmpresa(empresa: any) {}

    protected getPlanSeverity(empresa: any) {
        return undefined;
    }

    protected nuevaEmpresa() {}

    onGlobalFilter(event: Event): void {
        const value = (event.target as HTMLInputElement).value;
        this.dt.filterGlobal(value, 'contains');
    }
}
