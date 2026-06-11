import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@/environments/environment.dev';
import { NotificacionResponse } from '@/app/features/notificaciones/models/notificacion.response';

@Injectable({
    providedIn: 'root'
})
export class NotificacionService {
    private readonly apiUrl = environment.apiUrl + '/api/notificaciones';

    constructor(private http: HttpClient) {}

    listarMisNotificaciones(): Observable<NotificacionResponse[]> {
        return this.http.get<NotificacionResponse[]>(`${this.apiUrl}`);
    }

    contarNoLeidas(): Observable<number> {
        return this.http.get<number>(`${this.apiUrl}/no-leidas/count`);
    }

    marcarComoLeida(uuid: string): Observable<void> {
        return this.http.patch<void>(`${this.apiUrl}/${uuid}/leer`, {});
    }

    marcarTodasComoLeidas(): Observable<void> {
        return this.http.patch<void>(`${this.apiUrl}/leer-todas`, {});
    }
}
