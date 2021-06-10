import { Component, OnInit, ViewChild, HostListener, AfterViewInit, ChangeDetectorRef } from '@angular/core';

import { Gasto, Usuario } from '../../../general/model';
import { Router } from '@angular/router';
import { AlertasService, DescargasService, UsuariosService, GastosService } from '../../../services';
import { MdbTableDirective, MdbTablePaginationComponent } from 'angular-bootstrap-md';
import { DomSanitizer } from '@angular/platform-browser';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-inv-gastos-generales',
  templateUrl: './inv-gastos-generales.component.html',
  styleUrls: ['./inv-gastos-generales.component.css']
})
export class InvGastosGeneralesComponent implements OnInit, AfterViewInit {
  titulo = 'Gastos Generales';
  elements = [];
  theads = ['Solicitante', 'Fecha', 'Monto', 'Tipo gasto', 'Proyecto', 'Aprobo', 'Estatus', 'Comprobantes', 'Acciones']
  loading = true;
  userLog = JSON.parse(sessionStorage.getItem('currentUser'))
  cuentas = [];
  usuarioActual: any;
  sameU: boolean;
  aprobador: boolean;
  financiero: boolean;
  tesorero: boolean;
  @ViewChild(MdbTablePaginationComponent, { static: true }) mdbTablePagination: MdbTablePaginationComponent;
  @ViewChild(MdbTableDirective, { static: true }) mdbTable: MdbTableDirective
 // elements: any = [];
  previous: any = [];

  // tslint:disable-next-line: variable-name
  constructor( private _gstS: GastosService, private _user: UsuariosService, private router: Router,private sanitizer: DomSanitizer,
               private alert: AlertasService,private http: HttpClient, private descargas: DescargasService, private cdRef: ChangeDetectorRef,) {
                this._user.cargarCuentas().subscribe(response=>{this.cuentas = response;})

             this.init();

        }

  ngOnInit() {
  }
  borrar( value ) {
    this.loading = true;
    this.elements = [];
    this._gstS.cudGastos().doc(value.id_gasto).delete().then(() => {

    this.init();
    this.alert.showSuccess();
    });
  }

  actualizar(value) {
    this.loading = true;
    this.router.navigate(['registro-gastos', `${value.id_gasto}`]);
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
  ngAfterViewInit() {
    this.mdbTablePagination.setMaxVisibleItemsNumberTo(5);
    this.mdbTablePagination.calculateFirstItemIndex();
    this.mdbTablePagination.calculateLastItemIndex();
    this.cdRef.detectChanges();
  }

  init(){
    this.elements = [];
    this._gstS.cargarGastos().subscribe(gastos => {
      gastos.filter( gasto => {
        if(this.userLog.rol == 'Administrador') {
          this.elements.push(gasto);
          gasto['arrComprobantes'] = gasto['comprobantes'].split(',');
        } else if(this.userLog.rol === 'Aprobador'){
          if(this.userLog.email == gasto['solicitante']){
            this.elements.push(gasto);
            gasto['arrComprobantes'] = gasto['comprobantes'].split(',');
          } 
        } else if(this.userLog.rol === 'Financiero' || this.userLog.rol === 'Tesorero'){
          if(gasto['estatus'] === 'Aprobado') {
            this.elements.push(gasto);
            gasto['arrComprobantes'] = gasto['comprobantes'].split(',');
          } 
        }
      });
      this.mdbTable.setDataSource(this.elements);
      this.elements = this.mdbTable.getDataSource();
      this.previous = this.mdbTable.getDataSource();
         this.loading = false;
});
  }
   download(url){
    let headers =new HttpHeaders();
    headers = headers.set('Accept', 'image/*');
    return this.http.get(url, { headers, responseType: 'blob' });
   }

}
