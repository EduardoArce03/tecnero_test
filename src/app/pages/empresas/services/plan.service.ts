import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '@/environments/environment.dev';
import { Observable } from 'rxjs';
import { PlanResponse } from '@/app/pages/empresas/model/responses/plan.response';
import { PlanRequest } from '@/app/pages/empresas/model/requests/plan.request';

@Injectable({
    providedIn: 'root'
})
export class PlanService {

    private readonly apiUrl: string = environment.apiUrl + '/plan';

    constructor(private http: HttpClient) {
    }

    obtenerPlanesActivos(): Observable<PlanResponse[]> {
        return this.http.get<PlanResponse[]>(`${this.apiUrl}` );
    }

    crearPlan(request: PlanRequest): Observable<PlanResponse> {
        return this.http.post<PlanResponse>(`${this.apiUrl}`, request);
    }
}
