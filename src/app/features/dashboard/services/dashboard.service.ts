import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@/environments/environment.dev';

export interface SolicitudResumen {
    idSolicitud: string;
    solicitante: string;
    lineaProduccion: string;
    estado: string;
    fechaSolicitud: string;
}

export interface DashboardResponse {
    solicitudesPendientes: number;
    solicitudesAprobadas: number;
    solicitudesEntregadas: number;
    solicitudesRechazadas: number;
    totalMateriales: number;
    materialesBajoStock: number;
    ultimasSolicitudes: SolicitudResumen[];
}

@Injectable({ providedIn: 'root' })
export class DashboardService {
    private http = inject(HttpClient);
    private url = `${environment.apiUrl}/api/dashboard`;

    getDashboard(): Observable<DashboardResponse> {
        return this.http.get<DashboardResponse>(this.url);
    }
}
