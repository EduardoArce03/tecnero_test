export interface SolicitudRequest {
    lineaProduccionId: string;
    observaciones: string;
    detalles: DetalleSolicitudRequest[];
}

export interface DetalleSolicitudRequest {
    materialId: string;
    cantidadSolicitada: number;
    observacion: string;
}


