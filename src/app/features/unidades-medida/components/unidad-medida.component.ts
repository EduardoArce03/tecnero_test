import { CommonModule } from '@angular/common';
import { Component, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { UnidadMedidaService } from '@/app/features/unidades-medida/services/unidad-medida.service';
import { UnidadMedidaResponse } from '@/app/features/unidades-medida/models/unidad-medida.response';
import { TableModule } from 'primeng/table';
import { Tag } from 'primeng/tag';
import { Button } from 'primeng/button';
import { Tooltip } from 'primeng/tooltip';
import { InputText } from 'primeng/inputtext';
import { Dialog } from 'primeng/dialog';
import { MessageService } from 'primeng/api';
import { Toast } from 'primeng/toast';

@Component({
    selector: 'app-unidad-medida',
    templateUrl: './unidad-medida.component.html',
    styleUrls: ['./unidad-medida.component.scss'],
    providers: [MessageService],
    imports: [CommonModule, FormsModule, TableModule, Tag, Button, Tooltip, InputText, Dialog, Toast]
})
export class UnidadMedidaComponent implements OnInit {
    unidadesMedida: UnidadMedidaResponse[] = [];
    loading = signal(false);

    // Dialog crear
    dialogVisible = signal(false);
    nombre = '';
    guardando = signal(false);

    constructor(
        private unidadMedidaService: UnidadMedidaService,
        private messageService: MessageService
    ) {}

    ngOnInit(): void {
        this.cargarUnidades();
    }

    abrirDialogCrear(): void {
        this.nombre = '';
        this.dialogVisible.set(true);
    }

    cerrarDialog(): void {
        this.dialogVisible.set(false);
        this.nombre = '';
    }

    cargarUnidades(): void {
        this.loading.set(true);
        this.unidadMedidaService.listarUnidadesMedida().subscribe({
            next: (response) => {
                this.unidadesMedida = response;
                this.loading.set(false);
            },
            error: () => {
                this.loading.set(false);
                this.messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'No se pudieron cargar las unidades de medida.'
                });
            }
        });
    }

    crearUnidadMedida(): void {
        if (!this.nombre.trim()) return;
        this.guardando.set(true);
        this.unidadMedidaService.crearUnidadMedida(this.nombre.trim()).subscribe({
            next: (response) => {
                this.unidadesMedida = [...this.unidadesMedida, response];
                this.guardando.set(false);
                this.cerrarDialog();
                this.messageService.add({
                    severity: 'success',
                    summary: 'Creada',
                    detail: `Unidad "${response.nombre}" registrada correctamente.`
                });
            },
            error: () => {
                this.guardando.set(false);
                this.messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'No se pudo crear la unidad de medida.'
                });
            }
        });
    }

    toggleActivo(um: UnidadMedidaResponse): void {
        this.unidadMedidaService.toggleActivo(um.uuid).subscribe({
            next: (response) => {
                const idx = this.unidadesMedida.findIndex((u) => u.uuid === um.uuid);
                if (idx !== -1) {
                    this.unidadesMedida = [...this.unidadesMedida.slice(0, idx), response, ...this.unidadesMedida.slice(idx + 1)];
                }
                this.messageService.add({
                    severity: response.activo ? 'success' : 'warn',
                    summary: response.activo ? 'Activada' : 'Desactivada',
                    detail: `"${response.nombre}" ${response.activo ? 'está activa' : 'fue desactivada'}.`
                });
            },
            error: () => {
                this.messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'No se pudo cambiar el estado.'
                });
            }
        });
    }
}
