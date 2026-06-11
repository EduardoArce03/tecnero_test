// core/guards/role.guard.ts
import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '@/app/core/services/auth.service';

export const roleGuard: CanActivateFn = (route) => {
    const authService = inject(AuthService);
    const router = inject(Router);

    const rolesPermitidos: string[] = route.data['roles'] ?? [];
    const usuario = authService.getUsuario();

    if (!usuario) {
        router.navigate(['/auth/login']);
        return false;
    }

    if (rolesPermitidos.length > 0 && !authService.hasAnyRole(rolesPermitidos)) {
        router.navigate(['/unauthorized']);
        return false;
    }

    return true;
};
