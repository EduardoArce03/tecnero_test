import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { DashboardService, DashboardResponse } from '@/app/features/dashboard/services/dashboard.service';
import { AuthService } from '@/app/core/services/auth.service';
import { TagModule } from 'primeng/tag';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { SkeletonModule } from 'primeng/skeleton';

@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.scss'],
    imports: [CommonModule, RouterModule, TagModule, ButtonModule, TableModule, SkeletonModule]
})
export class DashboardComponent implements OnInit {
    data: DashboardResponse | null = null;
    loading = true;

    constructor(
        private dashboardService: DashboardService,
        private authService: AuthService,
        private cdr: ChangeDetectorRef
    ) {}

    ngOnInit() {
        this.dashboardService.getDashboard().subscribe({
            next: (response) => {
                this.data = response;
                this.loading = false;
                this.cdr.detectChanges();
            },
            error: () => {
                this.loading = false;
                this.cdr.detectChanges();
            }
        });
    }

    get usuario() {
        return this.authService.getUsuario();
    }

    getSeverity(estado: string): 'success' | 'warn' | 'danger' | 'info' | 'secondary' {
        switch (estado) {
            case 'PENDIENTE':
                return 'warn';
            case 'APROBADA':
                return 'success';
            case 'RECHAZADA':
                return 'danger';
            case 'ENTREGADA':
                return 'info';
            default:
                return 'secondary';
        }
    }

    getGreeting(): string {
        const hour = new Date().getHours();
        if (hour < 12) return 'Buenos días';
        if (hour < 18) return 'Buenas tardes';
        return 'Buenas noches';
    }
}
