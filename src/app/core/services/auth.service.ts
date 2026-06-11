import { HttpClient, HttpParams, HttpResponse } from '@angular/common/http';
import { BehaviorSubject, catchError, Observable, tap, throwError } from 'rxjs';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { RegisterRequest } from '@/app/core/models/requests/register.model';
import { environment } from '@/environments/environment.dev';
import { LoginResponse } from '@/app/core/models/responses/loginresponse.model';
import { CompleteChallengeRequest } from '@/app/core/models/requests/complete-challenge-request.model';

export interface UsuarioActual {
    userId: string;
    nombre: string;
    apellido: string;
    correo: string;
    username: string;
    role: 'SOLICITANTE' | 'COORDINADOR' | 'BODEGUERO';
}

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private tokenKey = environment.jwtTokenKey;
    private tokenRefreshKey = environment.jwtRefreshTokenKey;
    private apiUrl = environment.apiUrl;
    public doctorId: string = '';

    private isAuthenticatedSubject = new BehaviorSubject<boolean>(this.hasToken());
    private isAuthenticated = this.isAuthenticatedSubject.asObservable();

    // 👇 nuevo
    private _usuarioActual$ = new BehaviorSubject<UsuarioActual | null>(null);
    usuarioActual$ = this._usuarioActual$.asObservable();

    constructor(
        private http: HttpClient,
        private router: Router
    ) {}

    login(credentials: { username: string; password: string }): Observable<LoginResponse> {
        return this.http.post(`${this.apiUrl}/usuarios/login`, credentials).pipe(
            tap((response: any) => {
                console.log('Respuesta completa del login:', response);
                if (response && response.accessToken && response.refreshToken) {
                    this.setTokens(response.accessToken, response.refreshToken);
                    this.isAuthenticatedSubject.next(true);
                } else {
                    console.error('No se encontraron token/refreshToken en la respuesta');
                }
            })
        );
    }

    // 👇 nuevo — llámalo justo después del login exitoso
    cargarUsuarioActual(): Observable<UsuarioActual> {
        return this.http.get<UsuarioActual>(`${this.apiUrl}/usuarios/me`).pipe(tap((usuario) => this._usuarioActual$.next(usuario)));
    }

    getUsuario(): UsuarioActual | null {
        return this._usuarioActual$.getValue();
    }

    getRole(): string | null {
        return this._usuarioActual$.getValue()?.role ?? null;
    }

    hasRole(role: string): boolean {
        return this.getRole() === role;
    }

    hasAnyRole(roles: string[]): boolean {
        return roles.includes(this.getRole() ?? '');
    }

    logout(): void {
        this.removeToken();
        this._usuarioActual$.next(null); // 👈 limpiar usuario al salir
        this.isAuthenticatedSubject.next(false);
        this.router.navigate(['/auth/login']);
    }

    private hasToken(): boolean {
        return !!localStorage.getItem(this.tokenKey);
    }

    private setTokens(access: string, refresh: string): void {
        localStorage.setItem(environment.jwtTokenKey, access);
        localStorage.setItem(environment.jwtRefreshTokenKey, refresh);
        console.log('Guardado access (confirm):', localStorage.getItem(environment.jwtTokenKey));
    }

    private getToken(): string | null {
        return localStorage.getItem(this.tokenKey);
    }

    private getRefreshToken(): string | null {
        return localStorage.getItem(this.tokenRefreshKey);
    }

    private removeToken(): void {
        localStorage.removeItem(this.tokenKey);
        localStorage.removeItem(this.tokenRefreshKey);
    }

    refreshToken(): Observable<any> {
        const refresh = this.getRefreshToken();
        if (!refresh) {
            this.logout();
            return throwError(() => new Error('No refresh token available'));
        }

        return this.http.post(`${environment.apiUrl}/usuarios/refresh`, { token: refresh }, { observe: 'response' }).pipe(
            tap((response: any) => {
                console.log(response);
                if (response?.body?.accessToken && response?.body?.refreshToken) {
                    this.setTokens(response.body.accessToken, response.body.refreshToken);
                    this.isAuthenticatedSubject.next(true);
                }
            }),
            catchError((error) => {
                console.error('Error refreshing token:', error);
                this.logout();
                return throwError(() => error);
            })
        );
    }

    getAccessToken(): string | null {
        return this.getToken();
    }
}
