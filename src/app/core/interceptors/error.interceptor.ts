import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { MessageService } from 'primeng/api';
import { catchError, throwError } from 'rxjs';
import { Router } from '@angular/router';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
    const messageService = inject(MessageService);
    const router = inject(Router);
    return next(req).pipe(
        catchError((error: HttpErrorResponse) => {
            const body = typeof error.error === 'string' ? JSON.parse(error.error) : error.error;

            if (body?.title && body?.message) {
                const { title, message, severity } = body;
                messageService.add({
                    severity: (severity ?? 'error').toLowerCase(),
                    summary: title,
                    detail: message,
                    life: 9000
                });
            } else {
                messageService.add({
                    severity: 'error',
                    summary: 'Error inesperado',
                    detail: 'Consulte a soporte tecnico',
                    life: 4000
                });
            }
            return throwError(() => error);
        })
    );
};
