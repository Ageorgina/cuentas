export class FileItem {
    public archivo: File;
    public nombreArchivo: string;
    public url: string;
    public estaSubiendo: boolean;
    public progreso: number;
    public token: string;
    public completo: boolean;
    public id: number;

    constructor( archivo: File ) {
        this.archivo = archivo;
        this.nombreArchivo = archivo.name;
        this.estaSubiendo = false;
        this.progreso = 0;
        this.url = 'NO TIENE URL';
        this.completo = false;
        this.id = archivo.lastModified;
    }
}
