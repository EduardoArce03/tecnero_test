
export interface EmpresaResponse {
    accountId: string;
    nombre: string;
    nombreRepresentante: string;
    rucEmpresa: string;
    username: string;
    // Nuevos campos de suscripción
    planNombre?: string;
    fechaExpiracion?: string; // O Date
    planActivo?: boolean;
}
