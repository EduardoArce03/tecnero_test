import { UnidadMedidaResponse } from '@/app/features/unidades-medida/models/unidad-medida.response';
import { TipoInventario } from '@/app/features/materiales/models/material.request';
import { LineaProduccionResponse } from '@/app/features/lineas-produccion/models/linea-produccion.response';

export interface MaterialResponse {
    uuid: string;
    codigo: string;
    nombre: string;
    descripcion: string;
    unidadMedida: UnidadMedidaResponse;
    categoria: string;
    activo: boolean;
    cantidadMinimaStock: number;
    cantidadActualStock: number;
    isBajoStock: boolean;
    tipoInventario: TipoInventario;
    lineas: LineaProduccionResponse[];
}
