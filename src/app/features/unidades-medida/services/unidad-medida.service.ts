import { Injectable } from '@angular/core';
import { environment } from '@/environments/environment.dev';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UnidadMedidaResponse } from '@/app/features/unidades-medida/models/unidad-medida.response';

@Injectable({
    providedIn: 'root'
})
export class UnidadMedidaService {
    private readonly apiUrl = environment.apiUrl;

    constructor(private http: HttpClient) {}

    crearUnidadMedida(nombre: string): Observable<UnidadMedidaResponse> {
        return this.http.post<UnidadMedidaResponse>(`${this.apiUrl}/api/unidades-medida?nombre=${encodeURIComponent(nombre)}`, {});
    }

    listarUnidadesMedida(): Observable<UnidadMedidaResponse[]> {
        return this.http.get<UnidadMedidaResponse[]>(`${this.apiUrl}/api/unidades-medida`);
    }

    toggleActivo(id: number | string): Observable<UnidadMedidaResponse> {
        return this.http.patch<UnidadMedidaResponse>(`${this.apiUrl}/api/unidades-medida/${id}/toggle`, {});
    }
}
