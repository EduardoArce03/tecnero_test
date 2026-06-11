import { Routes } from '@angular/router';
import { Documentation } from './documentation/documentation';
import { Crud } from './crud/crud';
import { Empty } from './empty/empty';
import { EmpresasComponent } from '@/app/pages/empresas/components/empresas-list/empresas.component';
import { RecargaComponent } from '@/app/pages/empresas/components/recarga-planes/recarga.component';
import { CrearPlanComponent } from '@/app/pages/empresas/components/crear-plan/crear-plan.component';
import { PlanListComponent } from '@/app/pages/empresas/components/plan-list/plan-list.component';
import { LineasProduccionComponent } from '@/app/features/lineas-produccion/components/lineas-produccion.component';
import { MaterialesComponent } from '@/app/features/materiales/components/materiales.component';
import { UnidadMedidaComponent } from '@/app/features/unidades-medida/components/unidad-medida.component';
import { roleGuard } from '@/app/core/guards/role.guard';
import { CrearSolicitudComponent } from '@/app/features/solicitudes/components/crear-solicitud/crear-solicitud.component';
import {
    MisSolicitudesComponent
} from '@/app/features/solicitudes/components/mis-solicitudes/mis-solicitudes.component';
import {
    AprobarSolicitudesComponent
} from '@/app/features/solicitudes/components/aprobar-solicitudes/aprobar-solicitudes.component';
import {
    DespacharSolicitudesComponent
} from '@/app/features/solicitudes/components/despechar-solicitud/despachar-solicitudes.component';
import { ReportesComponent } from '@/app/features/reportes/components/reportes.component';

export default [
    { path: 'documentation', component: Documentation },
    { path: 'crud', component: Crud },
    { path: 'empty', component: Empty },
    { path: 'empresas', component: EmpresasComponent },
    { path: 'recarga', component: RecargaComponent },
    { path: 'crear-plan', component: CrearPlanComponent },
    { path: 'plan-list', component: PlanListComponent },
    { path: 'linea-produccion', component: LineasProduccionComponent },
    { path: 'materiales', component: MaterialesComponent },
    { path: 'unidades-medida', component: UnidadMedidaComponent },
    { path: 'reportes', children: [
        {
            path: 'kardex',
            component: ReportesComponent,
            canActivate: [roleGuard],
            data: { roles: ['COORDINADOR', 'BODEGUERO'] }
        }
        ] },
    {
        path: 'solicitudes',
        children: [
            {
                path: 'crear',
                component: CrearSolicitudComponent,
                canActivate: [roleGuard],
                data: { roles: ['COORDINADOR'] }
            },
            {
                path: 'mis-solicitudes',
                component: MisSolicitudesComponent,
                canActivate: [roleGuard],
                data: { roles: ['COORDINADOR'] }
            },
            {
                path: 'aprobar',
                component: AprobarSolicitudesComponent,
                canActivate: [roleGuard],
                data: { roles: ['COORDINADOR'] }
            },
            {
                path: 'despachar',
                component: DespacharSolicitudesComponent,
                canActivate: [roleGuard],
                data: { roles: ['BODEGUERO'] }
            },
        ]
    },
    { path: '**', redirectTo: '/notfound' }
] as Routes;
