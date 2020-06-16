export class FileItem {
    public archivo: File;
    public nombreArchivo: string;
    public url: string;
    public estaSubiendo: boolean;
    public progreso: number;
    public token: string;
    public completo: boolean;
    public id: string;

    constructor( archivo: File ) {
        const tipo = archivo.type.split('/')[1];
        this.archivo = archivo;
        this.nombreArchivo = archivo.name;
        this.estaSubiendo = false;
        this.progreso = 0;
        this.url = 'NO TIENE URL';
        this.completo = false;
        this.id = String( tipo + '.' + archivo.lastModified);
    }
}
