export interface LineaProduccion {
    uuid: string;
    nombre: string;
    descripcion: string;
    activo: boolean;
}

export interface LineaProduccionRequest {
    nombre: string;
    descripcion: string;
}
