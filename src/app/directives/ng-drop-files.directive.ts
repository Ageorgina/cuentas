
import { Directive, EventEmitter, HostListener, Input, Output } from '@angular/core';
import { FileItem } from '../general/model';
import { AlertasService } from '../services';

@Directive({
  selector: '[appNgDropFiles]'
})
export class NgDropFilesDirective {
  existeArch: boolean;
  @Input() archivos: FileItem[] = [];
  @Output() mouseSobre: EventEmitter<boolean> = new EventEmitter();
  constructor(public alert: AlertasService) { }
  @HostListener('dragover', ['$event'])
  public onDragEnter( event: any ) {
    this.mouseSobre.emit( true );
    this._prevenirDetener( event );
  }
  @HostListener('dragleave', ['$event'])
  public onDragLeave( event: any ) {
    this.mouseSobre.emit( false );
  }
  @HostListener('drop', ['$event'])
  public onDrop( event: any ) {
    const transferencia = this._getTransferencia( event );
    if (!transferencia) {
      return ;
    }
    this._extraerArchivos( transferencia.files );
    this._prevenirDetener(event);
    this.mouseSobre.emit( false );
  }

  private _getTransferencia( event: any ) {
    return event.dataTransfer ? event.dataTransfer : event.originalEvent.dataTransfer;
  }

  private _extraerArchivos(archivosLista: FileList) {
    // tslint:disable-next-line: forin
    for ( const propiedad in Object.getOwnPropertyNames( archivosLista ) ) {
      const archivoTemporal = archivosLista[propiedad];
      if (this._archivoPuedeSerCargado( archivoTemporal ) && this.archivos.length <= 3) {
        const nuevoArchivo = new FileItem( archivoTemporal );
        if (!this.archivos.includes(nuevoArchivo)) {
          this.archivos.push(nuevoArchivo);
      }
        if (this.archivos.length > 2) {
         const excedeCapacidad = 'No se pueden agregar más de 3 archivos, solo se cargaran 3 archivos';
         this.alert.textInfo = excedeCapacidad;
         this.alert.showInfo();
       }
      }

    }
  }

  private _archivoPuedeSerCargado( archivo: File ): boolean {
    const imagen = this._esImagen( archivo.type );
    const pdf = this._esPdf( archivo.type );
    const excel = this._esExcel( archivo.type );
    if (!this._archivoDroppeado(archivo.name) && ( imagen || pdf || excel )) {
      return true;
    }
    if (!this._archivoDroppeado(archivo.name) && (!imagen || !pdf || !excel )) {
      const formatoinvalido = 'No se admite este formato';
      this.alert.textInfo = formatoinvalido;
      this.alert.showInfo();
      return false;
  }
}

  private _prevenirDetener( event ) {
    event.preventDefault();
    event.stopPropagation();
  }

  private _archivoDroppeado(nombreArchivo: string): boolean {
    for (const archivo of this.archivos) {
      if (archivo.nombreArchivo === nombreArchivo) {
        const infoexiste = 'El archivo ya existe';
        this.alert.textInfo = infoexiste;
        this.alert.showInfo();
        return true;
      }
    }
    return false;
  }

   private _esImagen(tipoArchivo: string): boolean {
     return (tipoArchivo === '' || tipoArchivo === undefined ) ? false : tipoArchivo.startsWith('image');
   }
  private _esPdf(tipoArchivo: string): boolean {
    return (tipoArchivo === '' || tipoArchivo === undefined ) ? false : tipoArchivo.startsWith('application/pdf');
  }
  private _esExcel(tipoArchivo: string): boolean {
    const xls = tipoArchivo.startsWith('application/vnd.ms-excel');
    const xlsx = tipoArchivo.startsWith('application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    return (tipoArchivo === '' || tipoArchivo === undefined ) ? false : ( xls || xlsx );
  }
}
