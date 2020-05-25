export class Oficina {
    // tslint:disable-next-line: variable-name
    id_of: string;
    // tslint:disable-next-line: variable-name
    resp_asg: string;
    fecha: Date;
    cantidad: number;
    motivo: string;
    // tslint:disable-next-line: variable-name
    id_partidafb: string;
    // tslint:disable-next-line:variable-name
    id_partida: Date;
    comprobantes: string;
    arrComprobantes: string[];
}
export class Partida {
    fecha: Date;
    cantidad: number;
    // tslint:disable-next-line:variable-name
    id_partida: Date;
    devolver: boolean;
    sobrante: number;
    devuelto: number;
    // tslint:disable-next-line:variable-name
    id_partidafb: string;

}

