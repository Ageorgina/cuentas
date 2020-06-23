import { FileItem } from './file-item';
export class Gasto {
    // tslint:disable-next-line: variable-name
    id_gasto: string;
    // tslint:disable-next-line: variable-name
    fecha: Date;
    cantidad: number;
    motivo: string;
    // tslint:disable-next-line: variable-name
    tipo_gasto: string;
    proyecto: string;
    estatus: string;
    reembolso: boolean;
    comprobantes: string;
    arrComprobantes: string[];
    // tslint:disable-next-line:variable-name
    id_proyecto: string;
    solicitante: string;
    aprobo: string;
    pago: string;
    fechaAprobo: Date;
    fechaPago: Date;
    observacionesaprobador: string;
    observacionespagado: string;
}

