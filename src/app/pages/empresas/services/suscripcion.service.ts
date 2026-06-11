import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SuscripcionRequest } from '@/app/pages/empresas/model/requests/suscripcion.request';
import { environment } from '@/environments/environment.dev';

@Injectable({
    providedIn: 'root'
})
export class SuscripcionService {

    private readonly apiUrl = environment.apiUrl;

    constructor(private http: HttpClient) {
    }

    crearSuscripcion(request: SuscripcionRequest) {
        return this.http.post<SuscripcionRequest>(`${this.apiUrl}/venta`, request);
    }
}
