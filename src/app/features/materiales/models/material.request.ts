export interface MaterialRequest {
    codigo: string;
    unidadMedidaId: string;
    nombre: string;
    descripcion: string;
    categoria: string;
    cantidadMinima: number;
    tipoInventario: TipoInventario;
    lineasProduccionIds: string[];
}

export enum TipoInventario {
    Produccion = 'PRODUCCION',
    Epps = 'EPPS',
    Mantenimiento = 'MANTENIMIENTO'
}
