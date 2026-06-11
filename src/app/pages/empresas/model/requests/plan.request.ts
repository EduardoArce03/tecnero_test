export interface PlanRequest {
    nombre: string;
    features: Feature[];
    precio: number;
}

export enum Feature {
    CAJA = 'CAJA',
    FACTURACION = 'FACTURACION',
    CALENDARIO_MEDICO = 'CALENDARIO_MEDICO',
    INVENTARIO = 'INVENTARIO',
    HORARIO_MEDICO = 'HORARIO_MEDICO',
    HISTORIAL_MEDICO = 'HISTORIAL_MEDICO',
    PACIENTES = 'PACIENTES',
    CITAS_MEDICAS = 'CITAS_MEDICAS',
    REPORTES = 'REPORTES',
}
