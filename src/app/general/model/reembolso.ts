import { FileItem } from './file-item';
export class Reembolso {
    // tslint:disable-next-line:variable-name
    id_reembolso: string;
    fecha: Date;
    cantidad: number;
    motivo: string;
    // tslint:disable-next-line: variable-name
    tipo_gasto: string;
    proyecto: string;
    estatus: string;
    // tslint:disable-next-line:variable-name
    solicitante: string;
    aprobo: string;
    comprobantes: string;
    arrComprobantes: string[];
    status: string;

}
