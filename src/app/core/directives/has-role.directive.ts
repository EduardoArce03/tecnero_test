// core/directives/has-role.directive.ts
import { Directive, inject, Input, TemplateRef, ViewContainerRef } from '@angular/core';
import { AuthService } from '@/app/core/services/auth.service';

@Directive({
    selector: '[hasRole]',
    standalone: true
})
export class HasRoleDirective {
    private authService = inject(AuthService);
    private vcr = inject(ViewContainerRef);
    private tpl = inject(TemplateRef);

    @Input() set hasRole(roles: string | string[]) {
        this.vcr.clear();
        const rolesArray = Array.isArray(roles) ? roles : [roles];
        if (this.authService.hasAnyRole(rolesArray)) {
            this.vcr.createEmbeddedView(this.tpl);
        }
    }
}
