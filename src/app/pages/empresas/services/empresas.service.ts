import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '@/environments/environment.dev';
import { Observable } from 'rxjs';
import { EmpresaResponse } from '@/app/pages/empresas/model/responses/empresa.response';

@Injectable({
    providedIn: 'root'
})
export class EmpresasService {

    private readonly apiUrl = environment.apiUrl + '/suscripciones';

    constructor(private http: HttpClient) {
    }

    getEmpresas():Observable<EmpresaResponse[]> {
        return this.http.get<EmpresaResponse[]>(`${this.apiUrl}/all`);
    }
}
