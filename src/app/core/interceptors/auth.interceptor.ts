import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, switchMap, throwError } from 'rxjs';
import { AuthService } from '@/app/core/services/auth.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
    const authService = inject(AuthService);
    const accessToken = authService.getAccessToken();

    let authReq = req;

    const isRefreshUrl = req.url.includes('/usuarios/refresh');
    const isPublicUrl = req.url.includes('/usuarios/login') || req.url.includes('/usuarios/register');

    if (accessToken && !isRefreshUrl && !isPublicUrl) {
        authReq = req.clone({
            setHeaders: { Authorization: `Bearer ${accessToken}` }
        });
    }

    return next(authReq).pipe(
        catchError((error) => {
            // Si es 401 y no es la URL de refresh, intentamos refrescar el token
            if (error.status === 401 && !isRefreshUrl) {
                return authService.refreshToken().pipe(
                    switchMap((response: any) => {
                        // Usamos directamente el token que devuelva el refresh en la respuesta
                        // o lo recuperamos del service si se guarda ahí internamente.
                        const newAccessToken = response?.accessToken || authService.getAccessToken();

                        if (newAccessToken) {
                            const newAuthReq = req.clone({
                                setHeaders: { Authorization: `Bearer ${newAccessToken}` }
                            });
                            // Reintentamos la petición original con el nuevo token
                            return next(newAuthReq);
                        }

                        // Si no hay token nuevo, deslogueamos
                        authService.logout();
                        return throwError(() => error);
                    }),
                    catchError((refreshError) => {
                        // Si el refresh token también falló (expiró), al login directo
                        authService.logout();
                        return throwError(() => refreshError);
                    })
                );
            }

            // Si es cualquier otro error (500, 404, 403), lo dejamos pasar al componente
            return throwError(() => error);
        })
    );
};
