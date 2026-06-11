import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@/environments/environment.dev';
import { EstadoSolicitud, SolicitudMaterialResponse } from '@/app/features/solicitudes/models/solicitud.response';
import { SolicitudRequest } from '@/app/features/solicitudes/models/solicitud.request';

@Injectable({
    providedIn: 'root'
})
export class SolicitudMaterialService {
    private readonly apiUrl = environment.apiUrl + '/api/solicitudes-material';

    constructor(private http: HttpClient) {}

    // Ya no necesita el userId en la URL porque el backend lo saca del token con @CurrentUserId
    crearSolicitud(request: SolicitudRequest): Observable<SolicitudMaterialResponse> {
        return this.http.post<SolicitudMaterialResponse>(`${this.apiUrl}`, request);
    }

    // Limpiado el fragmento /usuario/{userId}
    aprobarSolicitud(solicitudId: string): Observable<SolicitudMaterialResponse> {
        return this.http.put<SolicitudMaterialResponse>(`${this.apiUrl}/${solicitudId}/aprobar`, {});
    }

    // Limpiado el fragmento /usuario/{userId}
    rechazarSolicitud(solicitudId: string): Observable<SolicitudMaterialResponse> {
        return this.http.put<SolicitudMaterialResponse>(`${this.apiUrl}/${solicitudId}/rechazar`, {});
    }

    entregarSolicitud(solicitudId: string): Observable<SolicitudMaterialResponse> {
        return this.http.put<SolicitudMaterialResponse>(`${this.apiUrl}/${solicitudId}/entregar`, {});
    }

    listarPorEstado(estado: EstadoSolicitud): Observable<SolicitudMaterialResponse[]> {
        return this.http.get<SolicitudMaterialResponse[]>(`${this.apiUrl}/estado/${estado}`);
    }

    listarPorSolicitante(username: string): Observable<SolicitudMaterialResponse[]> {
        return this.http.get<SolicitudMaterialResponse[]>(`${this.apiUrl}/solicitante/${username}`);
    }
}
