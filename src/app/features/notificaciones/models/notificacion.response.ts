
export interface NotificacionResponse {
    uuid: string;
    solicitudUuid: string;
    tipo: TipoNotificacion;
    mensaje: string;
    leida: boolean;
    fechaEnvio: string;
}

export enum TipoNotificacion {
    SOLICITUD_CREADA = 'SOLICITUD_CREADA',
    SOLICITUD_APROBADA = 'SOLICITUD_APROBADA',
    SOLICITUD_RECHAZADA = 'SOLICITUD_RECHAZADA',
    SOLICITUD_ENTREGADA = 'SOLICITUD_ENTREGADA'
}
