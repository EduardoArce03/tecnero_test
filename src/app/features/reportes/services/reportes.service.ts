import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@/environments/environment.dev';

// Definimos la interfaz de la respuesta para que TypeScript nos ayude
export interface PdfResponse {
    url: string;
}

@Injectable({
    providedIn: 'root'
})
export class ReportesPdfService {
    private http = inject(HttpClient);

    // URL base apuntando a tu controlador
    private apiUrl = `${environment.apiUrl}/api/reportes-pdf`;

    /**
     * Genera el reporte de Kardex para un material en un rango de fechas.
     * @param materialId UUID del material
     * @param fechaInicio Formato YYYY-MM-DD
     * @param fechaFin Formato YYYY-MM-DD
     */
    generarKardexPdf(materialId: string, fechaInicio: string, fechaFin: string): Observable<PdfResponse> {
        const params = new HttpParams().set('fechaInicio', fechaInicio).set('fechaFin', fechaFin);

        return this.http.get<PdfResponse>(`${this.apiUrl}/kardex/${materialId}`, { params });
    }

    /**
     * Genera el reporte de Stock Actual filtrado por el tipo de bodega.
     * @param tipoInventario 'PRODUCCION', 'EPPS' o 'MANTENIMIENTO'
     */
    generarStockActualPdf(tipoInventario: string): Observable<PdfResponse> {
        const params = new HttpParams().set('tipoInventario', tipoInventario);

        return this.http.get<PdfResponse>(`${this.apiUrl}/stock-actual`, { params });
    }
}
