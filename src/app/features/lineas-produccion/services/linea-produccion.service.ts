import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@/environments/environment.dev';
import { LineaProduccion, LineaProduccionRequest } from '@/app/features/lineas-produccion/models/linea-produccion.model';

@Injectable({ providedIn: 'root' })
export class LineaProduccionService {
    private readonly url = `${environment.apiUrl}/lineas-produccion`;

    constructor(private http: HttpClient) {}

    listarTodas(): Observable<LineaProduccion[]> {
        return this.http.get<LineaProduccion[]>(`${this.url}/todas`);
    }

    crear(request: LineaProduccionRequest): Observable<LineaProduccion> {
        return this.http.post<LineaProduccion>(this.url, request);
    }

    actualizar(uuid: string, request: LineaProduccionRequest): Observable<LineaProduccion> {
        return this.http.put<LineaProduccion>(`${this.url}/${uuid}`, request);
    }

    toggleActivo(uuid: string): Observable<void> {
        return this.http.patch<void>(`${this.url}/${uuid}/toggle`, {});
    }
}
