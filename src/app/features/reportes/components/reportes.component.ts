import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MaterialesService } from '@/app/features/materiales/services/materiales.service';
import { MaterialResponse } from '@/app/features/materiales/models/material.response';
import { SelectModule } from 'primeng/select';
import { ButtonModule } from 'primeng/button';
import { DatePickerModule } from 'primeng/datepicker';
import { DividerModule } from 'primeng/divider';
import { ToastModule } from 'primeng/toast';
import { DialogModule } from 'primeng/dialog';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { MessageService } from 'primeng/api';
import { TipoInventario } from '@/app/features/materiales/models/material.request';
import { ReportesPdfService } from '@/app/features/reportes/services/reportes.service';
import { SafeUrlPipe } from '@/app/core/pipes/safe-url.pipe';

@Component({
    selector: 'app-reportes',
    templateUrl: './reportes.component.html',
    styleUrls: ['./reportes.component.scss'],
    imports: [CommonModule, FormsModule, SelectModule, ButtonModule, DatePickerModule, DividerModule, ToastModule, DialogModule, ProgressSpinnerModule, SafeUrlPipe],
    providers: [MessageService]
})
export class ReportesComponent implements OnInit {
    // opciones
    tiposInventario = [
        { label: 'Producción', value: TipoInventario.Produccion },
        { label: 'EPPs', value: TipoInventario.Epps },
        { label: 'Mantenimiento', value: TipoInventario.Mantenimiento }
    ];

    // selecciones kardex
    tipoSeleccionadoKardex: string | null = null;
    materialSeleccionado: MaterialResponse | null = null;
    fechaInicio: Date | null = null;
    fechaFin: Date | null = null;
    materiales: MaterialResponse[] = [];
    cargandoMateriales = false;

    // selecciones stock actual
    tipoSeleccionadoStock: string | null = null;

    // visor PDF
    pdfUrl: string | null = null;
    dialogVisible = false;
    generando = false;
    tituloReporte = '';

    constructor(
        private reportesService: ReportesPdfService,
        private materialesService: MaterialesService,
        private messageService: MessageService,
        private cdr: ChangeDetectorRef
    ) {}

    ngOnInit() {}

    // --- kardex ---

    onTipoKardexChange(tipo: string) {
        this.materialSeleccionado = null;
        this.materiales = [];
        this.cargandoMateriales = true;

        this.materialesService.listarPorTipoInventario(tipo).subscribe({
            next: (mats) => {
                this.materiales = mats;
                this.cargandoMateriales = false;
                this.cdr.detectChanges(); // 👈
            },
            error: () => {
                this.cargandoMateriales = false;
                this.cdr.detectChanges(); // 👈
                this.toast('error', 'Error al cargar materiales');
            }
        });
    }

    get puedeGenerarKardex(): boolean {
        return !!this.tipoSeleccionadoKardex && !!this.materialSeleccionado && !!this.fechaInicio && !!this.fechaFin;
    }

    generarKardex() {
        if (!this.puedeGenerarKardex) return;
        this.generando = true;

        const inicio = this.formatDate(this.fechaInicio!);
        const fin = this.formatDate(this.fechaFin!);

        this.reportesService.generarKardexPdf(this.materialSeleccionado!.uuid, inicio, fin).subscribe({
            next: (response) => {
                this.generando = false;
                this.pdfUrl = response.url;
                this.tituloReporte = `Kardex — ${this.materialSeleccionado!.nombre}`;
                this.dialogVisible = true;
                this.cdr.detectChanges();
            },
            error: () => {
                this.generando = false;
                this.toast('error', 'Error al generar el reporte');
            }
        });
    }

    // --- stock actual ---

    get puedeGenerarStock(): boolean {
        return !!this.tipoSeleccionadoStock;
    }

    generarStockActual() {
        if (!this.puedeGenerarStock) return;
        this.generando = true;

        this.reportesService.generarStockActualPdf(this.tipoSeleccionadoStock!).subscribe({
            next: (response) => {
                this.generando = false;
                this.pdfUrl = response.url;
                this.tituloReporte = `Stock Actual — ${this.tipoSeleccionadoStock}`;
                this.dialogVisible = true;
            },
            error: () => {
                this.generando = false;
                this.toast('error', 'Error al generar el reporte');
            }
        });
    }

    // --- visor ---

    descargarPdf() {
        if (!this.pdfUrl) return;
        const a = document.createElement('a');
        a.href = this.pdfUrl;
        a.target = '_blank';
        a.download = `${this.tituloReporte}.pdf`;
        a.click();
    }

    cerrarDialog() {
        this.dialogVisible = false;
        this.pdfUrl = null;
    }

    // --- helpers ---
    protected today: Date = new Date();

    private formatDate(date: Date): string {
        const y = date.getFullYear();
        const m = String(date.getMonth() + 1).padStart(2, '0');
        const d = String(date.getDate()).padStart(2, '0');
        return `${y}-${m}-${d}`;
    }

    private toast(severity: string, detail: string) {
        this.messageService.add({ severity, detail, life: 3000 });
    }
}
