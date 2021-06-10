import { Component, OnInit, ViewChild, AfterViewInit, ChangeDetectorRef} from '@angular/core';
import { Reembolso } from '../../../general/model';
import { Router } from '@angular/router';
import { GastosService, AlertasService, UsuariosService, DescargasService } from '../../../services';
import { MdbTableDirective, MdbTablePaginationComponent } from 'angular-bootstrap-md';
@Component({
  selector: 'app-inv-reembolso',
  templateUrl: './inv-reembolso.component.html',
  styleUrls: ['./inv-reembolso.component.css']
})
export class InvReembolsoComponent implements OnInit, AfterViewInit  {

  titulo = 'Reembolsos';
  cuentas = [];
  elements: Reembolso[] = [];
  loading = true;
  comprobantes: any[] = [];
  same: false;
  admin: string;
  rolU: string;
  tesorero: string;
  aprobador: boolean = false;
  financiero: string;
  userLog = JSON.parse(sessionStorage.getItem('currentUser'));
  tipo: string;
  file: {} = {};
  @ViewChild(MdbTablePaginationComponent, { static: true }) mdbTablePagination: MdbTablePaginationComponent;
  @ViewChild(MdbTableDirective, { static: true }) mdbTable: MdbTableDirective
  previous: any = [];
  constructor( private _gstS: GastosService,  private cdRef: ChangeDetectorRef, private router: Router, private _user: UsuariosService,
               private alert: AlertasService, private descargas: DescargasService) {
                this._user.cargarCuentas().subscribe(response=>{this.cuentas = response;})

                 this.init();

              }

  borrar( value ) {
    this.loading = true;

    this._gstS.cudReembolsos().doc(value.id_reembolso).delete();
    this.elements = [];
    this.init();
    this.alert.showSuccess();
  }

  actualizar(value) {
    this.router.navigate(['registro-reembolso', `${value.id_reembolso}`]);
  }

  limpiar(event) {
    event = '';
  }

  descargar( file ) {
    const fecha = Date.now();
    this.descargas.descargar(file).subscribe(data => {
      const dataP = window.URL.createObjectURL(data);
      const a = document.createElement('a');
      a.href = dataP;
      if (data.type === 'application/vnd.ms-excel') {
        a.download = String(fecha) + '.xls';
      } else if (data.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
        a.download = String(fecha) + '.xlsx';
      } else if (data.type === 'text/xml') {
        a.download = String(fecha) + '.xml';
      }else {
        a.download = String(fecha);
      }
      document.body.appendChild(a);
      this.loading = false;
      a.click();
      this.alert.showSuccess();
  },
  error => {
      this.loading = false;
      this.alert.showError();
  });
  }
  ngOnInit() {
    this.loading = false;
  }
  ngAfterViewInit() {

    this.mdbTablePagination.setMaxVisibleItemsNumberTo(5);
    this.mdbTablePagination.calculateFirstItemIndex();
    this.mdbTablePagination.calculateLastItemIndex();
    this.cdRef.detectChanges();
  }
  init(){
    this._gstS.cargarReembolsos().subscribe((reembolsos: Reembolso[]) => {
      this.elements = [];
      reembolsos.filter( reembolso => {
        if(this.userLog.email === reembolso.solicitante){
            this.elements.push(reembolso);
            reembolso['arrComprobantes'] = reembolso['comprobantes'].split(',');
        } else if(this.userLog.rol === 'Administrador'){

            if(this.elements.includes(reembolso)  === false) {
            this.elements.push(reembolso);
            reembolso['arrComprobantes'] = reembolso['comprobantes'].split(',');
            }
          } else if ( this.userLog['rol'] === 'Aprobador'  ) {
            if (reembolso.estatus === 'Solicitar') {
              if(this.elements.includes(reembolso)  === false) {
              this.elements.push(reembolso);
              reembolso['arrComprobantes'] = reembolso['comprobantes'].split(',');
            }
          }
          } else if ( this.userLog['rol'] === 'Financiero' || this.userLog['rol'] === 'Tesorero' ) {
            if (reembolso.estatus === 'Aprobado' &&  this.userLog['email'] !== reembolso.solicitante) {
              if(this.elements.includes(reembolso)  === false){
              this.elements.push(reembolso);
              reembolso['arrComprobantes'] = reembolso['comprobantes'].split(',');
            } 
          }
          } 


  });

this.mdbTable.setDataSource(this.elements);
this.elements = this.mdbTable.getDataSource();
this.previous = this.mdbTable.getDataSource();
this.loading = false;
});
  }

}
