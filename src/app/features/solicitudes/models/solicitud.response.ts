import { UsuarioResponse } from '@/app/pages/empresas/model/responses/usuario.response';
import { LineaProduccionResponse } from '@/app/features/lineas-produccion/models/linea-produccion.response';
import { MaterialResponse } from '@/app/features/materiales/models/material.response';

export interface SolicitudMaterialResponse {
    idSolicitud: string;
    usuarioResponse: UsuarioResponse;
    lineaProduccionResponse: LineaProduccionResponse;
    estadoSolicitud: EstadoSolicitud;
    observaciones: string;
    fechaAprobacion: string;
    aprobadoPor: UsuarioResponse | null;
    detalles: DetalleSolicitudResponse[];
    fechaSolicitud: string;
}

export interface DetalleSolicitudResponse {
    uuid: string;
    material: MaterialResponse;
    cantidadSolicitada: number;
    observacion: string;
}

export enum EstadoSolicitud {
    PENDIENTE = 'PENDIENTE',
    APROBADA = 'APROBADA',
    RECHAZADA = 'RECHAZADA',
    ENTREGADA = 'ENTREGADA'
}
