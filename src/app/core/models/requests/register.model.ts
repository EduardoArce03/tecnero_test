export interface RegisterRequest {
    usuarioAdminRequest: SignUpDTO;
    planVenta: PlanType;
}

export interface SignUpDTO {
    email: string;
    password: string;
    telefono: string;
    username: string;
}

export enum PlanType {
    FREE = 'FREE',
    PRO = 'PRO',
    ENTERPRISE = 'ENTERPRISE'
}
