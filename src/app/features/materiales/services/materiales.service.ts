import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { MaterialRequest } from '@/app/features/materiales/models/material.request';
import { MaterialResponse } from '@/app/features/materiales/models/material.response';
import { environment } from '@/environments/environment.dev';
import { StockUpdateRequest } from '@/app/features/materiales/models/stock-update.request';

@Injectable({
    providedIn: 'root'
})
export class MaterialesService {

    private readonly apiUrl = environment.apiUrl + '/api/materiales';

    constructor(private http: HttpClient) {
    }

    crearMaterial(request: MaterialRequest): Observable<MaterialResponse> {
        return this.http.post<MaterialResponse>(`${this.apiUrl}`, request);
    }

    actualizar(uuid: string, request: MaterialRequest): Observable<MaterialResponse> {
        return this.http.put<MaterialResponse>(`${this.apiUrl}/${uuid}`, request);
    }

    actualizarStock(uuid: string, request: StockUpdateRequest): Observable<MaterialResponse> {
        return this.http.patch<MaterialResponse>(`${this.apiUrl}/${uuid}/stock`, request);
    }

    toggleActivo(uuid: string): Observable<void> {
        return this.http.patch<void>(`${this.apiUrl}/${uuid}/toggle`, {});
    }

    listarActivos(): Observable<MaterialResponse[]> {
        return this.http.get<MaterialResponse[]>(`${this.apiUrl}`);
    }

    listarPorLineaProduccion(lineaProduccionUuid: string): Observable<MaterialResponse[]> {
        return this.http.get<MaterialResponse[]>(`${this.apiUrl}/linea-produccion/${lineaProduccionUuid}`);
    }

    buscarPorUuid(uuid: string): Observable<MaterialResponse> {
        return this.http.get<MaterialResponse>(`${this.apiUrl}/${uuid}`);
    }

    listarPorTipoInventario(tipo: string): Observable<MaterialResponse[]> {
        return this.http.get<MaterialResponse[]>(`${this.apiUrl}/tipo-inventario/${tipo}`);
    }
}
