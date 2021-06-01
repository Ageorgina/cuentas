import { Component, OnInit, ViewChild, HostListener, AfterViewInit, ChangeDetectorRef } from '@angular/core';

import { Cliente, Usuario } from '../../../general/model';
import { Router } from '@angular/router';
import { AlertasService, UsuariosService, ClientesService  } from '../../../services';
import { MdbTableDirective, MdbTablePaginationComponent } from 'angular-bootstrap-md';

@Component({
  selector: 'app-inv-clientes',
  templateUrl: './inv-clientes.component.html',
  styleUrls: ['./inv-clientes.component.css']
})
export class InvClientesComponent implements OnInit,AfterViewInit {
  titulo = 'Clientes';
  userLog = JSON.parse(sessionStorage.getItem('currentUser'))
  headTitle = ['Nombre', 'Puesto', 'Empresa', 'Celular', 'Acciones'];
  elements = [];
  loading = true;
  usuarioLocal: any;
  admin: boolean;
  sameU: boolean;
  usuarios: Usuario[];
  @ViewChild(MdbTablePaginationComponent, { static: true }) mdbTablePagination: MdbTablePaginationComponent;
  @ViewChild(MdbTableDirective, { static: true }) mdbTable: MdbTableDirective
 // elements: any = [];
  previous: any = [];
 // headElements = ['ID', 'First', 'Last', 'Handle'];
  // tslint:disable-next-line: variable-name
  constructor( private _cteS: ClientesService, private router: Router,private cdRef: ChangeDetectorRef, private alert: AlertasService, private _user: UsuariosService) {
                  this._cteS.cargarClientes().subscribe( clientes => {

                      this.elements = clientes;

                    
                    this.mdbTable.setDataSource(this.elements);
                    this.elements = this.mdbTable.getDataSource();
                    this.previous = this.mdbTable.getDataSource();

                    this.loading = false;
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
  borrar( value ) {
    this.loading = true;
    this._cteS.cudCtes().doc(value.id_cte).delete();
    this.alert.showSuccess();
    this.loading = false;
  }

  actualizar(value) {
    this.loading = true;
    this.router.navigate(['registro-clientes', `${value.id_cte}`]);
  }

}
